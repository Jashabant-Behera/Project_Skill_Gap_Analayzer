from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class Answer(BaseModel):
    question_id: str
    selected_option: str
    is_correct: Optional[bool] = None

class AssessmentBase(BaseModel):
    user_id: str
    role_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentSubmission(BaseModel):
    answers: List[Answer]

class AssessmentResult(AssessmentBase):
    id: str
    answers: List[Answer]
    score_percentage: float
    skill_scores: Dict[str, float] # skill_id -> score
    status: str = "completed"

class AssessmentInDB(AssessmentBase):
    id: Optional[str] = Field(None, alias="_id")
    answers: List[Answer]
    score_percentage: float
    skill_scores: Dict[str, float]
    status: str
