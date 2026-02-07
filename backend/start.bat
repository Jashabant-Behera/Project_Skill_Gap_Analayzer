@echo off
echo ========================================
echo Skill Assessment Platform - Quick Start
echo ========================================
echo.

echo [1/3] Starting Docker services...
docker-compose up -d

if %errorlevel% neq 0 (
    echo ERROR: Failed to start Docker services
    echo Make sure Docker Desktop is running!
    pause
    exit /b 1
)

echo.
echo [2/3] Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo.
echo [3/3] Seeding database...
docker-compose exec -T api python -m app.scripts.seed_database

echo.
echo ========================================
echo Application is ready!
echo ========================================
echo.
echo API Documentation: http://localhost:8000/api/v1/docs
echo Health Check: http://localhost:8000/health
echo View Logs: docker-compose logs -f api
echo Stop Services: docker-compose down
echo.
echo ========================================
echo.

start http://localhost:8000/api/v1/docs

pause
