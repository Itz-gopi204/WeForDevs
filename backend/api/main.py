from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from routers import workflows_router, data_router, health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print(f"Starting {settings.api_title} v{settings.api_version}")
    print(f"Kestra endpoint: {settings.kestra_host}")
    print(f"Ollama endpoint: {settings.ollama_host}")
    yield
    # Shutdown
    print("Shutting down API...")


app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description=settings.api_description,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(workflows_router)
app.include_router(data_router)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.api_title,
        "version": settings.api_version,
        "description": settings.api_description,
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "dashboard": "/data/dashboard",
            "treasury": "/data/treasury",
            "portfolio": "/data/portfolio",
            "compliance": "/data/compliance",
            "market": "/data/market",
            "trigger_workflow": "/workflows/trigger",
            "executions": "/workflows/executions",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
