from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from uuid import UUID
from app.core.security import decode_token
from app.core.cache import cache
from app.models.user import User
from beanie import PydanticObjectId
from fastapi.encoders import jsonable_encoder
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Get current authenticated user"""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    
    # Check if token is blacklisted (logged out)
    is_blacklisted = await cache.exists(f"blacklist:{token}")
    if is_blacklisted:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked"
        )
    
    # Decode token
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Check cache first
    cached_user = await cache.get_json(f"user:{user_id}")
    if cached_user:
        # Reconstruct user from cache
        if "id" in cached_user and isinstance(cached_user["id"], str):
             cached_user["id"] = PydanticObjectId(cached_user["id"])
        elif "_id" in cached_user and isinstance(cached_user["_id"], str):
             cached_user["_id"] = PydanticObjectId(cached_user["_id"])
             
        user = User(**cached_user)
        return user
    
    # Get user from database
    try:
        user = await User.find_one(User.user_id == UUID(user_id))
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        raise credentials_exception
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Cache user for 5 minutes
    await cache.set_json(
        f"user:{user_id}",
        jsonable_encoder(user.dict()),
        expire=300
    )
    
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user

# Optional: Admin user dependency
async def get_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get admin user (you can add is_admin field to User model)"""
    # For now, just return current user
    # Later you can add: if not current_user.is_admin: raise HTTPException
    return current_user
