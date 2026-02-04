from pydantic import BaseModel
from typing import List, Optional

class Skill(BaseModel):
    id: str
    name: str
    category: str
    description: Optional[str] = None

class SkillList(BaseModel):
    skills: List[Skill]
