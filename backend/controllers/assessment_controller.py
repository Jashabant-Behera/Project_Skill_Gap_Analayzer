from fastapi import HTTPException
from models.assessment import AssessmentInDB, Answer, AssessmentResult
from services.data_service import data_service
from config.db import get_db, oid
from datetime import datetime, timezone
import random
import os

class AssessmentController:
    @staticmethod
    async def start_assessment(user_id: str, role_id: str):
        db = get_db()
        role = data_service.get_role_by_id(role_id)
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        
        # Get questions for the required skills
        skill_ids = [rs.skillId for rs in role.required_skills]
        all_questions = data_service.get_questions_by_skills(skill_ids)
        # Select questions based on environment variable
        sample_size = min(len(all_questions), int(os.getenv("ASSESSMENT_QUESTION_COUNT", "10")))
        selected_questions = random.sample(all_questions, sample_size)
        
        assessment_data = {
            "user_id": user_id,
            "role_id": role_id,
            "timestamp": datetime.now(timezone.utc),
            "questions": [q.id for q in selected_questions],
            "answers": [],
            "score_percentage": 0.0,
            "skill_scores": {},
            "status": "in_progress"
        }
        
        result = await db.assessments.insert_one(assessment_data)
        return {
            "assessment_id": str(result.inserted_id),
            "questions": [{
                "id": q.id,
                "text": q.text,
                "options": q.options,
                "skillId": q.skillId
            } for q in selected_questions]
        }

    @staticmethod
    async def get_assessment(assessment_id: str):
        db = get_db()
        assessment = await db.assessments.find_one({"_id": oid(assessment_id)})
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        return assessment

    @staticmethod
    async def submit_assessment(assessment_id: str, submission, user_id: str):
        db = get_db()
        assessment = await db.assessments.find_one({"_id": oid(assessment_id)})
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        # Verify ownership
        if assessment["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to submit this assessment")
        
        if assessment["status"] == "completed":
            raise HTTPException(status_code=400, detail="Assessment already submitted")
        
        # Validate answers
        if not submission.answers or len(submission.answers) == 0:
            raise HTTPException(status_code=400, detail="No answers provided")
        
        # Verify question IDs match
        expected_questions = set(assessment["questions"])
        submitted_questions = set(ans.question_id for ans in submission.answers)
        
        if submitted_questions != expected_questions:
            raise HTTPException(
                status_code=400, 
                detail="Submitted answers don't match assessment questions"
            )
        
        processed_answers = []
        correct_count = 0
        skill_stats = {} # skill_id -> {correct: 0, total: 0}
        
        for ans in submission.answers:
            question = data_service.get_question_by_id(ans.question_id)
            if not question:
                continue
            
            is_correct = ans.selected_option == question.correctAnswer
            processed_answers.append({
                "question_id": ans.question_id,
                "selected_option": ans.selected_option,
                "is_correct": is_correct
            })
            
            if is_correct:
                correct_count += 1
            
            # Update skill stats
            s_id = question.skillId
            if s_id not in skill_stats:
                skill_stats[s_id] = {"correct": 0, "total": 0}
            skill_stats[s_id]["total"] += 1
            if is_correct:
                skill_stats[s_id]["correct"] += 1
        
        score_percentage = (correct_count / len(processed_answers)) * 100 if processed_answers else 0
        skill_scores = {s_id: (stat["correct"] / stat["total"]) * 100 for s_id, stat in skill_stats.items()}
        
        await db.assessments.update_one(
            {"_id": oid(assessment_id)},
            {
                "$set": {
                    "answers": processed_answers,
                    "score_percentage": score_percentage,
                    "skill_scores": skill_scores,
                    "status": "completed"
                }
            }
        )
        
        # Update User Skills - Fetch user once outside loop
        user_id_obj = assessment["user_id"]
        user = await db.users.find_one({"_id": oid(user_id_obj)})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        for s_id, score in skill_scores.items():
            user_skill = {
                "skill_id": s_id,
                "assessment_score": score,
                "source": "assessment",
                "last_updated": datetime.now(timezone.utc)
            }
            
            # Find if user already has this skill
            existing_skill = next((s for s in user.get("skills", []) if s["skill_id"] == s_id), None)
            
            if existing_skill:
                # Update existing (keep self-rating)
                await db.users.update_one(
                    {"_id": oid(user_id_obj), "skills.skill_id": s_id},
                    {
                        "$set": {
                            "skills.$.assessment_score": score,
                            "skills.$.source": "assessment", # Or 'hybrid' if both exist
                            "skills.$.last_updated": datetime.now(timezone.utc)
                        }
                    }
                )
            else:
                # Add new
                await db.users.update_one(
                    {"_id": oid(user_id_obj)},
                    {"$push": {"skills": user_skill}}
                )
        
        return {
            "score_percentage": score_percentage,
            "skill_scores": skill_scores,
            "message": "Assessment submitted successfully and skills updated"
        }
