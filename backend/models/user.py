from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime, timezone
import re

class UserSkill(BaseModel):
    skill_id: str
    self_rating: Optional[int] = None  # 1-5 for self-reported
    assessment_score: Optional[float] = None  # 0-100 for assessed
    source: str  # "self-reported" | "assessment"
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None
    proficiency_level: str = "beginner" # "beginner" | "intermediate" | "professional"
    target_role: Optional[str] = None # role_id

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserInDB(UserBase):
    id: Optional[str] = Field(None, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    skills: List[UserSkill] = Field(default_factory=list)

class UserResponse(UserBase):
    id: str
    created_at: datetime
    skills: List[UserSkill] = Field(default_factory=list)

    class Config:
        populate_by_name = True
