@echo off
REM Quick setup script for Windows

echo ========================================
echo Skill Assessment Platform - Quick Setup
echo ========================================
echo.

REM Check Python version
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found! Please install Python 3.11+
    pause
    exit /b 1
)

echo.
echo [1/5] Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo.
echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/5] Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [4/5] Checking .env file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please update .env file with your API keys!
    echo - GROQ_API_KEY
    echo - SECRET_KEY
    echo - JWT_SECRET_KEY
    echo.
)

echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Update .env file with your API keys
echo 2. Start MongoDB and Redis (or use Docker)
echo 3. Run: uvicorn app.main:app --reload
echo 4. Visit: http://localhost:8000/api/v1/docs
echo ========================================
echo.

pause
