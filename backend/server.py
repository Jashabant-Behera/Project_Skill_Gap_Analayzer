import os
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
from dotenv import load_dotenv

# Load env from the same directory as this file
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Import our modules
from config.db import connect_to_mongo, close_mongo_connection, create_db_indexes
from routes.auth_routes import router as auth_router
from routes.data_routes import router as data_router
from routes.user_routes import router as user_router
from routes.assessment_routes import router as assessment_router
from routes.analysis_routes import router as analysis_router
from routes.debug_routes import router as debug_router
from services.ai_service import ai_service
from middleware.auth_middleware import get_current_user, custom_error_handler
from middleware.logging_middleware import LoggingMiddleware
from middleware.error_handlers import validation_exception_handler, mongodb_exception_handler
from fastapi import Depends
from fastapi.exceptions import RequestValidationError
from bson.errors import InvalidId
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Basic rate limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Skill Gap Analyzer API",
    description="AI-powered skill assessment and gap analysis platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
app.state.limiter = limiter

# Add middlewares
app.add_middleware(LoggingMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(InvalidId, mongodb_exception_handler)
app.add_exception_handler(RuntimeError, custom_error_handler)

# CORS configuration from environment
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    max_age=3600
)

# Startup and Shutdown events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    await create_db_indexes() # Fix 4: Maintain uniqueness

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection() # Fix 9: Safe shutdown

# Root Route
@app.get("/")
async def root():
    return {"message": "Welcome to Skill Gap Analyzer API"}

# Fix 8: Protect AI route with rate limiting
@app.get("/ai/test")
@limiter.limit("5/minute")
async def ai_test(
    request: Request,
    role: str = "Data Scientist",
    user=Depends(get_current_user)
):
    result = await ai_service.analyze_skill_gap(["Python", "SQL"], role)
    return {"analysis": result, "user": user}

# Include routers
app.include_router(auth_router)
app.include_router(data_router)
app.include_router(user_router)
app.include_router(assessment_router)
app.include_router(analysis_router)
app.include_router(debug_router)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
