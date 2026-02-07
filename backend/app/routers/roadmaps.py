from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import List

from app.schemas.roadmap import RoadmapRequest, RoadmapResponse, RoadmapWeekResponse
from app.models.user import User
from app.models.assessment import Assessment, SkillGap
from app.models.roadmap import LearningRoadmap, RoadmapWeek
from app.core.dependencies import get_current_user
from app.services.llm_manager import llm_manager
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("", status_code=status.HTTP_201_CREATED)
async def generate_roadmap(
    roadmap_data: RoadmapRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate personalized learning roadmap"""
    
    # Get assessment
    assessment = await Assessment.find_one(
        Assessment.assessment_id == roadmap_data.assessment_id
    )
    
    if not assessment or assessment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    if assessment.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment must be completed before generating roadmap"
        )
    
    # Check if roadmap already exists
    existing_roadmap = await LearningRoadmap.find_one(
        LearningRoadmap.assessment_id == roadmap_data.assessment_id
    )
    
    if existing_roadmap:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Roadmap already exists for this assessment"
        )
    
    # Get skill gaps
    skill_gaps = await SkillGap.find(
        SkillGap.assessment_id == roadmap_data.assessment_id
    ).sort([("priority", -1), ("gap_score", -1)]).to_list()
    
    if not skill_gaps:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No skill gaps found. Assessment may not be properly completed."
        )
    
    # Prepare gaps data for LLM
    gaps_data = [
        {
            "skill_id": gap.skill_id,
            "skill_name": gap.skill_name,
            "current_level": gap.current_level,
            "required_level": gap.required_level,
            "gap_score": gap.gap_score,
            "priority": gap.priority,
            "missing_concepts": gap.missing_concepts
        }
        for gap in skill_gaps
    ]
    
    # Generate roadmap using LLM
    try:
        roadmap_data_llm = llm_manager.generate_roadmap(
            skill_gaps=gaps_data,
            user_profile={
                "current_role": current_user.current_role,
                "experience_years": current_user.experience_years,
                "known_skills": []
            },
            target_role=assessment.target_role_name,
            hours_per_week=roadmap_data.hours_per_week
        )
        
    except Exception as e:
        logger.error(f"Failed to generate roadmap: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate roadmap. Please try again."
        )
    
    # Create roadmap document
    new_roadmap = LearningRoadmap(
        assessment_id=roadmap_data.assessment_id,
        user_id=current_user.user_id,
        target_role=assessment.target_role_name,
        total_weeks=roadmap_data_llm["total_weeks"],
        hours_per_week=roadmap_data.hours_per_week,
        overview=roadmap_data_llm["overview"]
    )
    
    await new_roadmap.insert()
    
    # Identify additional skills
    additional_skill_ids = {
        gap.skill_id for gap in skill_gaps if getattr(gap, "is_additional", False)
    }
    
    # Create week documents
    for week_data in roadmap_data_llm["weeks"]:
        # Map additional skills
        is_additional_map = {}
        for skill_id in week_data["skills_to_learn"]:
             if skill_id in additional_skill_ids:
                 is_additional_map[skill_id] = True
                 
        week = RoadmapWeek(
            roadmap_id=new_roadmap.roadmap_id,
            week_number=week_data["week_number"],
            title=week_data["title"],
            skills_to_learn=week_data["skills_to_learn"],
            learning_objectives=week_data["learning_objectives"],
            estimated_hours=week_data["estimated_hours"],
            resources=week_data.get("resources", {}),
            projects=week_data.get("projects", {}),
            success_criteria=week_data.get("success_criteria", []),
            is_additional_skill=is_additional_map  # NEW
        )
        await week.insert()
    
    logger.info(f"Roadmap generated: {new_roadmap.roadmap_id} for assessment {roadmap_data.assessment_id}")
    
    return {
        "roadmap_id": new_roadmap.roadmap_id,
        "total_weeks": new_roadmap.total_weeks,
        "overview": new_roadmap.overview,
        "message": "Roadmap generated successfully!"
    }

@router.get("/{roadmap_id}", response_model=RoadmapResponse)
async def get_roadmap(
    roadmap_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """Get complete roadmap with all weeks"""
    
    # Get roadmap
    roadmap = await LearningRoadmap.find_one(
        LearningRoadmap.roadmap_id == roadmap_id
    )
    
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )
    
    # Verify ownership
    if roadmap.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this roadmap"
        )
    
    # Get all weeks
    weeks = await RoadmapWeek.find(
        RoadmapWeek.roadmap_id == roadmap_id
    ).sort("week_number").to_list()
    
    return RoadmapResponse(
        roadmap_id=roadmap.roadmap_id,
        total_weeks=roadmap.total_weeks,
        hours_per_week=roadmap.hours_per_week,
        overview=roadmap.overview,
        weeks=[RoadmapWeekResponse(**week.dict()) for week in weeks]
    )

@router.get("/{roadmap_id}/week/{week_number}", response_model=RoadmapWeekResponse)
async def get_roadmap_week(
    roadmap_id: UUID,
    week_number: int,
    current_user: User = Depends(get_current_user)
):
    """Get specific week details"""
    
    # Verify roadmap ownership
    roadmap = await LearningRoadmap.find_one(
        LearningRoadmap.roadmap_id == roadmap_id
    )
    
    if not roadmap or roadmap.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )
    
    # Get week
    week = await RoadmapWeek.find_one(
        RoadmapWeek.roadmap_id == roadmap_id,
        RoadmapWeek.week_number == week_number
    )
    
    if not week:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Week not found"
        )
    
    return RoadmapWeekResponse(**week.dict())

@router.get("/by-assessment/{assessment_id}", response_model=RoadmapResponse)
async def get_roadmap_by_assessment(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """Get roadmap for a specific assessment"""
    
    # Find roadmap
    roadmap = await LearningRoadmap.find_one(
        LearningRoadmap.assessment_id == assessment_id
    )
    
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not generated yet for this assessment"
        )
    
    # Verify ownership
    if roadmap.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    # Get all weeks
    weeks = await RoadmapWeek.find(
        RoadmapWeek.roadmap_id == roadmap.roadmap_id
    ).sort("week_number").to_list()
    
    return RoadmapResponse(
        roadmap_id=roadmap.roadmap_id,
        total_weeks=roadmap.total_weeks,
        hours_per_week=roadmap.hours_per_week,
        overview=roadmap.overview,
        weeks=[RoadmapWeekResponse(**week.dict()) for week in weeks]
    )
