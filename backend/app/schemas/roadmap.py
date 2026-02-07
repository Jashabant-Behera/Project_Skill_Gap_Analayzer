from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from uuid import UUID

class RoadmapWeekResponse(BaseModel):
    week_number: int
    title: str
    skills_to_learn: List[str]
    learning_objectives: str
    estimated_hours: int
    resources: Dict[str, Any]
    projects: Dict[str, Any]
    success_criteria: List[str]
    is_additional_skill: Dict[str, bool] = {}  # NEW: Map skill_id to is_additional status
    
    class Config:
        from_attributes = True

class RoadmapResponse(BaseModel):
    roadmap_id: UUID
    total_weeks: int
    hours_per_week: int
    overview: str
    weeks: List[RoadmapWeekResponse]
    
    class Config:
        from_attributes = True

class RoadmapRequest(BaseModel):
    assessment_id: UUID
    hours_per_week: int = Field(default=10, ge=5, le=40)
    target_weeks: Optional[int] = Field(None, ge=4, le=52)
