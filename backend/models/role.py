from pydantic import BaseModel
from typing import List, Optional

class RequiredSkill(BaseModel):
    skillId: str
    level: str
    priority: str

class Role(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    required_skills: List[RequiredSkill]

class RoleList(BaseModel):
    roles: List[Role]
