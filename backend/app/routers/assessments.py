from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.schemas.assessment import (
    AssessmentCreate, QuestionResponse, AnswerSubmit,
    EvaluationResponse, AssessmentStatus, SkillGapResponse
)
from app.models.user import User, UserSkill
from app.models.assessment import Assessment, AssessmentQuestion, UserResponse, SkillGap
from app.models.role import Role, Skill
from app.core.dependencies import get_current_user
from app.services.llm_manager import llm_manager
from app.services.skill_gap_analyzer import skill_gap_analyzer
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

async def check_profile_complete(user: User) -> dict:
    """Check if user profile is complete"""
    missing = []
    
    if not user.full_name:
        missing.append("full_name")
    if not user.current_role:
        missing.append("current_role")
    if user.experience_years == 0:
        missing.append("experience_years")
    
    skills_count = await UserSkill.find(UserSkill.user_id == user.user_id).count()
    if skills_count == 0:
        missing.append("skills")
    
    return {
        "complete": len(missing) == 0,
        "missing_fields": missing
    }

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment_data: AssessmentCreate,
    current_user: User = Depends(get_current_user)
):
    """Start a new assessment"""
    
    # Check profile completion
    profile_check = await check_profile_complete(current_user)
    if not profile_check["complete"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "Profile incomplete",
                "missing_fields": profile_check["missing_fields"]
            }
        )
    
    # Validate target role exists
    target_role = await Role.find_one(Role.role_id == assessment_data.target_role_id)
    if not target_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target role not found"
        )
    
    # Get user's known skills
    user_skills = await UserSkill.find(
        UserSkill.user_id == current_user.user_id
    ).to_list()
    
    known_skill_ids = [
        skill.skill_id for skill in user_skills 
        if skill.proficiency_level in ["intermediate", "advanced"]
    ]
    
    # Get skills to assess
    skills_to_assess = []
    for req_skill in target_role.required_skills:
        if req_skill["skill_id"] not in known_skill_ids:
            skills_to_assess.append(req_skill["skill_id"])
    
    # NEW: Add user's additional skills to learn
    additional_skill_ids = []
    for add_skill in assessment_data.additional_skills_to_learn:
        # Validate skill exists
        skill = await Skill.find_one(Skill.skill_id == add_skill.skill_id)
        if skill:
            skills_to_assess.append(add_skill.skill_id)
            additional_skill_ids.append({
                "skill_id": add_skill.skill_id,
                "skill_name": add_skill.skill_name,
                "desired_proficiency": add_skill.desired_proficiency,
                "reason": add_skill.reason
            })
    
    skills_to_assess = list(set(skills_to_assess))
    
    if not skills_to_assess:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No skills to assess. You already know all required skills!"
        )
    
    # Create assessment
    new_assessment = Assessment(
        user_id=current_user.user_id,
        target_role_id=target_role.role_id,
        target_role_name=target_role.role_name,
        status="in_progress",
        additional_learning_goals=additional_skill_ids  # NEW field
    )
    
    await new_assessment.insert()
    
    logger.info(f"Assessment created: {new_assessment.assessment_id} for user {current_user.email}")
    
    return {
        "assessment_id": new_assessment.assessment_id,
        "target_role_name": target_role.role_name,
        "skills_to_assess": skills_to_assess,
        "total_skills": len(skills_to_assess),
        "message": "Assessment started successfully"
    }

@router.get("/{assessment_id}/questions/next", response_model=QuestionResponse)
async def get_next_question(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """Get next question for assessment"""
    
    assessment = await Assessment.find_one(Assessment.assessment_id == assessment_id)
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    if assessment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this assessment"
        )
    
    if assessment.status != "in_progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment is not in progress"
        )
    
    # Get existing questions
    existing_questions = await AssessmentQuestion.find(
        AssessmentQuestion.assessment_id == assessment_id
    ).to_list()
    
    assessed_skills = [q.skill_id for q in existing_questions]
    
    # Get target role
    target_role = await Role.find_one(Role.role_id == assessment.target_role_id)
    required_skill_ids = [s["skill_id"] for s in target_role.required_skills]
    
    # Find next skill
    next_skill_id = None
    for skill_id in required_skill_ids:
        if skill_id not in assessed_skills:
            next_skill_id = skill_id
            break
    
    if not next_skill_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All skills have been assessed. Please complete the assessment."
        )
    
    # Get skill details
    skill = await Skill.find_one(Skill.skill_id == next_skill_id)
    
    # Build user context
    user_skills = await UserSkill.find(UserSkill.user_id == current_user.user_id).to_list()
    
    user_context = {
        "current_role": current_user.current_role,
        "years_of_experience": current_user.experience_years,
        "known_skills": [s.skill_name for s in user_skills]
    }
    
    # Generate question
    try:
        questions = llm_manager.generate_questions(
            skill=skill.skill_name,
            target_role=target_role.role_name,
            experience_level="intermediate",
            user_context=user_context,
            num_questions=1
        )
        
        question_data = questions[0]
        
    except Exception as e:
        logger.error(f"Failed to generate question: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate question. Please try again."
        )
    
    # Save question
    new_question = AssessmentQuestion(
        assessment_id=assessment_id,
        skill_id=question_data["skill_id"],
        skill_name=question_data["skill_name"],
        question_text=question_data["question_text"],
        question_type=question_data["question_type"],
        difficulty_level=question_data["difficulty_level"],
        options=question_data.get("options"),
        correct_answer=question_data.get("correct_answer"),
        expected_competency=question_data["expected_competency"],
        evaluation_criteria=question_data["evaluation_criteria"]
    )
    
    await new_question.insert()
    
    assessment.total_questions += 1
    await assessment.save()
    
    logger.info(f"Question generated for assessment {assessment_id}, skill: {skill.skill_name}")
    
    # Return without correct answer
    response_data = new_question.dict()
    response_data["question_id"] = str(new_question.id)
    del response_data["correct_answer"]
    
    return QuestionResponse(**response_data)

