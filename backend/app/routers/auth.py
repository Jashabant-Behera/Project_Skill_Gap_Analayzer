from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.encoders import jsonable_encoder
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from typing import Dict
from uuid import UUID

from app.schemas.user import (
    UserRegister, UserLogin, UserResponse, 
    TokenResponse, RefreshTokenRequest
)
from app.models.user import User
from app.core.security import (
    get_password_hash, verify_password, 
    create_tokens, decode_token, TokenBlacklist
)
from app.core.cache import cache
from app.core.dependencies import get_current_user
from app.core.rate_limit import limiter
from app.config import settings
import logging

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=Dict, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/hour")
async def register_user(request: Request, user_data: UserRegister):
    """
    Register a new user
    
    - **email**: Valid email address
    - **password**: Strong password (min 8 chars, 1 uppercase, 1 digit)
    - **full_name**: User's full name (optional)
    - **current_role**: Current job role (optional)
    - **experience_years**: Years of experience (optional)
    """
    
    # Check if user already exists
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        current_role=user_data.current_role,
        experience_years=user_data.experience_years
    )
    
    await new_user.insert()
    logger.info(f"New user registered: {new_user.email}")
    
    # Generate tokens
    tokens = create_tokens(new_user.user_id, new_user.email)
    
    # Cache user data
    await cache.set_json(
        f"user:{new_user.user_id}",
        jsonable_encoder(new_user.dict()),
        expire=300  # 5 minutes
    )
    
    return {
        "message": "User registered successfully",
        "user": UserResponse(**new_user.dict()),
        "tokens": tokens
    }

@router.post("/login", response_model=Dict)
@limiter.limit("5/minute")
async def login_user(request: Request, credentials: UserLogin):
    """
    Login user and get access tokens
    
    - **email**: User's email
    - **password**: User's password
    """
    
    # Find user by email
    user = await User.find_one(User.email == credentials.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await user.save()
    
    # Generate tokens
    tokens = create_tokens(user.user_id, user.email)
    
    # Cache user data
    await cache.set_json(
        f"user:{user.user_id}",
        jsonable_encoder(user.dict()),
        expire=300
    )
    
    logger.info(f"User logged in: {user.email}")
    
    return {
        "message": "Login successful",
        "user": UserResponse(**user.dict()),
        "tokens": tokens
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(refresh_request: RefreshTokenRequest):
    """
    Get new access token using refresh token
    
    - **refresh_token**: Valid refresh token
    """
    
    # Decode refresh token
    payload = decode_token(refresh_request.refresh_token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Verify token type
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    # Get user
    user_id = payload.get("sub")
    user = await User.find_one(User.user_id == UUID(user_id))
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Generate new tokens
    tokens = create_tokens(user.user_id, user.email)
    
    logger.info(f"Token refreshed for user: {user.email}")
    
    return TokenResponse(**tokens)

@router.post("/logout")
async def logout_user(
    request: Request,
    current_user: User = Depends(get_current_user),
    token_creds: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Logout user and invalidate current session
    
    Requires authentication
    """
    # Blacklist token
    if cache.redis:
        blacklist = TokenBlacklist(cache.redis)
        token = token_creds.credentials
        payload = decode_token(token)
        if payload:
            exp = payload.get("exp")
            if exp:
                 await blacklist.add_token(token, exp)
    
    # Clear user cache
    await cache.delete(f"user:{current_user.user_id}")
    
    logger.info(f"User logged out: {current_user.email}")
    
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user's profile
    
    Requires authentication
    """
    return UserResponse(**current_user.dict())
