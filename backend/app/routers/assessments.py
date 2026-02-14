from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import math

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

# Add file handler for debugging errors
file_handler = logging.FileHandler('error_debug.log')
file_handler.setLevel(logging.ERROR)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

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
    
    try:
        logger.info(f"Starting assessment creation for user: {current_user.user_id}")
        
        # Check profile completion
        profile_check = await check_profile_complete(current_user)
        if not profile_check["complete"]:
            logger.warning(f"Profile incomplete for user {current_user.user_id}: {profile_check['missing_fields']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "Profile incomplete",
                    "missing_fields": profile_check["missing_fields"]
                }
            )
        
        # Validate target role exists
        logger.info(f"Validating target role: {assessment_data.target_role_id}")
        target_role = await Role.find_one(Role.role_id == assessment_data.target_role_id)
        if not target_role:
            logger.error(f"Target role not found: {assessment_data.target_role_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Target role not found"
            )
        
        # Get user's known skills
        logger.info("Fetching user skills...")
        user_skills = await UserSkill.find(
            UserSkill.user_id == current_user.user_id
        ).to_list()
        
        known_skill_ids = [
            skill.skill_id for skill in user_skills 
            if skill.proficiency_level in ["intermediate", "advanced"]
        ]
        logger.info(f"Known skills: {known_skill_ids}")
        
        # Get skills to assess
        skills_to_assess = []
        # Handle case where required_skills might be None or invalid
        if not target_role.required_skills:
            target_role.required_skills = []
            
        for req_skill in target_role.required_skills:
            # Handle dict access safely
            if isinstance(req_skill, dict):
                skill_id = req_skill.get("skill_id")
                if skill_id and skill_id not in known_skill_ids:
                    skills_to_assess.append(skill_id)
        
        # NEW: Add user's additional skills to learn
        additional_skill_ids = []
        if assessment_data.additional_skills_to_learn:
            logger.info("Processing additional skills...")
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
        logger.info(f"Skills to assess: {skills_to_assess}")
        
        if not skills_to_assess:
            logger.warning("No skills to assess.")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No skills to assess. You already know all required skills!"
            )
        
        
        # Calculate questions per skill (Min 20 total, Min 3 per skill)
        num_skills = len(skills_to_assess)
        questions_per_skill = max(3, math.ceil(20 / num_skills)) if num_skills > 0 else 0
        total_questions = num_skills * questions_per_skill
        
        logger.info(f"Assessment Plan: {num_skills} skills, {questions_per_skill} questions/skill, Total: {total_questions}")
        
        # Create assessment
        new_assessment = Assessment(
            user_id=current_user.user_id,
            target_role_id=target_role.role_id,
            target_role_name=target_role.role_name,
            status="in_progress",
            additional_learning_goals=additional_skill_ids,
            total_questions=total_questions,
            answered_questions=0
        )
        
        logger.info("Inserting new assessment...")
        await new_assessment.insert()
        
        logger.info(f"Assessment created: {new_assessment.assessment_id} for user {current_user.email}")
        
        return {
            "assessment_id": new_assessment.assessment_id,
            "target_role_name": target_role.role_name,
            "skills_to_assess": skills_to_assess,
            "total_skills": len(skills_to_assess),
            "message": "Assessment started successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating assessment: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

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
    required_skill_ids = []
    if target_role and target_role.required_skills:
        for s in target_role.required_skills:
             if isinstance(s, dict) and "skill_id" in s:
                 required_skill_ids.append(s["skill_id"])
    
    # Add additional skills
    if assessment.additional_learning_goals:
        for goal in assessment.additional_learning_goals:
            if isinstance(goal, dict) and "skill_id" in goal:
                if goal["skill_id"] not in required_skill_ids:
                    required_skill_ids.append(goal["skill_id"])
            
    # Count questions per skill
    skill_counts = {}
    for q in existing_questions:
        skill_counts[q.skill_id] = skill_counts.get(q.skill_id, 0) + 1
    
    # Re-filter specific logic inline:
    user_skills_list = await UserSkill.find(UserSkill.user_id == current_user.user_id).to_list()
    known_ids = [s.skill_id for s in user_skills_list if s.proficiency_level in ["intermediate", "advanced"]]
    
    logger.info(f"Finding next question. Required: {required_skill_ids}, Known: {known_ids}, Counts: {skill_counts}")

    # Check for unanswered existing questions
    responses = await UserResponse.find(
        UserResponse.assessment_id == assessment_id
    ).to_list()
    answered_question_ids = [r.question_id for r in responses]
    
    for q in existing_questions:
        if str(q.id) not in answered_question_ids:
            # Found an unanswered question, return it
            return QuestionResponse(
                question_id=str(q.id),
                skill_name=q.skill_name,
                question_text=q.question_text,
                question_type=q.question_type,
                difficulty_level=q.difficulty_level,
                options=q.options,
                time_limit_seconds=300 # Default
            )
            
    next_skill_id = None
    questions_per_skill = 1
    
    # RE-Login for next skill selection:
    # 1. Identify ALL skills that need assessment (re-run the loop or store them)
    skills_that_need_assessment = []
    for skill_id in required_skill_ids:
        is_additional = False
        if assessment.additional_learning_goals:
            for g in assessment.additional_learning_goals:
                if g.get("skill_id") == skill_id:
                     is_additional = True
                     break
        
        if skill_id not in known_ids or is_additional:
            skills_that_need_assessment.append(skill_id)
            
    # 2. Calculate dynamic limit
    num_skills = len(skills_that_need_assessment)
    if num_skills > 0:
        questions_per_skill = max(3, math.ceil(20 / num_skills))
    else:
        questions_per_skill = 0
        
    # 3. Find first skill below limit
    for skill_id in skills_that_need_assessment:
        if skill_counts.get(skill_id, 0) < questions_per_skill:
            next_skill_id = skill_id
            break
    
    if not next_skill_id:
        logger.warning(f"No next skill found for assessment {assessment_id}")
        # Build detailed debug info
        debug_info = {
            "required": required_skill_ids,
            "known": known_ids,
            "counts": skill_counts,
            "additional": [g.get("skill_id") for g in assessment.additional_learning_goals or []]
        }
        logger.warning(f"Debug Info: {debug_info}")
        
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
    from beanie import PydanticObjectId
    try:
        q_id = PydanticObjectId(answer_data.question_id)
        question = await AssessmentQuestion.get(q_id)
    except Exception:
        question = None
    
    if not question or question.assessment_id != assessment_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found or does not belong to this assessment"
        )
    
    # Check if already answered
    existing_response = await UserResponse.find_one(
        UserResponse.assessment_id == assessment_id,
        UserResponse.question_id == answer_data.question_id
    )
    
    # Update assessment progress (self-healing)
    answered_count = await UserResponse.find(
        UserResponse.assessment_id == assessment_id
    ).count()
    
    if assessment.answered_questions != answered_count:
        assessment.answered_questions = answered_count
        await assessment.save()

    if existing_response:
        # Return existing evaluation to handle idempotent retries
        return EvaluationResponse(
            question_id=existing_response.question_id,
            score=existing_response.score,
            competency_level=existing_response.competency_level or "intermediate",
            feedback=existing_response.evaluation_feedback or "",
            strengths=existing_response.strengths or [],
            gaps=existing_response.gaps or [],
            missing_concepts=existing_response.missing_concepts or []
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
    answered_count = await UserResponse.find(
        UserResponse.assessment_id == assessment_id
    ).count()
    
    assessment.answered_questions = answered_count
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
    
    try:
        # Check all questions answered
        if assessment.answered_questions < assessment.total_questions:
            # Check if we mistakenly incremented answered_questions?
            # Or if questions were skipped?
            # For now, we allow completion if at least 1 question is answered? No, strictly check unless debugging.
            # actually, if user is stuck, we probably want to allow force completion?
            # But let's stick to logic.
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Please answer all questions. {assessment.answered_questions}/{assessment.total_questions} answered."
            )
        
        # Get all responses
        responses = await UserResponse.find(
            UserResponse.assessment_id == assessment_id
        ).to_list()
        
        # Fetch questions to map skill_ids (Analyzer needs skill_id)
        questions = await AssessmentQuestion.find(
            AssessmentQuestion.assessment_id == assessment_id
        ).to_list()
        question_map = {str(q.id): q.skill_id for q in questions}
        
        # Enrich responses with skill_id dynamically
        for r in responses:
            if hasattr(r, 'question_id') and r.question_id in question_map:
                setattr(r, 'skill_id', question_map[r.question_id])
        
        # Calculate overall score
        if responses:
            overall_score = sum(r.score for r in responses) / len(responses)
        else:
            overall_score = 0
        
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
    except Exception as e:
        logger.error(f"Error completing assessment: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete assessment: {str(e)}"
        )

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