@router.post("/{assessment_id}/answers", response_model=EvaluationResponse)
async def submit_answer(
    assessment_id: UUID,
    answer_data: AnswerSubmit,
    current_user: User = Depends(get_current_user)
):
    """Submit answer to a question"""
    
    assessment = await Assessment.find_one(Assessment.assessment_id == assessment_id)
    
    if not assessment or assessment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Get question
    from bson import ObjectId
    question = await AssessmentQuestion.get(ObjectId(answer_data.question_id))
    
    if not question or question.assessment_id != assessment_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Check if already answered
    existing_response = await UserResponse.find_one(
        UserResponse.assessment_id == assessment_id,
        UserResponse.question_id == answer_data.question_id
    )
    
    if existing_response:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question already answered"
        )
    
    # Evaluate answer
    try:
        evaluation = llm_manager.evaluate_response(
            question=question.dict(),
            user_answer=answer_data.user_answer,
            skill_name=question.skill_name
        )
        
    except Exception as e:
        logger.error(f"Failed to evaluate answer: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to evaluate answer. Please try again."
        )
    
    # Save response
    user_response = UserResponse(
        assessment_id=assessment_id,
        question_id=answer_data.question_id,
        user_answer=answer_data.user_answer,
        score=evaluation["score"],
        competency_level=evaluation["competency_level"],
        evaluation_feedback=evaluation["feedback"],
        strengths=evaluation["strengths"],
        gaps=evaluation["gaps"],
        missing_concepts=evaluation["missing_concepts"],
        time_taken_seconds=answer_data.time_taken_seconds
    )
    
    await user_response.insert()
    
    # Update assessment
    assessment.answered_questions += 1
    assessment.time_taken_minutes += answer_data.time_taken_seconds // 60
    await assessment.save()
    
    logger.info(f"Answer evaluated for assessment {assessment_id}")
    
    return EvaluationResponse(
        question_id=answer_data.question_id,
        score=evaluation["score"],
        competency_level=evaluation["competency_level"],
        feedback=evaluation["feedback"],
        strengths=evaluation["strengths"],
        gaps=evaluation["gaps"],
        missing_concepts=evaluation["missing_concepts"]
    )

