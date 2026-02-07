from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class AdditionalSkillRequest(BaseModel):
    """Skill that user wants to learn additionally"""
    skill_id: str
    skill_name: str
    reason: Optional[str] = None  # Why they want to learn it
    desired_proficiency: str = Field(
        default="intermediate",
        pattern="^(beginner|intermediate|advanced)$"
    )

class AssessmentCreate(BaseModel):
    target_role_id: str
    additional_skills_to_learn: List[AdditionalSkillRequest] = Field(default_factory=list)  # NEW: Skills to add as gaps

class QuestionResponse(BaseModel):
    question_id: str
    skill_id: str
    skill_name: str
    question_text: str
    question_type: str
    difficulty_level: str
    options: Optional[List[str]] = None
    
    class Config:
        from_attributes = True

class AnswerSubmit(BaseModel):
    question_id: str
    user_answer: str
    time_taken_seconds: int = 0

class EvaluationResponse(BaseModel):
    question_id: str
    score: float
    competency_level: str
    feedback: str
    strengths: List[str]
    gaps: List[str]
    missing_concepts: List[str]

class AssessmentStatus(BaseModel):
    assessment_id: UUID
    status: str
    overall_score: float
    answered_questions: int
    total_questions: int
    
    class Config:
        from_attributes = True

class SkillGapResponse(BaseModel):
    skill_name: str
    current_level: Optional[str]
    current_score: float
    required_level: str
    gap_score: float
    priority: str
    missing_concepts: List[str]
    is_additional: bool = False
    
    class Config:
        from_attributes = True
