from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from controllers.auth_controller import AuthController
from models.user import UserCreate

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserCreate):
    return await AuthController.register(user)

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return await AuthController.login(form_data)
