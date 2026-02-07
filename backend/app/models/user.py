from beanie import Document, Indexed
from pydantic import EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID, uuid4

class UserSkill(Document):
    """User's current skills"""
    
    user_id: UUID
    skill_id: str
    skill_name: str
    proficiency_level: str  # beginner, intermediate, advanced
    years_of_experience: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "user_skills"
        indexes = [
            "user_id",
            "skill_id"
        ]

class User(Document):
    """User model"""
    
    user_id: UUID = Field(default_factory=uuid4)
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    full_name: Optional[str] = None
    current_role: Optional[str] = None
    experience_years: int = 0
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Settings:
        name = "users"
        indexes = [
            "email",
            "user_id"
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "full_name": "John Doe",
                "current_role": "Python Developer",
                "experience_years": 3
            }
        }
