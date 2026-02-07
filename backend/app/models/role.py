from beanie import Document, Indexed
from pydantic import Field
from typing import List, Dict, Any
from datetime import datetime

class Skill(Document):
    """Skill definition"""
    
    skill_id: Indexed(str, unique=True)
    skill_name: str
    category: str  # technical, soft_skill, domain, tool
    description: str = ""
    sub_skills: List[str] = []
    prerequisites: List[str] = []
    difficulty_levels: List[str] = ["beginner", "intermediate", "advanced"]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "skills"
        indexes = [
            "skill_id",
            "category"
        ]

class Role(Document):
    """Role/Job definition with required skills"""
    
    role_id: Indexed(str, unique=True)
    role_name: str
    description: str = ""
    category: str  # engineering, data, design, product, etc.
    experience_level: str  # junior, mid, senior
    required_skills: List[Dict[str, Any]] = []  # {skill_id, proficiency, importance, weightage}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "roles"
        indexes = [
            "role_id",
            "category"
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "role_id": "data_scientist",
                "role_name": "Data Scientist",
                "category": "data",
                "experience_level": "mid",
                "required_skills": [
                    {
                        "skill_id": "python",
                        "proficiency_level": "advanced",
                        "importance": "mandatory",
                        "weightage": 0.2
                    }
                ]
            }
        }
