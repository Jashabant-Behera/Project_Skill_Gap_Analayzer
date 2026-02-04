from fastapi import APIRouter, HTTPException
from services.data_service import data_service
from config.db import get_db
import os

router = APIRouter(prefix="/debug", tags=["debug"])

@router.get("/health")
async def health_check():
    db = get_db()
    db_status = "connected" if db is not None else "disconnected"
    
    openai_key = os.getenv("OPENAI_API_KEY")
    openai_status = "present" if openai_key and len(openai_key) > 20 else "missing"
    
    return {
        "status": "ok",
        "database": db_status,
        "openai_api": openai_status,
        "data_stats": {
            "skills": len(data_service.get_all_skills()),
            "roles": len(data_service.get_all_roles()),
            "questions": len(data_service.questions)
        }
    }

@router.get("/data")
async def get_raw_data():
    # Only for development
    return {
        "skills": data_service.get_all_skills(),
        "roles": data_service.get_all_roles()
    }
