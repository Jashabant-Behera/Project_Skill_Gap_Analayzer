import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

load_dotenv()

# Password hashing - Using Argon2 (modern, secure, Python 3.13 compatible)
# Argon2 is recommended over bcrypt: more secure, GPU-resistant, no version compatibility issues
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

from fastapi.responses import JSONResponse

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "default_secret")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Fix 6: OAuth2 tokenUrl mismatch
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    # Fix 2: Improve JWT payload (uid and iat)
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc)
    })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        uid: str = payload.get("uid")
        if email is None or uid is None:
            raise credentials_exception
        return {"email": email, "id": uid}
    except JWTError:
        raise credentials_exception

# Fix 5: Proper error handler
async def custom_error_handler(request: Request, exc: Exception):
    print(f"Error occurred: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "An internal server error occurred.",
            "detail": str(exc) if os.getenv("DEBUG") == "True" else "Check server logs"
        }
    )
