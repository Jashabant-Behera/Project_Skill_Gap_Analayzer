from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging
import time

from app.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection, ensure_indexes
from app.core.cache import cache
from app.core.rate_limit import limiter, rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Import routers
from app.routers import auth, users, assessments, roadmaps, analytics, master_data

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Skill Assessment Platform...")
    
    try:
        # Connect to MongoDB
        await connect_to_mongo()
        await ensure_indexes()
        
        # Connect to Redis
        await cache.connect()
        
        logger.info(f"LLM Manager initialized with Groq API")
        logger.info(f"Fast Model: {settings.GROQ_MODEL_FAST}")
        logger.info(f"Smart Model: {settings.GROQ_MODEL_SMART}")
        logger.info("All services initialized successfully!")
        
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Skill Assessment Platform...")
    await close_mongo_connection()
    await cache.close()
    logger.info("Shutdown complete!")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered skill assessment and personalized learning roadmap platform",
    version=settings.API_VERSION,
    docs_url=f"/api/{settings.API_VERSION}/docs",
    redoc_url=f"/api/{settings.API_VERSION}/redoc",
    openapi_url=f"/api/{settings.API_VERSION}/openapi.json",
    lifespan=lifespan
)

# Rate Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add response time header"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Global Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors (422)"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": " -> ".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation Error",
            "errors": errors
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all other exceptions (500)"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.API_VERSION
    }

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Skill Assessment Platform API",
        "version": settings.API_VERSION,
        "docs": f"/api/{settings.API_VERSION}/docs",
        "health": "/health"
    }

# Include routers with prefix
API_PREFIX = f"/api/{settings.API_VERSION}"

app.include_router(
    auth.router,
    prefix=f"{API_PREFIX}/auth",
    tags=["Authentication"]
)

app.include_router(
    users.router,
    prefix=f"{API_PREFIX}/users",
    tags=["Users"]
)

app.include_router(
    assessments.router,
    prefix=f"{API_PREFIX}/assessments",
    tags=["Assessments"]
)

app.include_router(
    roadmaps.router,
    prefix=f"{API_PREFIX}/roadmaps",
    tags=["Roadmaps"]
)

app.include_router(
    analytics.router,
    prefix=f"{API_PREFIX}/analytics",
    tags=["Analytics"]
)

app.include_router(
    master_data.router,
    prefix=f"{API_PREFIX}",
    tags=["Master Data"]
)

# Startup message
logger.info(f"{settings.APP_NAME} v{settings.API_VERSION}")
logger.info(f"CORS enabled for: {settings.allowed_origins_list}")
logger.info(f"API Documentation: /api/{settings.API_VERSION}/docs")
# Force reload for CORS update

if __name__ == "__main__":
    import os
    import uvicorn

    port = int(os.environ.get("PORT", 10000))

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )
