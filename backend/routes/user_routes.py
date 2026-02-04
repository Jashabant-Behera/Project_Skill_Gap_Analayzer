from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from models.user import UserResponse, UserSkill
from middleware.auth_middleware import get_current_user
from config.db import get_db, oid
from datetime import datetime, timezone
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])

class SelfRateRequest(BaseModel):
    skill_id: str
    rating: int # 1-5

@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    db = get_db()
    user = await db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user["_id"])
    return user

@router.post("/me/skills/self-rate")
async def self_rate_skill(req: SelfRateRequest, current_user=Depends(get_current_user)):
    from services.data_service import data_service
    db = get_db()
    
    # 1. Get full user to check proficiency
    user = await db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 2. Beginners cannot self-rate (Must take assessment)
    if user.get("proficiency_level") == "beginner":
        raise HTTPException(status_code=400, detail="Beginners must complete assessment to add skills")
    
    # 3. Validate skill exists
    all_skills = [s.id for s in data_service.get_all_skills()]
    if req.skill_id not in all_skills:
        raise HTTPException(status_code=400, detail=f"Invalid skill: {req.skill_id}")
    
    # 4. Rating validation
    if not (1 <= req.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # Upsert skill in user's skills array using atomic operation
    new_skill = {
        "skill_id": req.skill_id,
        "self_rating": req.rating,
        "source": "self-reported",
        "last_updated": datetime.now(timezone.utc)
    }
    
    # Atomic update: update if exists, insert if not
    result = await db.users.update_one(
        {"email": current_user["email"], "skills.skill_id": req.skill_id},
        {
            "$set": {
                "skills.$.self_rating": req.rating,
                "skills.$.source": "self-reported",
                "skills.$.last_updated": datetime.now(timezone.utc)
            }
        }
    )
    
    # If no document was modified, skill doesn't exist - add it
    if result.modified_count == 0:
        await db.users.update_one(
            {"email": current_user["email"]},
            {"$push": {"skills": new_skill}}
        )
    
    return {"message": "Skill rated successfully", "skill": new_skill}

@router.get("/me/skills", response_model=List[UserSkill])
async def get_my_skills(current_user=Depends(get_current_user)):
    db = get_db()
    user = await db.users.find_one({"email": current_user["email"]}, {"skills": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.get("skills", [])
