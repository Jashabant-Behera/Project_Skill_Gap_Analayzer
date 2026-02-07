@echo off
echo ========================================
echo Skill Assessment Platform - Run Server
echo ========================================
echo.

echo Checking environment...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and configure it.
    pause
    exit /b 1
)

echo.
echo Starting FastAPI server...
echo.
echo API Documentation will be available at:
echo   http://localhost:8000/api/v1/docs
echo.
echo Health Check:
echo   http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
