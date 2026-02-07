from beanie import Document
from pydantic import Field
from typing import List, Dict, Any
from datetime import datetime
from uuid import UUID, uuid4

class RoadmapWeek(Document):
    """Weekly learning plan"""
    
    roadmap_id: UUID
    week_number: int
    title: str
    skills_to_learn: List[str] = []
    learning_objectives: str
    estimated_hours: int = 10
    resources: Dict[str, Any] = {}
    projects: Dict[str, Any] = {}
    success_criteria: List[str] = []
    is_additional_skill: Dict[str, bool] = {}  # NEW: Map skill_id to is_additional status
    
    class Settings:
        name = "roadmap_weeks"
        indexes = [
            "roadmap_id",
            "week_number"
        ]

class LearningRoadmap(Document):
    """Personalized learning roadmap"""
    
    roadmap_id: UUID = Field(default_factory=uuid4)
    assessment_id: UUID
    user_id: UUID
    target_role: str
    total_weeks: int = 0
    hours_per_week: int = 10
    overview: str = ""
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "learning_roadmaps"
        indexes = [
            "assessment_id",
            "user_id"
        ]
