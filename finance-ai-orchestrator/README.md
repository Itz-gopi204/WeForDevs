# Finance AI Orchestrator

An end-to-end AI-powered financial data summarization and automation system for the AssembleHack25 hackathon.

## Project Structure

```
finance-ai-orchestrator/
├── backend/                    # Backend services
│   ├── api/                    # FastAPI REST API
│   │   ├── main.py             # API entry point
│   │   ├── config.py           # Configuration
│   │   ├── routers/            # API routes
│   │   ├── services/           # Business logic
│   │   └── models/             # Pydantic schemas
│   ├── flows/                  # Kestra workflow definitions
│   │   ├── main-orchestrator.yml
│   │   ├── treasury-monitor.yml
│   │   ├── portfolio-advisor.yml
│   │   ├── compliance-agent.yml
│   │   ├── executive-dashboard.yml
│   │   └── notifications/
│   ├── data/                   # Financial data (JSON/CSV)
│   │   ├── treasury/
│   │   ├── portfolio/
│   │   ├── compliance/
│   │   └── market/
│   ├── docker-compose.yml      # Container orchestration
│   ├── start.bat               # Windows startup
│   └── stop.bat                # Windows shutdown
│
└── frontend/                   # Frontend dashboard (placeholder)
    ├── package.json
    └── README.md
```

## Quick Start

### Prerequisites

- Docker Desktop installed and running
- Git
- 8GB+ RAM recommended (for Ollama LLM)

### Start Backend

```bash
cd backend
start.bat
```

Or manually:
```bash
cd backend
docker-compose up -d --build
```

### Access Services

| Service | URL | Description |
|---------|-----|-------------|
| REST API | http://localhost:8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | Swagger documentation |
| Kestra UI | http://localhost:8080 | Workflow orchestration |
| Ollama | http://localhost:11434 | Local LLM |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Port 3000)                   │
│                   React Dashboard (Planned)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    REST API (Port 8000)                     │
│                        FastAPI                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   /health   │  │   /data/*   │  │   /workflows/*      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Kestra (8080)  │  │  Ollama (11434) │  │  Data Files     │
│  Orchestration  │  │  Local LLM      │  │  JSON/CSV       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
          │
          ▼
┌─────────────────┐
│  PostgreSQL     │
│  (Kestra DB)    │
└─────────────────┘
```

## API Endpoints

### Health
- `GET /health` - Service health status
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Data
- `GET /data/dashboard` - Consolidated dashboard summary
- `GET /data/treasury` - Treasury data (cash, debt, FX)
- `GET /data/portfolio` - Portfolio data (holdings, VaR, performance)
- `GET /data/compliance` - Compliance data (AML, KYC, audit)
- `GET /data/market` - Market data (news, indicators)

### Workflows
- `POST /workflows/trigger` - Trigger main orchestrator
- `GET /workflows/executions` - List recent executions
- `GET /workflows/executions/{id}` - Get execution status
- `GET /workflows/executions/{id}/logs` - Get execution logs

## Tech Stack

| Component | Technology |
|-----------|------------|
| API | FastAPI (Python 3.11) |
| Orchestration | Kestra |
| LLM | Ollama + Llama 3.2 |
| Database | PostgreSQL 15 |
| Containers | Docker Compose |

## Development Status

- [x] Backend API structure
- [x] Kestra workflows
- [x] Data models
- [x] Docker configuration
- [ ] Frontend dashboard
- [ ] Real-time updates
- [ ] Authentication

## License

MIT License - AssembleHack25 Hackathon Project
