from fastapi import HTTPException, status
from models.user import UserCreate, UserInDB
from config.db import get_db
from middleware.auth_middleware import get_password_hash, verify_password, create_access_token
from datetime import timedelta, datetime, timezone
import os

from pymongo.errors import DuplicateKeyError

class AuthController:
    @staticmethod
    async def register(user: UserCreate):
        db = get_db()
        
        # Hash password and create user
        hashed_password = get_password_hash(user.password)
        new_user = {
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "proficiency_level": user.proficiency_level,
            "target_role": user.target_role,
            "hashed_password": hashed_password,
            "created_at": datetime.now(timezone.utc),
            "skills": []
        }
        
        # Fix 1: Catch duplicate email race condition
        try:
            result = await db.users.insert_one(new_user)
            user_data = {
                "id": str(result.inserted_id),
                "username": new_user["username"],
                "email": new_user["email"],
                "full_name": new_user["full_name"],
                "proficiency_level": new_user["proficiency_level"],
                "target_role": new_user["target_role"],
                "created_at": new_user["created_at"]
            }
            return {"user": user_data, "message": "User registered successfully"}
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Email already registered")

    @staticmethod
    async def login(credentials):
        db = get_db()
        user = await db.users.find_one({"email": credentials.username})
        
        if not user or not verify_password(credentials.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")))
        
        # Fix 2: Add token type claim
        access_token = create_access_token(
            data={
                "sub": user["email"], 
                "uid": str(user["_id"]),
                "type": "access"
            }, 
            expires_delta=access_token_expires
        )
        
        user_data = {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "full_name": user.get("full_name"),
            "proficiency_level": user.get("proficiency_level"),
            "target_role": user.get("target_role"),
            "skills": user.get("skills", [])
        }
        
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": user_data
        }
