@echo off
echo ========================================
echo Finance AI Orchestrator - Backend
echo ========================================
echo.

echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop from https://docker.com
    pause
    exit /b 1
)

echo Docker found!
echo.

echo Starting backend services (this may take 5-10 minutes on first run)...
echo.

docker-compose up -d --build

echo.
echo ========================================
echo Backend Services Starting...
echo ========================================
echo.
echo REST API:      http://localhost:8000
echo API Docs:      http://localhost:8000/docs
echo Kestra UI:     http://localhost:8080
echo Ollama API:    http://localhost:11434
echo.
echo ----------------------------------------
echo API Endpoints:
echo ----------------------------------------
echo GET  /health           - Health check
echo GET  /data/dashboard   - Dashboard summary
echo GET  /data/treasury    - Treasury data
echo GET  /data/portfolio   - Portfolio data
echo GET  /data/compliance  - Compliance data
echo GET  /data/market      - Market data
echo POST /workflows/trigger - Trigger workflow
echo GET  /workflows/executions - List executions
echo.
echo ----------------------------------------
echo.
echo The Llama 3.2 model will be downloaded automatically.
echo This may take a few minutes depending on your internet speed.
echo.
echo To view logs: docker-compose logs -f
echo To stop:      stop.bat
echo.
echo ========================================

pause
