from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID

from app.schemas.user import UserUpdate, UserResponse, UserSkillCreate, UserSkillResponse
from app.models.user import User, UserSkill
from app.models.role import Skill
from app.core.dependencies import get_current_user
from app.core.cache import cache
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update user profile"""
    
    # Update only provided fields
    update_dict = update_data.dict(exclude_unset=True)
    
    for field, value in update_dict.items():
        setattr(current_user, field, value)
    
    # Update timestamp
    current_user.updated_at = datetime.utcnow()
    
    await current_user.save()
    
    # Invalidate cache
    await cache.delete(f"user:{current_user.user_id}")
    
    logger.info(f"Profile updated for user: {current_user.email}")
    
    return UserResponse(**current_user.dict())

@router.post("/skills", response_model=UserSkillResponse, status_code=status.HTTP_201_CREATED)
async def add_user_skill(
    skill_data: UserSkillCreate,
    current_user: User = Depends(get_current_user)
):
    """Add skill to user profile"""
    
    # Validate skill exists in master data
    skill = await Skill.find_one(Skill.skill_id == skill_data.skill_id)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill '{skill_data.skill_id}' not found in catalog"
        )
    
    # Check if skill already added
    existing_skill = await UserSkill.find_one(
        UserSkill.user_id == current_user.user_id,
        UserSkill.skill_id == skill_data.skill_id
    )
    
    if existing_skill:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skill already added to profile"
        )
    
    # Create user skill
    user_skill = UserSkill(
        user_id=current_user.user_id,
        skill_id=skill_data.skill_id,
        skill_name=skill_data.skill_name,
        proficiency_level=skill_data.proficiency_level,
        years_of_experience=skill_data.years_of_experience
    )
    
    await user_skill.insert()
    
    logger.info(f"Skill added: {skill_data.skill_name} for user {current_user.email}")
    
    return UserSkillResponse(**user_skill.dict())

@router.get("/skills", response_model=List[UserSkillResponse])
async def get_user_skills(current_user: User = Depends(get_current_user)):
    """Get all user's skills"""
    
    skills = await UserSkill.find(
        UserSkill.user_id == current_user.user_id
    ).to_list()
    
    return [UserSkillResponse(**skill.dict()) for skill in skills]

@router.delete("/skills/{skill_id}")
async def remove_user_skill(
    skill_id: str,
    current_user: User = Depends(get_current_user)
):
    """Remove skill from user profile"""
    
    # Find skill
    user_skill = await UserSkill.find_one(
        UserSkill.user_id == current_user.user_id,
        UserSkill.skill_id == skill_id
    )
    
    if not user_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found in user profile"
        )
    
    await user_skill.delete()
    
    logger.info(f"Skill removed: {skill_id} for user {current_user.email}")
    
    return {"message": "Skill removed successfully"}

@router.get("/profile/complete")
async def check_profile_completion(current_user: User = Depends(get_current_user)):
    """Check if user profile is complete enough for assessment"""
    
    missing_fields = []
    
    # Check required fields
    if not current_user.full_name:
        missing_fields.append("full_name")
    
    if not current_user.current_role:
        missing_fields.append("current_role")
    
    is_student = current_user.current_role and current_user.current_role.strip().lower() == "student"
    
    if current_user.experience_years == 0 and not is_student:
        missing_fields.append("experience_years")
    
    # Check if at least one skill added
    skills_count = await UserSkill.find(
        UserSkill.user_id == current_user.user_id
    ).count()
    
    if skills_count == 0 and not is_student:
        missing_fields.append("skills (at least 1)")
    
    # Calculate completion percentage
    total_fields = 4
    completed_fields = total_fields - len(missing_fields)
    percentage = (completed_fields / total_fields) * 100
    
    is_complete = len(missing_fields) == 0
    
    return {
        "complete": is_complete,
        "percentage": round(percentage, 2),
        "missing_fields": missing_fields,
        "message": "Profile complete!" if is_complete else "Please complete your profile"
    }
