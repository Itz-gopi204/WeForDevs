# Finance AI Orchestrator

> **AssembleHack25 Hackathon Submission**
>
> AI-Powered Financial Data Summarization & Automation Platform

---

## Problem Statement

Financial institutions deal with massive amounts of data daily across treasury, portfolio, compliance, and market domains. CFOs and executives need:

- **Instant insights** from complex financial data
- **Automated monitoring** for risk and compliance
- **AI-powered analysis** without cloud dependencies
- **Executive-ready summaries** in seconds, not hours

**Our Solution**: An AI orchestration platform that automates financial data analysis using local LLMs and workflow automation.

---

## Demo

### System Architecture
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FINANCE AI ORCHESTRATOR                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────┐         ┌─────────────────────────────────────────┐   │
│   │                 │         │           BACKEND SERVICES               │   │
│   │    FRONTEND     │  HTTP   │                                          │   │
│   │   React + TS    │ ◄─────► │  ┌─────────────────────────────────────┐ │   │
│   │   Dashboard     │         │  │       FastAPI REST API              │ │   │
│   │                 │         │  │       (Port 8000)                   │ │   │
│   │  ┌───────────┐  │         │  └─────────────────────────────────────┘ │   │
│   │  │ Treasury  │  │         │              │                           │   │
│   │  │ Portfolio │  │         │              ▼                           │   │
│   │  │ Compliance│  │         │  ┌─────────────────────────────────────┐ │   │
│   │  │ Market    │  │         │  │         KESTRA                      │ │   │
│   │  └───────────┘  │         │  │    Workflow Orchestration           │ │   │
│   │                 │         │  │       (Port 8080)                   │ │   │
│   │  ┌───────────┐  │         │  │  ┌─────────┐  ┌─────────┐          │ │   │
│   │  │   Run     │  │         │  │  │Treasury │  │Portfolio│          │ │   │
│   │  │    AI     │──┼─────────┼──┼─►│ Agent   │  │ Agent   │          │ │   │
│   │  │ Analysis  │  │         │  │  └─────────┘  └─────────┘          │ │   │
│   │  └───────────┘  │         │  │  ┌─────────┐  ┌─────────┐          │ │   │
│   │                 │         │  │  │Compliance│  │Executive│          │ │   │
│   └─────────────────┘         │  │  │ Agent   │  │Dashboard│          │ │   │
│                               │  │  └─────────┘  └─────────┘          │ │   │
│                               │  └─────────────────────────────────────┘ │   │
│                               │              │                           │   │
│                               │              ▼                           │   │
│                               │  ┌─────────────────────────────────────┐ │   │
│                               │  │          OLLAMA                     │ │   │
│                               │  │     Local LLM (Llama 3.2)           │ │   │
│                               │  │       (Port 11434)                  │ │   │
│                               │  └─────────────────────────────────────┘ │   │
│                               └─────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. AI-Powered Financial Analysis
- **Local LLM** (Llama 3.2) - No cloud API costs, data stays private
- **Intelligent Summarization** - Converts raw data into executive insights
- **Risk Assessment** - Automatic scoring (0-100) across domains

### 2. Multi-Agent Workflow System
| Agent | Function |
|-------|----------|
| **Treasury Monitor** | Cash positions, FX exposure, debt covenants, liquidity |
| **Portfolio Advisor** | Holdings, P&L, VaR, performance vs benchmark |
| **Compliance Agent** | AML alerts, sanctions, KYC rates, audit events |
| **Executive Dashboard** | Aggregates all insights, generates CEO briefing |

### 3. Real-Time Dashboard
- **Overall Risk Score** - Single metric for financial health
- **Status Indicators** - OK / WARNING / CRITICAL states
- **Auto-refresh** - Updates every 30 seconds
- **One-click AI Analysis** - Trigger full workflow with one button

### 4. Complete REST API
- Swagger documentation at `/docs`
- Health checks for monitoring
- Workflow triggering and status tracking

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Executive dashboard |
| **Styling** | Tailwind CSS 4 | Modern dark theme |
| **Charts** | Recharts | Data visualization |
| **API** | FastAPI (Python 3.11) | REST endpoints |
| **Orchestration** | Kestra | Workflow automation |
| **LLM** | Ollama + Llama 3.2 | AI analysis |
| **Database** | PostgreSQL 15 | Kestra storage |
| **Containers** | Docker Compose | Service orchestration |

---

## Quick Start

### Prerequisites
- **Docker Desktop** - Installed and running
- **Node.js 18+** - For frontend
- **8GB+ RAM** - Recommended for Ollama LLM
- **10GB+ Disk** - For Docker images

### 1. Start Backend Services

```bash
# Windows
cd backend
start.bat

# OR Manual
cd backend
docker-compose up -d --build
```

Wait 2-3 minutes for all services to initialize (especially Ollama model download).

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Access Application

| Service | URL | Description |
|---------|-----|-------------|
| **Dashboard** | http://localhost:5173 | React frontend |
| **REST API** | http://localhost:8000 | FastAPI backend |
| **API Docs** | http://localhost:8000/docs | Swagger UI |
| **Kestra UI** | http://localhost:8080 | Workflow management |
| **Ollama** | http://localhost:11434 | LLM endpoint |

### 4. Test the System

1. Open the dashboard at http://localhost:5173
2. View the risk scores and data across tabs
3. Click **"Run AI Analysis"** to trigger the workflow
4. Watch Kestra UI to see agents execute

---

## Project Structure

