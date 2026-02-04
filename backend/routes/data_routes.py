from fastapi import APIRouter, Depends
from typing import List
from services.data_service import data_service
from models.skill import Skill
from models.role import Role
from models.question import Question
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/data", tags=["data"])

@router.get("/skills", response_model=List[Skill])
async def get_skills():
    return data_service.get_all_skills()

@router.get("/roles", response_model=List[Role])
async def get_roles():
    return data_service.get_all_roles()

@router.get("/questions/{role_id}", response_model=List[Question])
async def get_questions_for_role(role_id: str, user=Depends(get_current_user)):
    role = data_service.get_role_by_id(role_id)
    if not role:
        return []
    skill_ids = [rs.skillId for rs in role.required_skills]
    return data_service.get_questions_by_skills(skill_ids)
