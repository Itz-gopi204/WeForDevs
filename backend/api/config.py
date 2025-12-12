import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API Settings
    api_title: str = "Finance AI Orchestrator API"
    api_version: str = "1.0.0"
    api_description: str = "REST API for Finance AI Orchestrator - Hackathon AssembleHack25"

    # Kestra Settings
    kestra_host: str = os.getenv("KESTRA_HOST", "http://kestra:8080")
    kestra_namespace: str = "finance"
    kestra_flow_id: str = "finance-ai-orchestrator"

    # Ollama Settings
    ollama_host: str = os.getenv("OLLAMA_HOST", "http://ollama:11434")
    ollama_model: str = "llama3.2:3b"

    # Data Paths
    data_base_path: str = os.getenv("DATA_PATH", "/app/data")

    # CORS Settings
    cors_origins: list = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
