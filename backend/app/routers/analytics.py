from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import Dict, Any
from collections import defaultdict

from app.models.user import User
from app.models.assessment import Assessment, UserResponse, SkillGap, AssessmentQuestion
from app.models.role import Role
from app.core.dependencies import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/dashboard/{assessment_id}")
async def get_dashboard_data(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive dashboard data for visualization"""
    
    assessment = await Assessment.find_one(
        Assessment.assessment_id == assessment_id
    )
    
    if not assessment or assessment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    if assessment.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment not completed yet"
        )
    
    # Get data
    skill_gaps = await SkillGap.find(
        SkillGap.assessment_id == assessment_id
    ).to_list()
    
    responses = await UserResponse.find(
        UserResponse.assessment_id == assessment_id
    ).to_list()
    
    questions = await AssessmentQuestion.find(
        AssessmentQuestion.assessment_id == assessment_id
    ).to_list()
    
    # Group gaps by priority
    gaps_by_priority = {
        "high": [],
        "medium": [],
        "low": []
    }
    
    for gap in skill_gaps:
        gaps_by_priority[gap.priority].append({
            "skill_name": gap.skill_name,
            "current_level": gap.current_level,
            "required_level": gap.required_level,
            "gap_score": gap.gap_score,
            "missing_concepts": gap.missing_concepts[:5]
        })
    
    # Radar chart data
    skill_radar = []
    level_map = {"beginner": 1, "intermediate": 2, "advanced": 3}
    for gap in skill_gaps[:8]:
        skill_radar.append({
            "skill": gap.skill_name,
            "current": level_map.get(gap.current_level, 1),
            "required": level_map.get(gap.required_level, 3),
            "current_score": gap.current_score
        })
    
    # Competency distribution
    competency_dist = defaultdict(int)
    for response in responses:
        competency_dist[response.competency_level] += 1
    
    # Score by skill
    score_by_skill = {}
    for response in responses:
        question = next((q for q in questions if str(q.id) == response.question_id), None)
        if question:
            if question.skill_name not in score_by_skill:
                score_by_skill[question.skill_name] = []
            score_by_skill[question.skill_name].append(response.score)
    
    skill_averages = {
        skill: round(sum(scores) / len(scores), 2)
        for skill, scores in score_by_skill.items()
    }
    
    total_time = sum(r.time_taken_seconds for r in responses)
    avg_time = total_time / len(responses) if responses else 0
    
    return {
        "summary": {
            "overall_score": round(assessment.overall_score, 2),
            "readiness_score": round(assessment.readiness_score, 2),
            "time_taken_minutes": assessment.time_taken_minutes,
            "total_questions": len(questions),
            "target_role": assessment.target_role_name,
            "completed_at": assessment.completed_at
        },
        "skill_gaps": {
            "total": len(skill_gaps),
            "high": gaps_by_priority["high"],
            "medium": gaps_by_priority["medium"],
            "low": gaps_by_priority["low"]
        },
        "skill_radar": skill_radar,
        "statistics": {
            "average_score": round(assessment.overall_score, 2),
            "average_time_per_question": round(avg_time, 2),
            "competency_distribution": dict(competency_dist),
            "score_by_skill": skill_averages
        }
    }

@router.get("/skill-comparison/{assessment_id}")
async def get_skill_comparison(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """Compare user's skills vs role requirements"""
    
    assessment = await Assessment.find_one(
        Assessment.assessment_id == assessment_id
    )
    
    if not assessment or assessment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    skill_gaps = await SkillGap.find(
        SkillGap.assessment_id == assessment_id
    ).to_list()
    
    target_role = await Role.find_one(Role.role_id == assessment.target_role_id)
    
    comparison = []
    for gap in skill_gaps:
        req_skill = next(
            (s for s in target_role.required_skills if s["skill_id"] == gap.skill_id),
            None
        )
        
        importance = req_skill.get("importance", "important") if req_skill else "unknown"
        
        comparison.append({
            "skill_name": gap.skill_name,
            "user_level": gap.current_level or "Not assessed",
            "user_score": round(gap.current_score, 2),
            "required_level": gap.required_level,
            "gap_percentage": round(gap.gap_score, 2),
            "importance": importance,
            "priority": gap.priority,
            "status": "needs_improvement" if gap.gap_score > 30 else "on_track"
        })
    
    comparison.sort(key=lambda x: x["gap_percentage"], reverse=True)
    
    return {
        "target_role": target_role.role_name,
        "comparison": comparison,
        "total_skills": len(comparison)
    }

@router.get("/progress-timeline")
async def get_progress_timeline(current_user: User = Depends(get_current_user)):
    """Show user's assessment history and progress over time"""
    
    assessments = await Assessment.find(
        Assessment.user_id == current_user.user_id,
        Assessment.status == "completed"
    ).sort("completed_at").to_list()
    
    if not assessments:
        return {
            "message": "No completed assessments yet",
            "timeline": []
        }
    
    timeline = []
    for assessment in assessments:
        timeline.append({
            "date": assessment.completed_at,
            "assessment_id": assessment.assessment_id,
            "target_role": assessment.target_role_name,
            "overall_score": round(assessment.overall_score, 2),
            "readiness_score": round(assessment.readiness_score, 2),
            "time_taken_minutes": assessment.time_taken_minutes
        })
    
    if len(timeline) > 1:
        first_score = timeline[0]["overall_score"]
        last_score = timeline[-1]["overall_score"]
        improvement = last_score - first_score
    else:
        improvement = 0
    
    return {
        "timeline": timeline,
        "total_assessments": len(timeline),
        "improvement": round(improvement, 2),
        "average_score": round(sum(t["overall_score"] for t in timeline) / len(timeline), 2)
    }

@router.get("/export/{assessment_id}")
async def export_assessment_results(
    assessment_id: UUID,
    format: str = "json",
    current_user: User = Depends(get_current_user)
):
    """Export assessment results"""
    
    if format not in ["json", "csv"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format must be 'json' or 'csv'"
        )
    
    assessment = await Assessment.find_one(
        Assessment.assessment_id == assessment_id
    )
    
    if not assessment or assessment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    skill_gaps = await SkillGap.find(
        SkillGap.assessment_id == assessment_id
    ).to_list()
    
    responses = await UserResponse.find(
        UserResponse.assessment_id == assessment_id
    ).to_list()
    
    questions = await AssessmentQuestion.find(
        AssessmentQuestion.assessment_id == assessment_id
    ).to_list()
    
    export_data = {
        "assessment": {
            "id": str(assessment.assessment_id),
            "target_role": assessment.target_role_name,
            "overall_score": assessment.overall_score,
            "readiness_score": assessment.readiness_score,
            "completed_at": str(assessment.completed_at)
        },
        "skill_gaps": [
            {
                "skill": gap.skill_name,
                "current_level": gap.current_level,
                "required_level": gap.required_level,
                "gap_score": gap.gap_score,
                "priority": gap.priority
            }
            for gap in skill_gaps
        ],
        "responses": [
            {
                "skill": next((q.skill_name for q in questions if str(q.id) == r.question_id), "Unknown"),
                "score": r.score,
                "competency_level": r.competency_level,
                "feedback": r.evaluation_feedback
            }
            for r in responses
        ]
    }
    
    if format == "json":
        return export_data
    
    # CSV format
    if format == "csv":
        csv_data = "Skill,Current Level,Required Level,Gap Score,Priority\n"
        for gap in skill_gaps:
            csv_data += f"{gap.skill_name},{gap.current_level},{gap.required_level},{gap.gap_score},{gap.priority}\n"
        
        from fastapi.responses import Response
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=assessment_{assessment_id}.csv"
            }
        )
