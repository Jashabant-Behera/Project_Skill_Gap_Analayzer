from beanie import Document
from pydantic import Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID, uuid4

class AssessmentQuestion(Document):
    """Generated assessment question"""
    
    assessment_id: UUID
    skill_id: str
    skill_name: str
    question_text: str
    question_type: str  # mcq, short_answer, scenario, coding
    difficulty_level: str  # beginner, intermediate, advanced
    options: Optional[List[str]] = None  # For MCQ
    correct_answer: Optional[str] = None  # For MCQ
    expected_competency: List[str] = []
    evaluation_criteria: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "assessment_questions"
        indexes = [
            "assessment_id",
            "skill_id"
        ]

class UserResponse(Document):
    """User's response to a question"""
    
    assessment_id: UUID
    question_id: str  # Reference to AssessmentQuestion
    skill_id: Optional[str] = None  # Added for analysis context
    user_answer: str
    score: float = 0.0
    competency_level: Optional[str] = None
    evaluation_feedback: Optional[str] = None
    strengths: List[str] = []
    gaps: List[str] = []
    missing_concepts: List[str] = []
    time_taken_seconds: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "user_responses"
        indexes = [
            "assessment_id",
            "question_id"
        ]

class SkillGap(Document):
    """Identified skill gap"""
    
    assessment_id: UUID
    skill_id: str
    skill_name: str
    current_level: Optional[str] = None
    current_score: float = 0.0
    required_level: str
    gap_score: float = 0.0
    priority: str  # high, medium, low
    estimated_learning_weeks: int = 0
    missing_concepts: List[str] = []
    is_additional: bool = False  # NEW: Flag for custom learning goals
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "skill_gaps"
        indexes = [
            "assessment_id",
            "priority"
        ]

class Assessment(Document):
    """Main assessment document"""
    
    assessment_id: UUID = Field(default_factory=uuid4)
    user_id: UUID
    target_role_id: str
    target_role_name: str
    additional_learning_goals: List[Dict[str, Any]] = []  # NEW: User's custom learning goals
    status: str = "in_progress"  # in_progress, completed, abandoned
    overall_score: float = 0.0
    readiness_score: float = 0.0
    total_questions: int = 0
    answered_questions: int = 0
    time_taken_minutes: int = 0
    time_taken_seconds: int = 0  # NEW: More accurate tracking
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Settings:
        name = "assessments"
        indexes = [
            "user_id",
            "assessment_id",
            "status"
        ]