```
WeForDevs/
├── README.md                          # This file
├── .gitignore                         # Git ignore rules
│
├── backend/                           # Backend services
│   ├── README.md                      # Backend documentation
│   ├── docker-compose.yml             # Service orchestration
│   ├── start.bat                      # Windows startup script
│   ├── stop.bat                       # Windows shutdown script
│   │
│   ├── api/                           # FastAPI REST API
│   │   ├── main.py                    # App entry point
│   │   ├── config.py                  # Configuration
│   │   ├── Dockerfile                 # API container
│   │   ├── requirements.txt           # Python dependencies
│   │   ├── models/
│   │   │   └── schemas.py             # Pydantic models
│   │   ├── routers/
│   │   │   ├── health.py              # Health endpoints
│   │   │   ├── data.py                # Data endpoints
│   │   │   └── workflows.py           # Workflow endpoints
│   │   └── services/
│   │       ├── kestra.py              # Kestra API client
│   │       └── data_loader.py         # Data access layer
│   │
│   ├── flows/                         # Kestra workflows (YAML)
│   │   ├── main-orchestrator.yml      # Main coordinator
│   │   ├── treasury-monitor.yml       # Treasury AI agent
│   │   ├── portfolio-advisor.yml      # Portfolio AI agent
│   │   ├── compliance-agent.yml       # Compliance AI agent
│   │   └── executive-dashboard.yml    # Executive summary
│   │
│   └── data/                          # Financial data (JSON/CSV)
│       ├── treasury/                  # Cash, FX, debt
│       ├── portfolio/                 # Holdings, VaR
│       ├── compliance/                # AML, KYC, audit
│       └── market/                    # News, indicators
│
└── frontend/                          # React dashboard
    ├── README.md                      # Frontend documentation
    ├── package.json                   # Dependencies
    ├── vite.config.ts                 # Vite configuration
    ├── tailwind.config.js             # Tailwind configuration
    └── src/
        ├── App.tsx                    # Main dashboard component
        ├── main.tsx                   # React entry point
        ├── index.css                  # Styles
        └── services/
            └── api.ts                 # API client & types
```

---

## API Endpoints

### Health
```http
GET /health          # Full health check (all services)
GET /health/ready    # Readiness probe
GET /health/live     # Liveness probe
```

### Data
```http
GET /data/dashboard  # Aggregated summary with risk scores
GET /data/treasury   # Cash positions, debt, FX exposures
GET /data/portfolio  # Holdings, VaR, performance metrics
GET /data/compliance # AML alerts, KYC, audit events
GET /data/market     # News feed, sentiment, indicators
```

### Workflows
```http
POST /workflows/trigger              # Trigger main orchestrator
GET  /workflows/executions           # List recent executions
GET  /workflows/executions/{id}      # Get execution status
GET  /workflows/executions/{id}/logs # Get execution logs
```

---

## How It Works

### 1. Data Ingestion
Financial data is loaded from JSON/CSV files in the `data/` directory, simulating real feeds from banking systems, trading platforms, and compliance tools.

### 2. AI Analysis Flow
```
User clicks "Run AI Analysis"
           │
           ▼
    ┌──────────────┐
    │ Main         │
    │ Orchestrator │
    └──────┬───────┘
           │
    ┌──────┴───────────────────────┐
    │              │               │
    ▼              ▼               ▼
┌─────────┐  ┌──────────┐  ┌────────────┐
│Treasury │  │Portfolio │  │Compliance  │
│ Agent   │  │ Agent    │  │  Agent     │
└────┬────┘  └────┬─────┘  └─────┬──────┘
     │            │              │
     └────────────┼──────────────┘
                  │
                  ▼
          ┌──────────────┐
          │  Executive   │
          │  Dashboard   │
          └──────────────┘
                  │
                  ▼
          CEO-Ready Briefing
```

### 3. LLM Prompting
Each agent sends domain-specific data to Llama 3.2 with tailored prompts:
- Treasury: "Analyze cash positions, FX exposures, covenant status..."
- Portfolio: "Evaluate holdings, calculate risk metrics, compare to benchmark..."
- Compliance: "Review AML alerts, sanctions matches, KYC compliance rates..."

### 4. Result Aggregation
The Executive Dashboard agent combines all outputs into a 2-minute briefing with:
- Overall risk score
- Critical items requiring attention
- Recommended actions
- Status across all domains

---

## Workflow Details

### Treasury Monitor
```yaml
Inputs: Cash positions, FX rates, debt schedules
Analyzes: Liquidity runway, unhedged exposure, covenant breaches
Outputs: Treasury risk score, alerts, recommendations
```

### Portfolio Advisor
```yaml
Inputs: Holdings, market prices, benchmarks
Analyzes: VaR, Sharpe ratio, alpha, sector concentration
Outputs: Portfolio risk score, rebalancing suggestions
```

### Compliance Agent
```yaml
Inputs: AML alerts, KYC records, audit logs
Analyzes: High-risk transactions, sanctions matches, compliance gaps
Outputs: Compliance risk score, escalation list
```

### Executive Dashboard
```yaml
Inputs: All agent outputs
Generates: 2-minute CEO briefing, overall risk score
Routes: Critical items to appropriate stakeholders
```

---


## Troubleshooting

### Backend Not Starting
```bash
cd backend
docker-compose logs api
```

### Kestra Not Responding
```bash
docker-compose logs kestra
docker-compose restart kestra
```

### Ollama Model Not Loaded
```bash
docker exec -it ollama ollama list
docker exec -it ollama ollama pull llama3.2:3b
```

### Frontend Blank Screen
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

---

## Team

**WeForDevs** - AssembleHack25 Hackathon Team

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- **Kestra** - Workflow orchestration platform
- **Ollama** - Local LLM runtime
- **FastAPI** - Modern Python web framework
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS

---

**Built for AssembleHack25 Hackathon**

*Transforming financial data into executive intelligence with AI*
