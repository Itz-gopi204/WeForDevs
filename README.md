# WeForDevs - Finance AI Orchestrator

An AI-powered financial data summarization and automation platform built for **AssembleHack25** hackathon.

## Overview

WeForDevs automates financial workflows using AI agents that analyze treasury, portfolio, compliance, and market data to generate executive-ready insights and alerts.

### Key Features

- **AI-Powered Analysis** - Local LLM (Llama 3.2) for intelligent summarization
- **Multi-Agent System** - Specialized agents for treasury, portfolio, compliance
- **Workflow Orchestration** - Kestra-based automation pipelines
- **REST API** - FastAPI backend with comprehensive endpoints
- **Executive Dashboard** - Aggregated insights for decision-makers

## Architecture

```
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
```

## Quick Start

### Prerequisites

- Docker Desktop installed and running
- Git
- 8GB+ RAM recommended (for Ollama LLM)

### Start the Application

**Windows:**
```bash
cd backend
start.bat
```

**Manual:**
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

### Stop the Application

**Windows:**
```bash
cd backend
stop.bat
```

**Manual:**
```bash
cd backend
docker-compose down
```

## Project Structure

```
WeForDevs/
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
│   │   └── executive-dashboard.yml
│   ├── data/                   # Financial data (JSON/CSV)
│   │   ├── treasury/
│   │   ├── portfolio/
│   │   ├── compliance/
│   │   └── market/
│   └── docker-compose.yml      # Container orchestration
│
└── frontend/                   # Frontend dashboard (planned)
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

## AI Agents

| Agent | Description |
|-------|-------------|
| **Treasury Monitor** | Analyzes cash positions, FX exposures, debt schedules, liquidity |
| **Portfolio Advisor** | Evaluates holdings, P&L, VaR, risk metrics, performance |
| **Compliance Agent** | Monitors AML alerts, KYC status, audit logs, regulations |
| **Executive Dashboard** | Aggregates insights, generates CEO briefings |

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

## Team

**WeForDevs** - AssembleHack25 Hackathon Team

## License

MIT License
