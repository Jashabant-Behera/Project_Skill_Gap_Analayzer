from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# Request Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = Field(None, max_length=100)
    current_role: Optional[str] = Field(None, max_length=100)
    experience_years: int = Field(default=0, ge=0, le=50)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(default=1800)  # 30 minutes in seconds

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Response Schemas
class UserResponse(BaseModel):
    user_id: UUID
    email: EmailStr
    full_name: Optional[str]
    current_role: Optional[str]
    experience_years: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    current_role: Optional[str] = None
    experience_years: Optional[int] = Field(None, ge=0, le=50)

class UserSkillCreate(BaseModel):
    skill_id: str
    skill_name: str
    proficiency_level: str = Field(..., pattern="^(beginner|intermediate|advanced)$")
    years_of_experience: float = Field(default=0.0, ge=0)

class UserSkillResponse(BaseModel):
    skill_id: str
    skill_name: str
    proficiency_level: str
    years_of_experience: float
    
    class Config:
        from_attributes = True
