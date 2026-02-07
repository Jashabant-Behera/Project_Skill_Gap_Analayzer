from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional

from app.models.role import Role, Skill
from app.models.user import User
from app.core.dependencies import get_current_user
from app.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# ============= ROLES ENDPOINTS =============

@router.get("/roles")
async def list_roles(
    category: Optional[str] = None,
    experience_level: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE)
):
    """List all available roles"""
    
    query = {}
    if category:
        query["category"] = category
    if experience_level:
        query["experience_level"] = experience_level
    
    total = await Role.find(query).count()
    
    skip = (page - 1) * limit
    roles = await Role.find(query).skip(skip).limit(limit).to_list()
    
    return {
        "roles": [
            {
                "role_id": role.role_id,
                "role_name": role.role_name,
                "description": role.description,
                "category": role.category,
                "experience_level": role.experience_level,
                "required_skills_count": len(role.required_skills)
            }
            for role in roles
        ],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/roles/{role_id}")
async def get_role_details(role_id: str):
    """Get detailed role information with required skills"""
    
    role = await Role.find_one(Role.role_id == role_id)
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    # Enrich skill information
    enriched_skills = []
    for req_skill in role.required_skills:
        skill = await Skill.find_one(Skill.skill_id == req_skill["skill_id"])
        if skill:
            enriched_skills.append({
                "skill_id": req_skill["skill_id"],
                "skill_name": skill.skill_name,
                "proficiency_level": req_skill.get("proficiency_level", "intermediate"),
                "importance": req_skill.get("importance", "important"),
                "weightage": req_skill.get("weightage", 0.5),
                "category": skill.category,
                "prerequisites": skill.prerequisites
            })
    
    return {
        "role_id": role.role_id,
        "role_name": role.role_name,
        "description": role.description,
        "category": role.category,
        "experience_level": role.experience_level,
        "required_skills": enriched_skills
    }

# ============= SKILLS ENDPOINTS =============

@router.get("/skills")
async def list_skills(
    category: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE)
):
    """List all skills in catalog"""
    
    query = {}
    if category:
        query["category"] = category
    if search:
        query["skill_name"] = {"$regex": search, "$options": "i"}
    
    total = await Skill.find(query).count()
    
    skip = (page - 1) * limit
    skills = await Skill.find(query).skip(skip).limit(limit).to_list()
    
    return {
        "skills": [
            {
                "skill_id": skill.skill_id,
                "skill_name": skill.skill_name,
                "category": skill.category,
                "description": skill.description[:100] + "..." if len(skill.description) > 100 else skill.description,
                "has_prerequisites": len(skill.prerequisites) > 0
            }
            for skill in skills
        ],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/skills/{skill_id}")
async def get_skill_details(skill_id: str):
    """Get detailed skill information"""
    
    skill = await Skill.find_one(Skill.skill_id == skill_id)
    
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    # Get prerequisite names
    prerequisite_names = []
    for prereq_id in skill.prerequisites:
        prereq = await Skill.find_one(Skill.skill_id == prereq_id)
        if prereq:
            prerequisite_names.append(prereq.skill_name)
    
    return {
        "skill_id": skill.skill_id,
        "skill_name": skill.skill_name,
        "category": skill.category,
        "description": skill.description,
        "sub_skills": skill.sub_skills,
        "prerequisites": skill.prerequisites,
        "prerequisite_names": prerequisite_names,
        "difficulty_levels": skill.difficulty_levels
    }

# ============= ADMIN ENDPOINTS (Optional) =============

@router.post("/roles", status_code=status.HTTP_201_CREATED)
async def create_role(
    role_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Create new role (Admin only)"""
    
    # Check if role already exists
    existing = await Role.find_one(Role.role_id == role_data["role_id"])
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role ID already exists"
        )
    
    new_role = Role(**role_data)
    await new_role.insert()
    
    logger.info(f"New role created: {new_role.role_name}")
    
    return {"message": "Role created successfully", "role_id": new_role.role_id}

@router.post("/skills", status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Create new skill (Admin only)"""
    
    # Check if skill already exists
    existing = await Skill.find_one(Skill.skill_id == skill_data["skill_id"])
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skill ID already exists"
        )
    
    new_skill = Skill(**skill_data)
    await new_skill.insert()
    
    logger.info(f"New skill created: {new_skill.skill_name}")
    
    return {"message": "Skill created successfully", "skill_id": new_skill.skill_id}
