import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "skill_gap_analyzer")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_connection = Database()

async def connect_to_mongo():
    db_connection.client = AsyncIOMotorClient(
        MONGO_URI,
        maxPoolSize=50,
        minPoolSize=10,
        maxIdleTimeMS=30000,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000
    )
    db_connection.db = db_connection.client[DB_NAME]
    
    # Test connection
    try:
        await db_connection.client.admin.command('ping')
        print(f"✓ Connected to MongoDB: {DB_NAME}")
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
        raise

# Fix 9: Safe shutdown
async def close_mongo_connection():
    if db_connection.client:
        db_connection.client.close()
        print("MongoDB connection closed")

async def create_db_indexes():
    if db_connection.db is not None:
        # User indexes
        await db_connection.db.users.create_index("email", unique=True)
        await db_connection.db.users.create_index("created_at")
        await db_connection.db.users.create_index("proficiency_level")
        
        # Assessment indexes
        await db_connection.db.assessments.create_index("user_id")
        await db_connection.db.assessments.create_index("role_id")
        await db_connection.db.assessments.create_index([("user_id", 1), ("timestamp", -1)])
        await db_connection.db.assessments.create_index("status")
        
        # Analysis indexes
        await db_connection.db.analyses.create_index("user_id")
        await db_connection.db.analyses.create_index("assessment_id")
        await db_connection.db.analyses.create_index([("user_id", 1), ("timestamp", -1)])
        
        print("✓ Database indexes created successfully")

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException

def get_db():
    return db_connection.db

def oid(id_str: str):
    """Safely convert string to ObjectId with validation"""
    if not id_str:
        raise HTTPException(status_code=400, detail="Invalid ID: empty string")
    
    if not isinstance(id_str, str):
        raise HTTPException(status_code=400, detail="Invalid ID: must be string")
    
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(status_code=400, detail=f"Invalid ObjectId format: {id_str}")
