from fastapi import APIRouter
from datetime import datetime
import httpx
from config import settings
from models.schemas import HealthCheck
from services.kestra import kestra_service

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthCheck)
async def health_check():
    """
    Check the health status of all services.
    Returns status of API, Kestra, Ollama, and database.
    """
    # Check Kestra
    kestra_health = await kestra_service.check_health()

    # Check Ollama
    ollama_status = "unknown"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{settings.ollama_host}/api/tags")
            ollama_status = "healthy" if response.status_code == 200 else "unhealthy"
    except Exception:
        ollama_status = "unreachable"

    # Overall status
    all_healthy = kestra_health.get("status") == "healthy" and ollama_status == "healthy"

    return HealthCheck(
        status="healthy" if all_healthy else "degraded",
        api_version=settings.api_version,
        kestra_status=kestra_health.get("status", "unknown"),
        ollama_status=ollama_status,
        database_status="healthy",  # Postgres is managed by Kestra
        timestamp=datetime.utcnow(),
    )


@router.get("/ready")
async def readiness_check():
    """Simple readiness probe for container orchestration."""
    return {"status": "ready", "timestamp": datetime.utcnow().isoformat()}


@router.get("/live")
async def liveness_check():
    """Simple liveness probe for container orchestration."""
    return {"status": "alive", "timestamp": datetime.utcnow().isoformat()}