@router.get("/{assessment_id}/progress", response_model=AssessmentStatus)
async def get_assessment_progress(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """Get assessment progress"""
    
    assessment = await Assessment.find_one(Assessment.assessment_id == assessment_id)
    
    if not assessment or assessment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Calculate overall score
    responses = await UserResponse.find(
        UserResponse.assessment_id == assessment_id
    ).to_list()
    
    if responses:
        overall_score = sum(r.score for r in responses) / len(responses)
    else:
        overall_score = 0.0
    
    return AssessmentStatus(
        assessment_id=assessment_id,
        status=assessment.status,
        overall_score=round(overall_score, 2),
        answered_questions=assessment.answered_questions,
        total_questions=assessment.total_questions
    )

@router.post("/{assessment_id}/complete")
async def complete_assessment(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """Complete assessment and generate skill gap analysis"""
    
    assessment = await Assessment.find_one(Assessment.assessment_id == assessment_id)
    
    if not assessment or assessment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Check all questions answered
    if assessment.answered_questions < assessment.total_questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Please answer all questions. {assessment.answered_questions}/{assessment.total_questions} answered."
        )
    
    # Get all responses
    responses = await UserResponse.find(
        UserResponse.assessment_id == assessment_id
    ).to_list()
    
    # Calculate overall score
    overall_score = sum(r.score for r in responses) / len(responses)
    
    # Get target role
    target_role = await Role.find_one(Role.role_id == assessment.target_role_id)
    
    # Analyze skill gaps
    skill_gaps = await skill_gap_analyzer.analyze_gaps(
        assessment_results=responses,
        target_role_requirements=target_role.dict(),
        user_profile=current_user.dict(),
        additional_goals=assessment.additional_learning_goals
    )
    
    # Save skill gaps
    for gap in skill_gaps["skill_gaps"]:
        skill_gap = SkillGap(
            assessment_id=assessment_id,
            skill_id=gap["skill_id"],
            skill_name=gap["skill_name"],
            current_level=gap.get("current_level"),
            current_score=gap["current_score"],
            required_level=gap["required_level"],
            gap_score=gap["gap_score"],
            priority=gap["priority"],
            estimated_learning_weeks=gap.get("estimated_learning_time", 0),
            missing_concepts=gap.get("missing_concepts", []),
            is_additional=gap.get("is_additional", False)
        )
        await skill_gap.insert()
    
    # Update assessment
    assessment.overall_score = overall_score
    assessment.readiness_score = skill_gaps["overall_readiness_score"]
    assessment.status = "completed"
    assessment.completed_at = datetime.utcnow()
    await assessment.save()
    
    logger.info(f"Assessment completed: {assessment_id}")
    
    return {
        "assessment_id": assessment_id,
        "overall_score": round(overall_score, 2),
        "readiness_score": round(skill_gaps["overall_readiness_score"], 2),
        "skill_gaps_count": len(skill_gaps["skill_gaps"]),
        "high_priority_gaps": skill_gaps["high_priority_gaps"],
        "message": "Assessment completed successfully!"
    }

@router.get("/{assessment_id}/results")
async def get_assessment_results(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """Get detailed assessment results"""
    
    assessment = await Assessment.find_one(Assessment.assessment_id == assessment_id)
    
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
    
    # Get all data
    skill_gaps = await SkillGap.find(
        SkillGap.assessment_id == assessment_id
    ).to_list()
    
    questions = await AssessmentQuestion.find(
        AssessmentQuestion.assessment_id == assessment_id
    ).to_list()
    
    responses = await UserResponse.find(
        UserResponse.assessment_id == assessment_id
    ).to_list()
    
    # Group by priority
    gaps_by_priority = {
        "high": [g for g in skill_gaps if g.priority == "high"],
        "medium": [g for g in skill_gaps if g.priority == "medium"],
        "low": [g for g in skill_gaps if g.priority == "low"]
    }
    
    # Calculate statistics
    score_by_skill = {}
    for response in responses:
        question = next((q for q in questions if str(q.id) == response.question_id), None)
        if question:
            if question.skill_id not in score_by_skill:
                score_by_skill[question.skill_id] = []
            score_by_skill[question.skill_id].append(response.score)
    
    skill_averages = {
        skill: sum(scores) / len(scores)
        for skill, scores in score_by_skill.items()
    }
    
    return {
        "assessment": {
            "assessment_id": assessment_id,
            "target_role": assessment.target_role_name,
            "overall_score": assessment.overall_score,
            "readiness_score": assessment.readiness_score,
            "time_taken_minutes": assessment.time_taken_minutes,
            "completed_at": assessment.completed_at
        },
        "skill_gaps": {
            "total": len(skill_gaps),
            "by_priority": {
                "high": [SkillGapResponse(**g.dict()) for g in gaps_by_priority["high"]],
                "medium": [SkillGapResponse(**g.dict()) for g in gaps_by_priority["medium"]],
                "low": [SkillGapResponse(**g.dict()) for g in gaps_by_priority["low"]]
            }
        },
        "statistics": {
            "total_questions": len(questions),
            "average_score": assessment.overall_score,
            "score_by_skill": skill_averages,
            "total_time_minutes": assessment.time_taken_minutes
        }
    }

@router.get("", response_model=dict)
async def list_assessments(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None
):
    """List user's assessments with pagination"""
    
    # Build query
    query = {"user_id": current_user.user_id}
    if status:
        query["status"] = status
    
    # Get total count
    total = await Assessment.find(query).count()
    
    # Get paginated results
    skip = (page - 1) * limit
    assessments = await Assessment.find(query).skip(skip).limit(limit).sort("-created_at").to_list()
    
    return {
        "assessments": [
            {
                "assessment_id": a.assessment_id,
                "target_role": a.target_role_name,
                "status": a.status,
                "overall_score": a.overall_score,
                "created_at": a.created_at,
                "completed_at": a.completed_at
            }
            for a in assessments
        ],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }
