# Finance AI Orchestrator - Backend

> **AssembleHack25 Hackathon Submission**
> AI-Driven Financial Data Summarization & Automation using Kestra + Ollama + FastAPI

## Overview

This backend provides:

1. **REST API** (FastAPI) - Exposes endpoints for frontend consumption
2. **Workflow Orchestration** (Kestra) - Runs AI agents and automation
3. **Local LLM** (Ollama) - AI-powered summarization
4. **Data Layer** - Financial data in JSON/CSV format

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BACKEND SERVICES                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                     REST API (Port 8000)                           │ │
│  │                          FastAPI                                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │ │
│  │  │ /health  │  │ /data/*  │  │/workflows│  │ Pydantic Models  │   │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│              │                      │                                    │
│              ▼                      ▼                                    │
│  ┌──────────────────┐    ┌──────────────────────────────────────────┐  │
│  │   Data Files     │    │           Kestra (Port 8080)             │  │
│  │   JSON / CSV     │    │         Workflow Orchestration            │  │
│  │                  │    │  ┌─────────────┐  ┌─────────────┐        │  │
│  │  treasury/       │    │  │  Treasury   │  │  Portfolio  │        │  │
│  │  portfolio/      │    │  │   Agent     │  │   Agent     │        │  │
│  │  compliance/     │    │  └─────────────┘  └─────────────┘        │  │
│  │  market/         │    │  ┌─────────────┐  ┌─────────────┐        │  │
│  │                  │    │  │ Compliance  │  │  Executive  │        │  │
│  │                  │    │  │   Agent     │  │  Dashboard  │        │  │
│  └──────────────────┘    │  └─────────────┘  └─────────────┘        │  │
│                          └──────────────────────────────────────────┘  │
│                                         │                               │
│                                         ▼                               │
│                          ┌──────────────────────────────────────────┐  │
│                          │         Ollama (Port 11434)              │  │
│                          │           Llama 3.2 LLM                  │  │
│                          └──────────────────────────────────────────┘  │
│                                         │                               │
│                                         ▼                               │
│                          ┌──────────────────────────────────────────┐  │
│                          │        PostgreSQL (Internal)             │  │
│                          │          Kestra Database                 │  │
│                          └──────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- 8GB+ RAM (for Ollama)
- 10GB+ disk space

### Start Backend

**Windows:**
```bash
start.bat
```

**Manual:**
```bash
docker-compose up -d --build
```

### Access Services

| Service | URL | Description |
|---------|-----|-------------|
| REST API | http://localhost:8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | Swagger UI |
| ReDoc | http://localhost:8000/redoc | Alternative docs |
| Kestra UI | http://localhost:8080 | Workflow management |
| Ollama | http://localhost:11434 | LLM endpoint |

### Stop Backend

**Windows:**
```bash
stop.bat
```

**Manual:**
```bash
docker-compose down
```

## API Reference

### Health Endpoints

```bash
# Full health check
GET /health

# Readiness probe
GET /health/ready

# Liveness probe
GET /health/live
```

### Data Endpoints

```bash
# Dashboard summary (aggregated view)
GET /data/dashboard

# Treasury data (cash, debt, FX)
GET /data/treasury

# Portfolio data (holdings, VaR, performance)
GET /data/portfolio

# Compliance data (AML, KYC, audit)
GET /data/compliance

# Market data (news, indicators)
GET /data/market
```

### Workflow Endpoints

```bash
# Trigger main orchestrator
POST /workflows/trigger
Body: {
  "run_mode": "full",           # full, treasury_only, portfolio_only, compliance_only
  "risk_threshold": 70,         # 0-100
  "send_notifications": true
}

# List executions
GET /workflows/executions?limit=10&state=SUCCESS

# Get execution status
GET /workflows/executions/{execution_id}

# Get execution logs
GET /workflows/executions/{execution_id}/logs

# Quick triggers
POST /workflows/trigger/treasury
POST /workflows/trigger/portfolio
POST /workflows/trigger/compliance
```

## Project Structure

```
backend/
├── api/                        # FastAPI REST API
│   ├── main.py                 # App entry point
│   ├── config.py               # Settings
│   ├── Dockerfile              # API container
│   ├── requirements.txt        # Python dependencies
│   ├── models/
│   │   └── schemas.py          # Pydantic models
│   ├── routers/
│   │   ├── health.py           # Health endpoints
│   │   ├── data.py             # Data endpoints
│   │   └── workflows.py        # Workflow endpoints
│   └── services/
│       ├── kestra.py           # Kestra API client
│       └── data_loader.py      # Data access layer
│
├── flows/                      # Kestra workflow definitions
│   ├── main-orchestrator.yml   # Main coordinator
│   ├── treasury-monitor.yml    # Treasury agent
│   ├── portfolio-advisor.yml   # Portfolio agent
│   ├── compliance-agent.yml    # Compliance agent
│   ├── executive-dashboard.yml # Executive briefing
│   └── notifications/
│       └── alert-subflow.yml   # Notification service
│
├── data/                       # Financial data
│   ├── treasury/
│   │   ├── cash_positions.csv
│   │   ├── fx_rates.json
│   │   └── debt_schedule.csv
│   ├── portfolio/
│   │   ├── holdings.json
│   │   ├── var_metrics.csv
│   │   └── performance.json
│   ├── compliance/
│   │   ├── aml_alerts.json
│   │   ├── audit_logs.csv
│   │   └── kyc_status.json
│   └── market/
│       ├── news_feed.json
│       └── economic_indicators.json
│
├── docker-compose.yml          # Service orchestration
├── start.bat                   # Windows startup
├── stop.bat                    # Windows shutdown
└── README.md                   # This file
```

## AI Agents

### Treasury Monitor
- Analyzes cash positions across accounts
- Monitors FX exposures and hedge ratios
- Tracks debt schedules and covenant status
- Calculates liquidity runway

### Portfolio Advisor
- Evaluates portfolio holdings and P&L
- Calculates VaR and risk metrics
- Compares performance vs benchmark
- Integrates market news sentiment

### Compliance Agent
- Monitors AML alerts and sanctions
- Tracks KYC compliance rates
- Reviews audit logs for anomalies
- Manages regulatory deadlines

### Executive Dashboard
- Aggregates all agent outputs
- Generates 2-minute CEO briefing
- Prioritizes critical items
- Routes to appropriate stakeholders

## Configuration

### Environment Variables

```bash
# Kestra connection
KESTRA_HOST=http://kestra:8080

# Ollama connection
OLLAMA_HOST=http://ollama:11434

# Data path
DATA_PATH=/app/data
```

### Risk Thresholds (in workflow inputs)

```yaml
risk_threshold: 70      # Global alert threshold
var_threshold: 200000   # Portfolio VaR limit
high_priority_threshold: 2  # Alert count for escalation
```

## Docker Services

| Container | Image | Port | Purpose |
|-----------|-------|------|---------|
| finance-api | Custom (Python 3.11) | 8000 | REST API |
| kestra | kestra/kestra:latest | 8080, 8081 | Orchestration |
| kestra-postgres | postgres:15 | - | Kestra database |
| ollama | ollama/ollama:latest | 11434 | Local LLM |
| ollama-pull | curlimages/curl | - | Model downloader |

## Troubleshooting

### API Not Starting
```bash
docker-compose logs api
```

### Kestra Connection Issues
```bash
docker-compose logs kestra
docker-compose restart kestra
```

### Ollama Not Responding
```bash
docker exec -it ollama ollama list
docker exec -it ollama ollama pull llama3.2:3b
```

### View All Logs
```bash
docker-compose logs -f
```

## Development

### Run API Locally (without Docker)

```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Dashboard data
curl http://localhost:8000/data/dashboard

# Trigger workflow
curl -X POST http://localhost:8000/workflows/trigger \
  -H "Content-Type: application/json" \
  -d '{"run_mode": "full", "risk_threshold": 70}'
```

---

**Built with FastAPI + Kestra + Ollama for AssembleHack25**
