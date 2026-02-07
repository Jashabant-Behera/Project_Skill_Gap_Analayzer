from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    
db = Database()

async def connect_to_mongo():
    """Connect to MongoDB"""
    try:
        db.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=10000,
            uuidRepresentation="standard"
        )
        
        # Import all models
        from app.models.user import User, UserSkill
        from app.models.assessment import (
            Assessment, AssessmentQuestion, 
            UserResponse, SkillGap
        )
        from app.models.roadmap import LearningRoadmap, RoadmapWeek
        from app.models.role import Role, Skill
        
        # Initialize Beanie with all models
        await init_beanie(
            database=db.client[settings.MONGODB_DB_NAME],
            document_models=[
                User,
                UserSkill,
                Assessment,
                AssessmentQuestion,
                UserResponse,
                SkillGap,
                LearningRoadmap,
                RoadmapWeek,
                Role,
                Skill
            ]
        )
        
        logger.info("Connected to MongoDB successfully")
        logger.info(f"Database: {settings.MONGODB_DB_NAME}")
        
    except Exception as e:
        logger.error(f"Could not connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        logger.info("Closed MongoDB connection")
