from fastapi import APIRouter, Depends
from models.assessment import AssessmentSubmission
from controllers.assessment_controller import AssessmentController
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/assessment", tags=["assessment"])

@router.post("/start/{role_id}")
async def start_assessment(role_id: str, current_user=Depends(get_current_user)):
    return await AssessmentController.start_assessment(current_user["id"], role_id)

@router.post("/{assessment_id}/submit")
async def submit_assessment(assessment_id: str, submission: AssessmentSubmission, current_user=Depends(get_current_user)):
    return await AssessmentController.submit_assessment(assessment_id, submission, current_user["id"])

@router.get("/history")
async def get_history(
    current_user=Depends(get_current_user),
    limit: int = 10,
    skip: int = 0
):
    from config.db import get_db
    db = get_db()
    
    # Validate pagination params
    if limit > 100:
        limit = 100
    if limit < 1:
        limit = 10
    if skip < 0:
        skip = 0
    
    cursor = db.assessments.find(
        {"user_id": current_user["id"]}
    ).sort("timestamp", -1).skip(skip).limit(limit)
    
    history = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        history.append(doc)
    
    # Get total count for pagination metadata
    total = await db.assessments.count_documents({"user_id": current_user["id"]})
    
    return {
        "data": history,
        "pagination": {
            "total": total,
            "limit": limit,
            "skip": skip,
            "has_more": (skip + limit) < total
        }
    }
