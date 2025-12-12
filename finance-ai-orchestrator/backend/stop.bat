@echo off
echo ========================================
echo Stopping Finance AI Orchestrator Backend
echo ========================================
echo.
echo Stopping all services...
docker-compose down
echo.
echo All services stopped!
echo.
echo To restart: start.bat
echo ========================================
pause
