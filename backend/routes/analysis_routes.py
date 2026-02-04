from fastapi import APIRouter, Depends, HTTPException
from middleware.auth_middleware import get_current_user
from services.ai_service import ai_service
from services.data_service import data_service
from config.db import get_db, oid
from datetime import datetime, timezone

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("/generate/{assessment_id}")
async def generate_analysis(assessment_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    
    # 1. Get assessment data
    assessment = await db.assessments.find_one({"_id": oid(assessment_id)})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if assessment["status"] != "completed":
        raise HTTPException(status_code=400, detail="Assessment is not yet completed")
    
    # 2. Get user data (for current skills)
    user = await db.users.find_one({"email": current_user["email"]})
    user_skills = user.get("skills", [])
    
    # 3. Get role data
    role = data_service.get_role_by_id(assessment["role_id"])
    if not role:
        raise HTTPException(status_code=404, detail="Role no longer exists")
    
    # 4. Generate analysis via AI
    analysis_text = await ai_service.generate_deep_analysis(
        role.dict(),
        user_skills,
        assessment,
        user
    )
    
    # 5. Save analysis to DB
    analysis_doc = {
        "user_id": current_user["id"],
        "assessment_id": assessment_id,
        "role_id": assessment["role_id"],
        "content": analysis_text,
        "timestamp": datetime.now(timezone.utc)
    }
    
    result = await db.analyses.insert_one(analysis_doc)
    
    return {
        "id": str(result.inserted_id),
        "content": analysis_text
    }

@router.get("/history")
async def get_analysis_history(
    current_user=Depends(get_current_user),
    limit: int = 10,
    skip: int = 0
):
    db = get_db()
    
    # Validate pagination params
    if limit > 100:
        limit = 100
    if limit < 1:
        limit = 10
    if skip < 0:
        skip = 0
    
    cursor = db.analyses.find(
        {"user_id": current_user["id"]}
    ).sort("timestamp", -1).skip(skip).limit(limit)
    
    history = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        history.append(doc)
    
    # Get total count for pagination metadata
    total = await db.analyses.count_documents({"user_id": current_user["id"]})
    
    return {
        "data": history,
        "pagination": {
            "total": total,
            "limit": limit,
            "skip": skip,
            "has_more": (skip + limit) < total
        }
    }

@router.get("/{analysis_id}")
async def get_analysis(analysis_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    analysis = await db.analyses.find_one({"_id": oid(analysis_id), "user_id": current_user["id"]})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    analysis["id"] = str(analysis["_id"])
    del analysis["_id"]
    return analysis
