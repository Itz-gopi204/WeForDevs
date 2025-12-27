# Finance AI Orchestrator

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

## Complete System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                           FINANCE AI ORCHESTRATOR - FULL ARCHITECTURE                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                              USER INTERFACE LAYER                                │ │
│  │  ┌───────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │                        REACT DASHBOARD (Port 5173)                        │  │ │
│  │  │                                                                           │  │ │
│  │  │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │ │
│  │  │   │Dashboard │  │ Treasury │  │Portfolio │  │Compliance│  │  Market  │   │  │ │
│  │  │   │  View    │  │   View   │  │   View   │  │   View   │  │   View   │   │  │ │
│  │  │   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │  │ │
│  │  │        │              │              │              │              │       │  │ │
│  │  │        └──────────────┴──────────────┴──────────────┴──────────────┘       │  │ │
│  │  │                                      │                                     │  │ │
│  │  │                            ┌─────────┴─────────┐                           │  │ │
│  │  │                            │  Run AI Analysis  │ ◄── One-Click Trigger     │  │ │
│  │  │                            └─────────┬─────────┘                           │  │ │
│  │  └──────────────────────────────────────┼────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────┼───────────────────────────────────────┘ │
│                                            │ HTTP Request                            │
│                                            ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                               API GATEWAY LAYER                                  │ │
│  │  ┌───────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │                      FASTAPI REST API (Port 8000)                         │  │ │
│  │  │                                                                           │  │ │
│  │  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐   │  │ │
│  │  │   │   /health   │    │   /data/*   │    │      /workflows/*           │   │  │ │
│  │  │   │  Endpoints  │    │  Endpoints  │    │       Endpoints             │   │  │ │
│  │  │   │             │    │             │    │                             │   │  │ │
│  │  │   │ - /health   │    │ - /dashboard│    │ - POST /trigger             │   │  │ │
│  │  │   │ - /ready    │    │ - /treasury │    │ - GET  /executions          │   │  │ │
│  │  │   │ - /live     │    │ - /portfolio│    │ - GET  /executions/{id}     │   │  │ │
│  │  │   │             │    │ - /compliance    │ - GET  /executions/{id}/logs│   │  │ │
│  │  │   │             │    │ - /market   │    │                             │   │  │ │
│  │  │   └─────────────┘    └──────┬──────┘    └──────────────┬──────────────┘   │  │ │
│  │  └────────────────────────────┬┼─────────────────────────┬┼──────────────────┘  │ │
│  └───────────────────────────────┼┼─────────────────────────┼┼──────────────────────┘ │
│                                  ││                         ││                        │
│                    ┌─────────────┘│                         │└─────────────┐          │
│                    │              │                         │              │          │
│                    ▼              │                         │              ▼          │
│  ┌──────────────────────────┐    │                         │    ┌────────────────────┐│
│  │      DATA LAYER          │    │                         │    │  ORCHESTRATION     ││
│  │  ┌────────────────────┐  │    │                         │    │      LAYER         ││
│  │  │   Financial Data   │  │    │                         │    │                    ││
│  │  │    (JSON/CSV)      │  │    │                         │    │  ┌──────────────┐  ││
│  │  │                    │  │    │                         │    │  │    KESTRA    │  ││
│  │  │  ┌──────────────┐  │  │    │                         │    │  │  (Port 8080) │  ││
│  │  │  │  treasury/   │  │  │    │                         │    │  │              │  ││
│  │  │  │  - cash.csv  │  │◄─┘    │                         └───►│  │  Workflow    │  ││
│  │  │  │  - debt.csv  │  │       │                              │  │  Engine      │  ││
│  │  │  │  - fx.json   │  │       │                              │  │              │  ││
│  │  │  └──────────────┘  │       │                              │  └───────┬──────┘  ││
│  │  │  ┌──────────────┐  │       │                              │          │         ││
│  │  │  │  portfolio/  │  │       │                              │          ▼         ││
│  │  │  │  - holdings  │  │       │                              │  ┌──────────────┐  ││
│  │  │  │  - var.csv   │  │       │                              │  │  PostgreSQL  │  ││
│  │  │  └──────────────┘  │       │                              │  │  (Internal)  │  ││
│  │  │  ┌──────────────┐  │       │                              │  │              │  ││
│  │  │  │  compliance/ │  │       │                              │  │  Stores:     │  ││
│  │  │  │  - aml.json  │  │       │                              │  │  - Workflows │  ││
│  │  │  │  - kyc.json  │  │       │                              │  │  - Executions│  ││
│  │  │  └──────────────┘  │       │                              │  │  - Logs      │  ││
│  │  │  ┌──────────────┐  │       │                              │  └──────────────┘  ││
│  │  │  │   market/    │  │       │                              └────────────────────┘│
│  │  │  │  - news.json │  │       │                                                    │
│  │  │  └──────────────┘  │       │                                                    │
│  │  └────────────────────┘       │                                                    │
│  └───────────────────────────────┼────────────────────────────────────────────────────┘
│                                  │                                                    │
│                                  │                                                    │
│  ┌───────────────────────────────┼────────────────────────────────────────────────────┐
│  │                          AI PROCESSING LAYER                                       │
│  │                               │                                                    │
│  │                               ▼                                                    │
│  │            ┌─────────────────────────────────────────┐                            │
│  │            │           OLLAMA (Port 11434)           │                            │
│  │            │                                         │                            │
│  │            │   ┌─────────────────────────────────┐   │                            │
│  │            │   │        Llama 3.2 (3B)           │   │                            │
│  │            │   │                                 │   │                            │
│  │            │   │  - Financial Analysis Prompts  │   │                            │
│  │            │   │  - Risk Assessment             │   │                            │
│  │            │   │  - Natural Language Generation │   │                            │
│  │            │   │  - Executive Summarization     │   │                            │
│  │            │   └─────────────────────────────────┘   │                            │
│  │            └─────────────────────────────────────────┘                            │
│  └───────────────────────────────────────────────────────────────────────────────────┘
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## End-to-End Workflow Flow

### Complete Request Flow (When User Clicks "Run AI Analysis")

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            END-TO-END AI ANALYSIS WORKFLOW                               │
└─────────────────────────────────────────────────────────────────────────────────────────┘

  STEP 1: USER ACTION
  ═══════════════════

       ┌─────────────┐
       │    USER     │
       │  (Browser)  │
       └──────┬──────┘
              │
              │ Clicks "Run AI Analysis" button
              ▼
  ┌───────────────────────┐
  │   React Dashboard     │
  │   (localhost:5173)    │
  └───────────┬───────────┘
              │
              │ POST /workflows/trigger
              │ { "run_mode": "full", "risk_threshold": 70 }
              ▼

  STEP 2: API PROCESSING
  ═══════════════════════

  ┌───────────────────────┐
  │   FastAPI Backend     │
  │   (localhost:8000)    │
  │                       │
  │  1. Validates request │
  │  2. Calls Kestra API  │
  └───────────┬───────────┘
              │
              │ POST /api/v1/executions
              │ namespace: finance-ai
              │ flow: main-orchestrator
              ▼

  STEP 3: ORCHESTRATION
  ═════════════════════

  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │                              KESTRA WORKFLOW ENGINE                                │
  │                                (localhost:8080)                                    │
  │                                                                                    │
  │   ┌─────────────────────────────────────────────────────────────────────────────┐ │
  │   │                         MAIN ORCHESTRATOR FLOW                              │ │
  │   │                                                                             │ │
  │   │   ┌─────────────┐                                                           │ │
  │   │   │   START     │                                                           │ │
  │   │   └──────┬──────┘                                                           │ │
  │   │          │                                                                  │ │
  │   │          ▼                                                                  │ │
  │   │   ┌─────────────┐                                                           │ │
  │   │   │  Load Data  │ ◄── Reads from /data/* directories                        │ │
  │   │   └──────┬──────┘                                                           │ │
  │   │          │                                                                  │ │
  │   │          ▼                                                                  │ │
  │   │   ╔═══════════════════════════════════════════════════════════════════════╗ │ │
  │   │   ║              PARALLEL AGENT EXECUTION (Concurrent)                    ║ │ │
  │   │   ╠═══════════════════════════════════════════════════════════════════════╣ │ │
  │   │   ║                                                                       ║ │ │
  │   │   ║   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      ║ │ │
  │   │   ║   │    TREASURY     │  │    PORTFOLIO    │  │   COMPLIANCE    │      ║ │ │
  │   │   ║   │     AGENT       │  │      AGENT      │  │     AGENT       │      ║ │ │
  │   │   ║   │                 │  │                 │  │                 │      ║ │ │
  │   │   ║   │ Analyzes:       │  │ Analyzes:       │  │ Analyzes:       │      ║ │ │
  │   │   ║   │ - Cash positions│  │ - Holdings      │  │ - AML alerts    │      ║ │ │
  │   │   ║   │ - FX exposures  │  │ - P&L           │  │ - Sanctions     │      ║ │ │
  │   │   ║   │ - Debt covenants│  │ - VaR metrics   │  │ - KYC status    │      ║ │ │
  │   │   ║   │ - Liquidity     │  │ - Performance   │  │ - Audit logs    │      ║ │ │
  │   │   ║   │                 │  │                 │  │                 │      ║ │ │
  │   │   ║   │      │          │  │      │          │  │      │          │      ║ │ │
  │   │   ║   │      ▼          │  │      ▼          │  │      ▼          │      ║ │ │
  │   │   ║   │  ┌───────┐      │  │  ┌───────┐      │  │  ┌───────┐      │      ║ │ │
  │   │   ║   │  │OLLAMA │      │  │  │OLLAMA │      │  │  │OLLAMA │      │      ║ │ │
  │   │   ║   │  │  LLM  │      │  │  │  LLM  │      │  │  │  LLM  │      │      ║ │ │
  │   │   ║   │  └───┬───┘      │  │  └───┬───┘      │  │  └───┬───┘      │      ║ │ │
  │   │   ║   │      │          │  │      │          │  │      │          │      ║ │ │
  │   │   ║   │      ▼          │  │      ▼          │  │      ▼          │      ║ │ │
  │   │   ║   │ Risk Score: 45  │  │ Risk Score: 72  │  │ Risk Score: 85  │      ║ │ │
  │   │   ║   │ Status: OK      │  │ Status: WARNING │  │ Status: CRITICAL│      ║ │ │
  │   │   ║   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘      ║ │ │
  │   │   ║            │                    │                    │               ║ │ │
  │   │   ╚════════════╪════════════════════╪════════════════════╪═══════════════╝ │ │
  │   │                │                    │                    │                 │ │
  │   │                └────────────────────┼────────────────────┘                 │ │
  │   │                                     │                                      │ │
  │   │                                     ▼                                      │ │
  │   │                          ┌─────────────────────┐                           │ │
  │   │                          │  EXECUTIVE DASHBOARD │                          │ │
  │   │                          │       AGENT          │                          │ │
  │   │                          │                      │                          │ │
  │   │                          │  Combines all outputs│                          │ │
  │   │                          │  Generates briefing  │                          │ │
  │   │                          │  Calculates overall  │                          │ │
  │   │                          │  risk score          │                          │ │
  │   │                          │         │            │                          │ │
  │   │                          │         ▼            │                          │ │
  │   │                          │    ┌───────┐         │                          │ │
  │   │                          │    │OLLAMA │         │                          │ │
  │   │                          │    │  LLM  │         │                          │ │
  │   │                          │    └───┬───┘         │                          │ │
  │   │                          │        │             │                          │ │
  │   │                          │        ▼             │                          │ │
  │   │                          │  CEO Briefing Ready  │                          │ │
  │   │                          │  Overall Score: 67   │                          │ │
  │   │                          └──────────┬───────────┘                          │ │
  │   │                                     │                                      │ │
  │   │                                     ▼                                      │ │
  │   │                             ┌─────────────┐                                │ │
  │   │                             │    END      │                                │ │
  │   │                             └─────────────┘                                │ │
  │   └─────────────────────────────────────────────────────────────────────────────┘ │
  └───────────────────────────────────────────────────────────────────────────────────┘

  STEP 4: RESPONSE
  ════════════════

              │
              │ Returns execution_id and status
              ▼
  ┌───────────────────────┐
  │   FastAPI Backend     │
  │                       │
  │  Returns:             │
  │  {                    │
  │    "execution_id":    │
  │      "abc123",        │
  │    "status":          │
  │      "RUNNING",       │
  │    "message":         │
  │      "Started..."     │
  │  }                    │
  └───────────┬───────────┘
              │
              ▼
  ┌───────────────────────┐
  │   React Dashboard     │
  │                       │
  │  Shows success alert  │
  │  Auto-refreshes data  │
  └───────────────────────┘
```

---

## Individual Agent Deep Dive

### Treasury Monitor Agent - Detailed Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          TREASURY MONITOR AGENT                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   INPUT DATA                         ANALYSIS                    OUTPUT          │
│   ══════════                         ════════                    ══════          │
│                                                                                  │
│   ┌──────────────────┐                                                          │
│   │  cash_positions  │                                                          │
│   │  ┌────────────┐  │     ┌─────────────────────────────────┐                  │
│   │  │ Account A  │  │     │                                 │                  │
│   │  │ USD: $5.2M │  │     │     LIQUIDITY ANALYSIS          │                  │
│   │  │ Bank: JPM  │  │────►│                                 │                  │
│   │  └────────────┘  │     │  - Total Cash: $12.8M           │                  │
│   │  ┌────────────┐  │     │  - Runway: 45 days              │                  │
│   │  │ Account B  │  │     │  - Minimum threshold: $5M       │     ┌─────────┐  │
│   │  │ EUR: €3.1M │  │     │  - Status: ADEQUATE             │     │         │  │
│   │  │ Bank: DB   │  │     └─────────────────────────────────┘     │  RISK   │  │
│   │  └────────────┘  │                                             │  SCORE  │  │
│   └──────────────────┘                                             │         │  │
│                                                                    │   45    │  │
│   ┌──────────────────┐     ┌─────────────────────────────────┐     │         │  │
│   │   fx_exposures   │     │                                 │     │ STATUS  │  │
│   │  ┌────────────┐  │     │     FX RISK ANALYSIS            │     │   OK    │  │
│   │  │ EUR: -$2M  │  │────►│                                 │────►│         │  │
│   │  │ GBP: +$1M  │  │     │  - Unhedged: $1.5M              │     │ ALERTS  │  │
│   │  │ JPY: -$500K│  │     │  - Hedge Ratio: 75%             │     │  - EUR  │  │
│   │  └────────────┘  │     │  - Risk Level: MODERATE         │     │exposure │  │
│   └──────────────────┘     └─────────────────────────────────┘     │         │  │
│                                                                    │ACTIONS  │  │
│   ┌──────────────────┐     ┌─────────────────────────────────┐     │ - Hedge │  │
│   │  debt_schedule   │     │                                 │     │   EUR   │  │
│   │  ┌────────────┐  │     │     COVENANT ANALYSIS           │     │         │  │
│   │  │ Loan A     │  │────►│                                 │     └─────────┘  │
│   │  │ $10M @4.5% │  │     │  - Debt/EBITDA: 2.8x (OK)       │                  │
│   │  │ Due: 2025  │  │     │  - Interest Coverage: 5.2x (OK) │                  │
│   │  │ Covenant:OK│  │     │  - Breaches: 0                  │                  │
│   │  └────────────┘  │     │  - Warnings: 1 (Loan B)         │                  │
│   └──────────────────┘     └─────────────────────────────────┘                  │
│                                                                                  │
│                                       │                                          │
│                                       ▼                                          │
│                            ┌─────────────────────┐                              │
│                            │    OLLAMA LLM       │                              │
│                            │                     │                              │
│                            │  Prompt:            │                              │
│                            │  "As a Treasury     │                              │
│                            │   analyst, review   │                              │
│                            │   this data and     │                              │
│                            │   provide insights" │                              │
│                            │                     │                              │
│                            │  Response:          │                              │
│                            │  "Treasury position │                              │
│                            │   is stable with    │                              │
│                            │   adequate liquidity│                              │
│                            │   Monitor EUR       │                              │
│                            │   exposure..."      │                              │
│                            └─────────────────────┘                              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Portfolio Advisor Agent - Detailed Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          PORTFOLIO ADVISOR AGENT                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   INPUT DATA                         ANALYSIS                    OUTPUT          │
│   ══════════                         ════════                    ══════          │
│                                                                                  │
│   ┌──────────────────┐     ┌─────────────────────────────────┐                  │
│   │    holdings      │     │                                 │                  │
│   │  ┌────────────┐  │     │     POSITION ANALYSIS           │                  │
│   │  │ AAPL       │  │     │                                 │                  │
│   │  │ 1000 shares│  │────►│  - Total AUM: $45.2M            │                  │
│   │  │ P&L: +$12K │  │     │  - Top Holding: AAPL (15%)      │     ┌─────────┐  │
│   │  └────────────┘  │     │  - Sector Concentration: Tech   │     │         │  │
│   │  ┌────────────┐  │     │  - Unrealized P&L: +$234K       │     │  RISK   │  │
│   │  │ MSFT       │  │     └─────────────────────────────────┘     │  SCORE  │  │
│   │  │ 500 shares │  │                                             │         │  │
│   │  │ P&L: +$8K  │  │                                             │   72    │  │
│   │  └────────────┘  │                                             │         │  │
│   └──────────────────┘     ┌─────────────────────────────────┐     │ STATUS  │  │
│                            │                                 │     │ WARNING │  │
│   ┌──────────────────┐     │     RISK METRICS                │     │         │  │
│   │   var_metrics    │     │                                 │────►│ ALERTS  │  │
│   │  ┌────────────┐  │────►│  - VaR (95%, 1D): $180K         │     │ - High  │  │
│   │  │ VaR_95: 2% │  │     │  - VaR (99%, 1D): $245K         │     │   VaR   │  │
│   │  │ VaR_99: 3% │  │     │  - Max Drawdown: -12%           │     │ - Tech  │  │
│   │  │ Beta: 1.2  │  │     │  - Beta: 1.2 (High Market Risk) │     │   heavy │  │
│   │  └────────────┘  │     └─────────────────────────────────┘     │         │  │
│   └──────────────────┘                                             │ACTIONS  │  │
│                            ┌─────────────────────────────────┐     │ -Reduce │  │
│   ┌──────────────────┐     │                                 │     │  tech   │  │
│   │   performance    │     │     PERFORMANCE ANALYSIS        │     │ -Hedge  │  │
│   │  ┌────────────┐  │────►│                                 │     │  beta   │  │
│   │  │ YTD: +8.5% │  │     │  - YTD Return: +8.5%            │     └─────────┘  │
│   │  │ Bench: +7% │  │     │  - Benchmark: +7.0%             │                  │
│   │  │ Alpha: 1.5%│  │     │  - Alpha: +1.5% (Outperforming) │                  │
│   │  │ Sharpe: 1.8│  │     │  - Sharpe Ratio: 1.8 (Good)     │                  │
│   │  └────────────┘  │     └─────────────────────────────────┘                  │
│   └──────────────────┘                                                          │
│                                       │                                          │
│                                       ▼                                          │
│                            ┌─────────────────────┐                              │
│                            │    OLLAMA LLM       │                              │
│                            │                     │                              │
│                            │  "Portfolio shows   │                              │
│                            │   strong alpha but  │                              │
│                            │   elevated VaR.     │                              │
│                            │   Consider reducing │                              │
│                            │   tech concentration│                              │
│                            │   to manage risk."  │                              │
│                            └─────────────────────┘                              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Compliance Agent - Detailed Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           COMPLIANCE AGENT                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   INPUT DATA                         ANALYSIS                    OUTPUT          │
│   ══════════                         ════════                    ══════          │
│                                                                                  │
│   ┌──────────────────┐     ┌─────────────────────────────────┐                  │
│   │   aml_alerts     │     │                                 │                  │
│   │  ┌────────────┐  │     │     AML SCREENING               │                  │
│   │  │ Alert #1   │  │     │                                 │     ┌─────────┐  │
│   │  │ Type: Large│  │────►│  - Total Alerts: 12             │     │         │  │
│   │  │ Amount:$2M │  │     │  - High Priority: 3             │     │  RISK   │  │
│   │  │ Risk: HIGH │  │     │  - Sanctions Matches: 2 ⚠️      │     │  SCORE  │  │
│   │  └────────────┘  │     │  - Pending Review: 5            │     │         │  │
│   │  ┌────────────┐  │     │                                 │     │   85    │  │
│   │  │ Alert #2   │  │     │  ⚠️ CRITICAL: Sanctions match   │     │         │  │
│   │  │ SANCTIONS  │  │     │     on Entity XYZ - IMMEDIATE   │     │ STATUS  │  │
│   │  │ Match: Yes │  │     │     ACTION REQUIRED             │     │CRITICAL │  │
│   │  └────────────┘  │     └─────────────────────────────────┘     │         │  │
│   └──────────────────┘                                             │ ALERTS  │  │
│                            ┌─────────────────────────────────┐     │ -OFAC   │  │
│   ┌──────────────────┐     │                                 │────►│  match  │  │
│   │    kyc_status    │     │     KYC COMPLIANCE              │     │ -3 high │  │
│   │  ┌────────────┐  │────►│                                 │     │  risk   │  │
│   │  │ Compliant: │  │     │  - Compliance Rate: 94.5%       │     │         │  │
│   │  │   850/900  │  │     │  - Expired: 23 clients          │     │ACTIONS  │  │
│   │  │ Expired:23 │  │     │  - High Risk Clients: 12        │     │ -Block  │  │
│   │  │ Pending:27 │  │     │  - Pending Review: 27           │     │  Entity │  │
│   │  └────────────┘  │     │                                 │     │  XYZ    │  │
│   └──────────────────┘     └─────────────────────────────────┘     │ -Review │  │
│                                                                    │  alerts │  │
│   ┌──────────────────┐     ┌─────────────────────────────────┐     │ -Update │  │
│   │   audit_logs     │     │                                 │     │  KYC    │  │
│   │  ┌────────────┐  │────►│     AUDIT MONITORING            │     └─────────┘  │
│   │  │ Event: Fail│  │     │                                 │                  │
│   │  │ Auth attemp│  │     │  - Critical Events: 3           │                  │
│   │  │ User: admin│  │     │  - Failed Logins: 15            │                  │
│   │  │ Time: 3am  │  │     │  - Suspicious: 2 (3am access)   │                  │
│   │  └────────────┘  │     └─────────────────────────────────┘                  │
│   └──────────────────┘                                                          │
│                                       │                                          │
│                                       ▼                                          │
│                            ┌─────────────────────┐                              │
│                            │    OLLAMA LLM       │                              │
│                            │                     │                              │
│                            │  "CRITICAL: 2       │                              │
│                            │   sanctions matches │                              │
│                            │   require immediate │                              │
│                            │   investigation.    │                              │
│                            │   Block Entity XYZ  │                              │
│                            │   transactions."    │                              │
│                            └─────────────────────┘                              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW THROUGH THE SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │                              EXTERNAL DATA SOURCES                                   ││
│  │   (Simulated in this hackathon - would connect to real systems in production)       ││
│  │                                                                                      ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            ││
│  │  │  Banking     │  │   Trading    │  │  Compliance  │  │   Market     │            ││
│  │  │  Systems     │  │  Platforms   │  │   Systems    │  │   Data       │            ││
│  │  │              │  │              │  │              │  │   Feeds      │            ││
│  │  │ - Cash       │  │ - Positions  │  │ - AML        │  │ - News       │            ││
│  │  │ - Transfers  │  │ - Trades     │  │ - KYC        │  │ - Prices     │            ││
│  │  │ - FX         │  │ - P&L        │  │ - Audit      │  │ - Sentiment  │            ││
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            ││
│  └─────────┼─────────────────┼─────────────────┼─────────────────┼──────────────────────┘│
│            │                 │                 │                 │                       │
│            ▼                 ▼                 ▼                 ▼                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │                              DATA STORAGE LAYER                                      ││
│  │                           (JSON/CSV Files in /data/)                                 ││
│  │                                                                                      ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            ││
│  │  │  /treasury/  │  │ /portfolio/  │  │ /compliance/ │  │   /market/   │            ││
│  │  │              │  │              │  │              │  │              │            ││
│  │  │ cash.csv     │  │ holdings.json│  │ aml.json     │  │ news.json    │            ││
│  │  │ debt.csv     │  │ var.csv      │  │ kyc.json     │  │ indicators   │            ││
│  │  │ fx.json      │  │ perf.json    │  │ audit.csv    │  │   .json      │            ││
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            ││
│  └─────────┼─────────────────┼─────────────────┼─────────────────┼──────────────────────┘│
│            │                 │                 │                 │                       │
│            └────────────┬────┴────────┬────────┴────────┬────────┘                       │
│                         │             │                 │                                │
│                         ▼             ▼                 ▼                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │                              DATA LOADER SERVICE                                     ││
│  │                        (Python - data_loader.py)                                     ││
│  │                                                                                      ││
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐    ││
│  │  │  Functions:                                                                  │    ││
│  │  │  - load_treasury_data()  → Returns TreasuryData object                      │    ││
│  │  │  - load_portfolio_data() → Returns PortfolioData object                     │    ││
│  │  │  - load_compliance_data()→ Returns ComplianceData object                    │    ││
│  │  │  - load_market_data()    → Returns MarketData object                        │    ││
│  │  │  - get_dashboard_summary()→ Returns aggregated DashboardSummary             │    ││
│  │  └─────────────────────────────────────────────────────────────────────────────┘    ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                         │                                                                │
│                         ▼                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │                              API RESPONSE LAYER                                      ││
│  │                         (FastAPI Pydantic Models)                                    ││
│  │                                                                                      ││
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        ││
│  │  │DashboardSummary  │TreasuryData   │  │PortfolioData  │  │ComplianceData │        ││
│  │  │               │  │               │  │               │  │               │        ││
│  │  │- risk_score   │  │- cash_positions  │- holdings     │  │- aml_alerts   │        ││
│  │  │- status       │  │- debt_instruments│- total_aum    │  │- kyc_rate     │        ││
│  │  │- alerts       │  │- fx_exposures │  │- var_metrics  │  │- sanctions    │        ││
│  │  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘        ││
│  └──────────┼──────────────────┼──────────────────┼──────────────────┼─────────────────┘│
│             │                  │                  │                  │                  │
│             └──────────────────┴──────────────────┴──────────────────┘                  │
│                                          │                                              │
│                                          ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │                              JSON RESPONSE TO FRONTEND                               ││
│  │                                                                                      ││
│  │   {                                                                                  ││
│  │     "overall_risk_score": 67,                                                        ││
│  │     "overall_status": "WARNING",                                                     ││
│  │     "treasury_risk_score": 45,                                                       ││
│  │     "portfolio_risk_score": 72,                                                      ││
│  │     "compliance_risk_score": 85,                                                     ││
│  │     "critical_items": 3,                                                             ││
│  │     "active_alerts": 5                                                               ││
│  │   }                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Docker Services Interaction

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           DOCKER COMPOSE SERVICES                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   docker-compose up -d --build                                                          │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                  │   │
│   │  ┌────────────────────────────────────────────────────────────────────────────┐ │   │
│   │  │  SERVICE: finance-api                                                      │ │   │
│   │  │  IMAGE: Custom Python 3.11                                                 │ │   │
│   │  │  PORT: 8000:8000                                                           │ │   │
│   │  │                                                                            │ │   │
│   │  │  ┌──────────────────────────────────────────────────────────────────────┐  │ │   │
│   │  │  │  Dockerfile:                                                         │  │ │   │
│   │  │  │  FROM python:3.11-slim                                               │  │ │   │
│   │  │  │  COPY requirements.txt .                                             │  │ │   │
│   │  │  │  RUN pip install -r requirements.txt                                 │  │ │   │
│   │  │  │  COPY . /app                                                         │  │ │   │
│   │  │  │  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]  │  │ │   │
│   │  │  └──────────────────────────────────────────────────────────────────────┘  │ │   │
│   │  │                                                                            │ │   │
│   │  │  DEPENDS_ON: kestra, ollama                                                │ │   │
│   │  │  VOLUMES: ./data:/app/data                                                 │ │   │
│   │  └────────────────────────────────────────────────────────────────────────────┘ │   │
│   │                           │                                                      │   │
│   │                           │ HTTP                                                 │   │
│   │                           ▼                                                      │   │
│   │  ┌────────────────────────────────────────────────────────────────────────────┐ │   │
│   │  │  SERVICE: kestra                                                           │ │   │
│   │  │  IMAGE: kestra/kestra:latest                                               │ │   │
│   │  │  PORTS: 8080:8080, 8081:8081                                               │ │   │
│   │  │                                                                            │ │   │
│   │  │  ENVIRONMENT:                                                              │ │   │
│   │  │  - KESTRA_CONFIGURATION: |                                                 │ │   │
│   │  │      datasources:                                                          │ │   │
│   │  │        postgres:                                                           │ │   │
│   │  │          url: jdbc:postgresql://kestra-postgres:5432/kestra                │ │   │
│   │  │                                                                            │ │   │
│   │  │  VOLUMES: ./flows:/app/flows                                               │ │   │
│   │  │  DEPENDS_ON: kestra-postgres                                               │ │   │
│   │  └────────────────────────────────────────────────────────────────────────────┘ │   │
│   │                           │                                                      │   │
│   │                           │ JDBC                                                 │   │
│   │                           ▼                                                      │   │
│   │  ┌────────────────────────────────────────────────────────────────────────────┐ │   │
│   │  │  SERVICE: kestra-postgres                                                  │ │   │
│   │  │  IMAGE: postgres:15                                                        │ │   │
│   │  │  PORT: (Internal only - not exposed)                                       │ │   │
│   │  │                                                                            │ │   │
│   │  │  ENVIRONMENT:                                                              │ │   │
│   │  │  - POSTGRES_DB=kestra                                                      │ │   │
│   │  │  - POSTGRES_USER=kestra                                                    │ │   │
│   │  │  - POSTGRES_PASSWORD=kestra                                                │ │   │
│   │  │                                                                            │ │   │
│   │  │  VOLUMES: postgres_data:/var/lib/postgresql/data                           │ │   │
│   │  └────────────────────────────────────────────────────────────────────────────┘ │   │
│   │                                                                                  │   │
│   │  ┌────────────────────────────────────────────────────────────────────────────┐ │   │
│   │  │  SERVICE: ollama                                                           │ │   │
│   │  │  IMAGE: ollama/ollama:latest                                               │ │   │
│   │  │  PORT: 11434:11434                                                         │ │   │
│   │  │                                                                            │ │   │
│   │  │  VOLUMES: ollama_data:/root/.ollama                                        │ │   │
│   │  │                                                                            │ │   │
│   │  │  GPU: (Optional) deploy.resources.reservations.devices                     │ │   │
│   │  └────────────────────────────────────────────────────────────────────────────┘ │   │
│   │                           │                                                      │   │
│   │                           │ Model Pull (on first start)                          │   │
│   │                           ▼                                                      │   │
│   │  ┌────────────────────────────────────────────────────────────────────────────┐ │   │
│   │  │  SERVICE: ollama-pull                                                      │ │   │
│   │  │  IMAGE: curlimages/curl                                                    │ │   │
│   │  │                                                                            │ │   │
│   │  │  COMMAND: curl -X POST http://ollama:11434/api/pull                        │ │   │
│   │  │           -d '{"name": "llama3.2:3b"}'                                      │ │   │
│   │  │                                                                            │ │   │
│   │  │  DEPENDS_ON: ollama                                                        │ │   │
│   │  │  RESTART: on-failure (runs once to pull model)                             │ │   │
│   │  └────────────────────────────────────────────────────────────────────────────┘ │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   NETWORKS: finance-network (bridge)                                                    │
│   VOLUMES: postgres_data, ollama_data                                                   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Kestra Workflows - Deep Technical Dive

### Workflow Overview

Our solution uses **6 Kestra workflows** that work together to provide comprehensive financial analysis:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            KESTRA WORKFLOW ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│                           ┌─────────────────────────────┐                               │
│                           │   finance-ai-orchestrator   │                               │
│                           │      (Main Orchestrator)    │                               │
│                           │                             │                               │
│                           │  Namespace: finance         │                               │
│                           │  Triggers:                  │                               │
│                           │  - Daily 6 AM (cron)        │                               │
│                           │  - Webhook (on-demand)      │                               │
│                           │  - Event (compliance alert) │                               │
│                           └─────────────┬───────────────┘                               │
│                                         │                                               │
│             ┌───────────────────────────┼───────────────────────────┐                   │
│             │                           │                           │                   │
│             ▼                           ▼                           ▼                   │
│  ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐           │
│  │  treasury-monitor   │   │  portfolio-advisor  │   │  compliance-agent   │           │
│  │                     │   │                     │   │                     │           │
│  │  Namespace:         │   │  Namespace:         │   │  Namespace:         │           │
│  │  finance.agents     │   │  finance.agents     │   │  finance.agents     │           │
│  │                     │   │                     │   │                     │           │
│  │  Schedule: 6 AM     │   │  Schedule: 7 AM     │   │  Schedule: Every 4h │           │
│  │                     │   │                     │   │  + Webhook trigger  │           │
│  └──────────┬──────────┘   └──────────┬──────────┘   └──────────┬──────────┘           │
│             │                         │                         │                       │
│             └─────────────────────────┼─────────────────────────┘                       │
│                                       │                                                 │
│                                       ▼                                                 │
│                          ┌─────────────────────────┐                                    │
│                          │  executive-dashboard    │                                    │
│                          │                         │                                    │
│                          │  Namespace:             │                                    │
│                          │  finance.agents         │                                    │
│                          │                         │                                    │
│                          │  Schedule: 6 AM (M-F)   │                                    │
│                          │  + Webhook trigger      │                                    │
│                          └──────────┬──────────────┘                                    │
│                                     │                                                   │
│                                     ▼                                                   │
│                          ┌─────────────────────────┐                                    │
│                          │    alert-subflow        │                                    │
│                          │  (Notifications)        │                                    │
│                          │                         │                                    │
│                          │  Namespace:             │                                    │
│                          │  finance.notifications  │                                    │
│                          └─────────────────────────┘                                    │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Workflow 1: Main Orchestrator (finance-ai-orchestrator)

**File:** `backend/flows/main-orchestrator.yml`

The brain of the system - coordinates all agents and generates unified insights.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          MAIN ORCHESTRATOR WORKFLOW                                      │
│                          ID: finance-ai-orchestrator                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  INPUTS:                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  • run_mode: STRING (default: "full")                                               ││
│  │    Options: full, treasury_only, portfolio_only, compliance_only                    ││
│  │                                                                                      ││
│  │  • risk_threshold: INT (default: 70)                                                ││
│  │    Global risk threshold for triggering alerts                                       ││
│  │                                                                                      ││
│  │  • send_notifications: BOOLEAN (default: true)                                      ││
│  │    Enable/disable notification sending                                               ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  EXECUTION PHASES:                                                                       │
│  ═══════════════════════════════════════════════════════════════════════════════════════│
│                                                                                          │
│  PHASE 1: DATA VALIDATION                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  Task: validate_data_sources                                                        ││
│  │  Type: io.kestra.plugin.core.log.Log                                                ││
│  │  Purpose: Verify all data sources are accessible                                    ││
│  │  Checks: /treasury/, /portfolio/, /compliance/, /market/                            ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  PHASE 2: TREASURY ANALYSIS                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  Task: treasury_analysis (Log)                                                      ││
│  │  ├── Total Cash: $14,025,700                                                        ││
│  │  ├── Total Debt: $22,240,000                                                        ││
│  │  ├── Net Position: -$8,214,300                                                      ││
│  │  └── Risk Score: 95/100 (CRITICAL)                                                  ││
│  │                                                                                      ││
│  │  Task: treasury_ai_summary (HTTP Request to Ollama)                                 ││
│  │  └── Generates 3-bullet executive summary                                           ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  PHASE 3: PORTFOLIO ANALYSIS                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  Task: portfolio_analysis (Log)                                                     ││
│  │  ├── AUM: $15,750,000                                                               ││
│  │  ├── YTD Return: 12.35% (vs Benchmark 14.80%)                                       ││
│  │  ├── VaR (95%, 1-day): $157,500                                                     ││
│  │  └── Risk Score: 72/100 (WARNING)                                                   ││
│  │                                                                                      ││
│  │  Task: portfolio_ai_summary (HTTP Request to Ollama)                                ││
│  │  └── Generates performance analysis                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  PHASE 4: COMPLIANCE ANALYSIS                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  Task: compliance_analysis (Log)                                                    ││
│  │  ├── Total AML Alerts: 15 (3 High Priority)                                         ││
│  │  ├── SANCTIONS MATCH: 1 (€750,000)                                                  ││
│  │  ├── KYC Compliance Rate: 80.8%                                                     ││
│  │  └── Risk Score: 100/100 (CRITICAL)                                                 ││
│  │                                                                                      ││
│  │  Task: compliance_ai_summary (HTTP Request to Ollama)                               ││
│  │  └── Highlights critical compliance items                                            ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  PHASE 5: UNIFIED AI SUMMARY                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  Task: generate_unified_summary (HTTP Request to Ollama)                            ││
│  │  Prompt: Combine all agent outputs into:                                            ││
│  │  ├── Overall Health Score (0-100)                                                   ││
│  │  ├── Top 3 Priorities                                                               ││
│  │  └── Recommended Actions                                                             ││
│  │                                                                                      ││
│  │  LLM Config: temperature=0.3, max_tokens=500                                        ││
│  │  Timeout: 120 seconds                                                               ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  PHASE 6: AUTONOMOUS ACTIONS                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  Task: execute_autonomous_actions                                                   ││
│  │  Actions triggered based on risk analysis:                                          ││
│  │                                                                                      ││
│  │  ✓ ACTION 1: SEND_CRITICAL_ALERT                                                    ││
│  │    └── Recipients: CEO, CFO, CCO | Channels: Email, Slack                           ││
│  │                                                                                      ││
│  │  ✓ ACTION 2: CREATE_INCIDENT_TICKET                                                 ││
│  │    └── Type: P1 Incident | SLA: 4 hours                                             ││
│  │                                                                                      ││
│  │  ✓ ACTION 3: SCHEDULE_MEETING                                                       ││
│  │    └── Emergency Compliance Committee                                               ││
│  │                                                                                      ││
│  │  ✓ ACTION 4: FLAG_REBALANCING                                                       ││
│  │    └── Trigger portfolio review workflow                                            ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  PHASE 7: FINAL REPORT                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  Task: generate_final_report                                                        ││
│  │  Outputs comprehensive execution summary:                                           ││
│  │  ├── Overall Risk Score: 89/100                                                     ││
│  │  ├── Status: CRITICAL                                                               ││
│  │  ├── Critical Items: 3                                                              ││
│  │  └── Actions Triggered: 4                                                           ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  OUTPUTS:                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  execution_status: STRING ("COMPLETED")                                             ││
│  │  overall_risk_score: INT (89)                                                       ││
│  │  critical_items: INT (3)                                                            ││
│  │  actions_triggered: INT (4)                                                         ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  TRIGGERS:                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  1. daily_orchestration: Cron "0 6 * * 1-5" (6 AM weekdays)                         ││
│  │  2. manual_trigger: Webhook (API triggered)                                         ││
│  │  3. compliance_event: Flow trigger on compliance alerts                             ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Workflow 2: Treasury Monitor (treasury-monitor)

**File:** `backend/flows/treasury-monitor.yml`

Monitors cash positions, FX exposures, and debt covenants.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          TREASURY MONITOR WORKFLOW                                       │
│                          ID: treasury-monitor                                            │
│                          Namespace: finance.agents                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  INPUTS:                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  • risk_threshold: INT (default: 75)                                                ││
│  │  • liquidity_min_days: INT (default: 30) - Minimum runway in days                   ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  TASK PIPELINE:                                                                          │
│  ══════════════                                                                          │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 1: load_cash_positions                                                        ││
│  │  Type: Python Script (containerImage: python:3.11-slim)                             ││
│  │  Dependencies: pandas                                                                ││
│  │                                                                                      ││
│  │  Script Actions:                                                                     ││
│  │  1. Read /app/data/treasury/cash_positions.csv                                      ││
│  │  2. Get latest date positions                                                       ││
│  │  3. Calculate totals by currency (USD, EUR, GBP, JPY)                               ││
│  │  4. Convert to USD equivalent using FX rates                                        ││
│  │                                                                                      ││
│  │  Output: {                                                                          ││
│  │    as_of_date, positions[], totals_by_currency,                                     ││
│  │    total_usd_equivalent, account_count                                              ││
│  │  }                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 2: load_fx_exposures                                                          ││
│  │  Type: Python Script                                                                ││
│  │                                                                                      ││
│  │  Script Actions:                                                                     ││
│  │  1. Read /app/data/treasury/fx_rates.json                                           ││
│  │  2. Calculate total unhedged exposure                                               ││
│  │  3. Find currencies with hedge ratio < 70%                                          ││
│  │                                                                                      ││
│  │  Output: {                                                                          ││
│  │    rates, exposures, total_unhedged_exposure,                                       ││
│  │    low_hedge_alerts[]                                                               ││
│  │  }                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 3: load_debt_schedule                                                         ││
│  │  Type: Python Script (pandas required)                                              ││
│  │                                                                                      ││
│  │  Script Actions:                                                                     ││
│  │  1. Read /app/data/treasury/debt_schedule.csv                                       ││
│  │  2. Find upcoming payments (next 30 days)                                           ││
│  │  3. Identify covenant issues (non-COMPLIANT status)                                 ││
│  │  4. Calculate weighted average interest rate                                        ││
│  │                                                                                      ││
│  │  Output: {                                                                          ││
│  │    total_debt_outstanding, weighted_avg_rate,                                       ││
│  │    upcoming_payments_30d, covenant_issues[]                                         ││
│  │  }                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 4: summarize_treasury (AI-POWERED)                                            ││
│  │  Type: Python Script with HTTP call to Ollama                                       ││
│  │  Dependencies: requests                                                              ││
│  │                                                                                      ││
│  │  LLM Prompt:                                                                        ││
│  │  "You are a senior treasury analyst. Analyze the following treasury data            ││
│  │   and provide:                                                                       ││
│  │   1. Executive Summary (2-3 sentences)                                              ││
│  │   2. Key Risks (bullet points)                                                      ││
│  │   3. Recommended Actions (prioritized)                                              ││
│  │   4. Risk Score (0-100)"                                                            ││
│  │                                                                                      ││
│  │  API Call:                                                                          ││
│  │  POST http://ollama:11434/api/generate                                              ││
│  │  { model: "llama3.2:3b", temperature: 0.3, num_predict: 1000 }                      ││
│  │                                                                                      ││
│  │  Output: {                                                                          ││
│  │    summary, risk_score: 72,                                                         ││
│  │    alerts: [COVENANT_BREACH, HEDGE_RATIO_LOW]                                       ││
│  │  }                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 5: evaluate_alerts                                                            ││
│  │  Type: Python Script                                                                ││
│  │                                                                                      ││
│  │  Logic:                                                                             ││
│  │  if risk_score >= threshold:                                                        ││
│  │      alerts_needed = True                                                           ││
│  │      priority = HIGH if risk >= 80 else MEDIUM if risk >= 60 else LOW               ││
│  │                                                                                      ││
│  │  Output: {                                                                          ││
│  │    should_alert, risk_score, threshold, priority                                    ││
│  │  }                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  WORKFLOW OUTPUTS:                                                                      │
│  • treasury_summary: STRING (AI-generated summary)                                      │
│  • risk_score: INT (0-100)                                                              │
│  • alerts_triggered: BOOLEAN                                                            │
│                                                                                          │
│  TRIGGER: Daily at 6 AM                                                                 │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Workflow 3: Portfolio Advisor (portfolio-advisor)

**File:** `backend/flows/portfolio-advisor.yml`

Analyzes investment portfolio, VaR metrics, and performance.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          PORTFOLIO ADVISOR WORKFLOW                                      │
│                          ID: portfolio-advisor                                           │
│                          Namespace: finance.agents                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  INPUTS:                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  • var_threshold: FLOAT (default: 200000) - VaR limit in USD                        ││
│  │  • risk_score_threshold: INT (default: 75)                                          ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  TASK PIPELINE:                                                                          │
│  ══════════════                                                                          │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 1: load_holdings                                                              ││
│  │  Input: /app/data/portfolio/holdings.json                                           ││
│  │                                                                                      ││
│  │  Calculates:                                                                        ││
│  │  • Total unrealized P&L                                                             ││
│  │  • Winners/Losers count                                                             ││
│  │  • Concentration risk (positions > 15% weight)                                      ││
│  │  • Maximum position weight                                                          ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 2: load_var_metrics                                                           ││
│  │  Input: /app/data/portfolio/var_metrics.csv                                         ││
│  │                                                                                      ││
│  │  Extracts:                                                                          ││
│  │  • VaR (95%, 1-day)     → $157,500                                                  ││
│  │  • VaR (99%, 1-day)     → Higher tail risk                                          ││
│  │  • CVaR (95%)           → Expected shortfall                                        ││
│  │  • Max Drawdown         → Peak-to-trough decline                                    ││
│  │  • Sharpe Ratio         → Risk-adjusted return                                      ││
│  │  • 30-day Volatility    → Recent price swings                                       ││
│  │                                                                                      ││
│  │  Trend Analysis: Compare to 7-day ago metrics                                       ││
│  │  • var_trend: INCREASING/DECREASING                                                 ││
│  │  • risk_trend: INCREASING/DECREASING                                                ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 3: load_performance                                                           ││
│  │  Input: /app/data/portfolio/performance.json                                        ││
│  │                                                                                      ││
│  │  Extracts:                                                                          ││
│  │  • Daily/MTD/YTD returns                                                            ││
│  │  • Alpha vs benchmark                                                               ││
│  │  • Attribution analysis (what drove returns)                                        ││
│  │  • Top contributors and detractors                                                  ││
│  │                                                                                      ││
│  │  Flags: underperforming_benchmark = True if alpha < 0                               ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 4: load_market_context                                                        ││
│  │  Input: /app/data/market/news_feed.json                                             ││
│  │                                                                                      ││
│  │  Purpose: Provide market context for AI analysis                                    ││
│  │  Filters: High relevance articles (score > 0.8)                                     ││
│  │                                                                                      ││
│  │  Output: market_sentiment, key_themes, risk_factors                                 ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 5: analyze_portfolio (AI-POWERED)                                             ││
│  │  Type: Python Script + Ollama HTTP Request                                          ││
│  │                                                                                      ││
│  │  LLM Prompt:                                                                        ││
│  │  "You are a senior portfolio manager and risk analyst. Analyze this data:           ││
│  │   1. EXECUTIVE SUMMARY (2-3 sentences on overall health)                            ││
│  │   2. RISK ASSESSMENT (key risks identified, severity)                               ││
│  │   3. PERFORMANCE ATTRIBUTION (why underperforming)                                  ││
│  │   4. RECOMMENDED ACTIONS (specific, actionable)                                     ││
│  │   5. REBALANCING SUGGESTIONS (if needed)                                            ││
│  │   6. OVERALL RISK RATING (1-10 with justification)"                                 ││
│  │                                                                                      ││
│  │  API Config: temperature=0.3, max_tokens=1200, timeout=120s                         ││
│  │                                                                                      ││
│  │  Fallback: Pre-written analysis if Ollama unavailable                               ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 6: determine_actions                                                          ││
│  │                                                                                      ││
│  │  Decision Matrix:                                                                   ││
│  │  ┌────────────────────┬───────────────────────────────────────────┐                 ││
│  │  │ Condition          │ Action                                    │                 ││
│  │  ├────────────────────┼───────────────────────────────────────────┤                 ││
│  │  │ risk >= threshold  │ send_alert = True                         │                 ││
│  │  │ OR var >= limit    │                                           │                 ││
│  │  ├────────────────────┼───────────────────────────────────────────┤                 ││
│  │  │ risk >= 80         │ trigger_rebalancing_review = True         │                 ││
│  │  ├────────────────────┼───────────────────────────────────────────┤                 ││
│  │  │ risk >= 85         │ escalate_to_cio = True                    │                 ││
│  │  └────────────────────┴───────────────────────────────────────────┘                 ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  WORKFLOW OUTPUTS:                                                                      │
│  • portfolio_analysis: STRING (AI analysis)                                             │
│  • risk_rating: INT (1-10)                                                              │
│  • actions_required: BOOLEAN                                                            │
│                                                                                          │
│  TRIGGER: Daily at 7 AM                                                                 │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Workflow 4: Compliance Agent (compliance-agent)

**File:** `backend/flows/compliance-agent.yml`

Monitors AML alerts, KYC status, and audit logs for regulatory compliance.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          COMPLIANCE AGENT WORKFLOW                                       │
│                          ID: compliance-agent                                            │
│                          Namespace: finance.agents                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  INPUTS:                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  • high_priority_threshold: INT (default: 2)                                        ││
│  │    Number of high-priority alerts to trigger escalation                             ││
│  │                                                                                      ││
│  │  • critical_event_types: STRING                                                     ││
│  │    Default: "UNAUTHORIZED_ACCESS,SANCTIONS_MATCH,STRUCTURING_SUSPECTED"             ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  TASK PIPELINE:                                                                          │
│  ══════════════                                                                          │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 1: load_aml_alerts                                                            ││
│  │  Input: /app/data/compliance/aml_alerts.json                                        ││
│  │                                                                                      ││
│  │  Processing:                                                                        ││
│  │  • Filter PENDING_REVIEW + UNDER_INVESTIGATION status                               ││
│  │  • Identify SANCTIONS_MATCH alerts (always critical)                                ││
│  │  • Check regulatory deadlines                                                       ││
│  │                                                                                      ││
│  │  Output:                                                                            ││
│  │  • critical_alerts_count                                                            ││
│  │  • sanctions_alerts[]                                                               ││
│  │  • pending_deadlines[]                                                              ││
│  │  • requires_immediate_action: Boolean                                               ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 2: analyze_audit_logs                                                         ││
│  │  Input: /app/data/compliance/audit_logs.csv                                         ││
│  │  Dependencies: pandas                                                               ││
│  │                                                                                      ││
│  │  Security Events Analyzed:                                                          ││
│  │  ┌────────────────────────────┬───────────────────────────────────┐                 ││
│  │  │ Event Type                 │ Risk Level                        │                 ││
│  │  ├────────────────────────────┼───────────────────────────────────┤                 ││
│  │  │ FAILED_LOGIN               │ Potential brute force             │                 ││
│  │  │ UNAUTHORIZED_ACCESS        │ CRITICAL - Escalate immediately   │                 ││
│  │  │ BULK_DOWNLOAD              │ Potential data exfiltration       │                 ││
│  │  │ CONFIG_CHANGE              │ Audit trail importance            │                 ││
│  │  └────────────────────────────┴───────────────────────────────────┘                 ││
│  │                                                                                      ││
│  │  security_concerns = unauthorized > 0 OR failed_logins > 2                          ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 3: check_kyc_status                                                           ││
│  │  Input: /app/data/compliance/kyc_status.json                                        ││
│  │                                                                                      ││
│  │  KYC Analysis:                                                                      ││
│  │  • Compliance rate = fully_compliant / total_clients                                ││
│  │  • Urgent expirations (within 14 days)                                              ││
│  │  • High-risk client monitoring                                                      ││
│  │                                                                                      ││
│  │  Action Required If:                                                                ││
│  │  • urgent_expirations > 0                                                           ││
│  │  • expired_documentation > 5                                                        ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 4: generate_compliance_summary (AI-POWERED)                                   ││
│  │  Type: Python + Ollama                                                              ││
│  │                                                                                      ││
│  │  LLM Prompt (CCO perspective):                                                      ││
│  │  "You are the Chief Compliance Officer reviewing the daily report.                  ││
│  │   Provide:                                                                          ││
│  │   1. COMPLIANCE HEALTH SCORE (0-100, with RAG status)                               ││
│  │   2. CRITICAL ITEMS REQUIRING IMMEDIATE ACTION (with deadlines)                     ││
│  │   3. REGULATORY RISK ASSESSMENT                                                     ││
│  │   4. RECOMMENDED ESCALATIONS                                                        ││
│  │   5. 24-HOUR ACTION PLAN                                                            ││
│  │                                                                                      ││
│  │   Be specific about who needs to do what and by when.                               ││
│  │   Flag any potential regulatory violations."                                        ││
│  │                                                                                      ││
│  │  API Config: temperature=0.2 (low for compliance accuracy)                          ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                              │                                                           │
│                              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 5: determine_escalations                                                      ││
│  │                                                                                      ││
│  │  Escalation Matrix:                                                                 ││
│  │  ┌─────────────────────────┬────────────────────────────────────────┐               ││
│  │  │ Condition               │ Notification                           │               ││
│  │  ├─────────────────────────┼────────────────────────────────────────┤               ││
│  │  │ Always                  │ notify_cco = True                      │               ││
│  │  ├─────────────────────────┼────────────────────────────────────────┤               ││
│  │  │ has_sanctions_match     │ notify_ceo = True                      │               ││
│  │  │                         │ notify_legal = True                    │               ││
│  │  │                         │ create_incident_ticket = True          │               ││
│  │  ├─────────────────────────┼────────────────────────────────────────┤               ││
│  │  │ security_concerns       │ notify_security_team = True            │               ││
│  │  ├─────────────────────────┼────────────────────────────────────────┤               ││
│  │  │ pending_deadlines       │ regulatory_filing_alert = True         │               ││
│  │  └─────────────────────────┴────────────────────────────────────────┘               ││
│  │                                                                                      ││
│  │  Priority: CRITICAL if sanctions_match else HIGH                                    ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  WORKFLOW OUTPUTS:                                                                      │
│  • compliance_summary: STRING                                                           │
│  • health_score: INT (0-100)                                                            │
│  • escalation_required: BOOLEAN                                                         │
│                                                                                          │
│  TRIGGERS:                                                                              │
│  • regular_check: Every 4 hours (cron "0 */4 * * *")                                    │
│  • alert_webhook: On-demand via API                                                     │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Workflow 5: Executive Dashboard (executive-dashboard)

**File:** `backend/flows/executive-dashboard.yml`

Aggregates all data into a CEO-ready briefing.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          EXECUTIVE DASHBOARD WORKFLOW                                    │
│                          ID: executive-dashboard                                         │
│                          Namespace: finance.agents                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  PURPOSE: Generate 2-minute CEO briefing every morning                                  │
│                                                                                          │
│  INPUTS:                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  • report_type: STRING (default: "daily") - daily/weekly/monthly                    ││
│  │  • include_market_analysis: BOOLEAN (default: true)                                 ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  DATA AGGREGATION TASKS:                                                                │
│  ══════════════════════                                                                  │
│                                                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │   TASK 1:      │  │   TASK 2:      │  │   TASK 3:      │  │   TASK 4:      │         │
│  │  aggregate_    │  │  aggregate_    │  │  aggregate_    │  │  aggregate_    │         │
│  │  treasury      │  │  portfolio     │  │  compliance    │  │  market        │         │
│  │                │  │                │  │                │  │                │         │
│  │ • Total Cash   │  │ • Total AUM    │  │ • AML Alerts   │  │ • Sentiment    │         │
│  │ • Total Debt   │  │ • YTD Return   │  │ • Sanctions    │  │ • S&P 500      │         │
│  │ • Net Position │  │ • vs Benchmark │  │ • KYC Rate     │  │ • VIX          │         │
│  │ • Covenants    │  │ • VaR/Risk     │  │ • Deadlines    │  │ • 10Y Yield    │         │
│  │ • FX Exposure  │  │ • Sharpe       │  │ • Expirations  │  │ • Headlines    │         │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘         │
│          │                   │                   │                   │                  │
│          └───────────────────┴───────────────────┴───────────────────┘                  │
│                                          │                                              │
│                                          ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 5: generate_executive_briefing (AI-POWERED)                                   ││
│  │                                                                                      ││
│  │  LLM Prompt:                                                                        ││
│  │  "You are the CFO's executive assistant preparing the daily financial briefing.     ││
│  │   Create a concise executive summary that:                                          ││
│  │                                                                                      ││
│  │   1. Opens with a 2-sentence BOTTOM LINE UP FRONT                                   ││
│  │   2. Lists TOP 3 PRIORITIES for today (actionable)                                  ││
│  │   3. Highlights KEY RISKS requiring attention                                       ││
│  │   4. Provides OUTLOOK for the week ahead                                            ││
│  │   5. Ends with RECOMMENDED BOARD ITEMS (if any)                                     ││
│  │                                                                                      ││
│  │   Keep it concise and executive-friendly. Use bullet points.                        ││
│  │   This will be read in 2 minutes by the CEO at 7 AM."                               ││
│  │                                                                                      ││
│  │  Example Output:                                                                    ││
│  │  ════════════════════════════════════════════════════════════════                   ││
│  │  BOTTOM LINE: Financial position stable with $15.75M AUM generating                 ││
│  │  12.35% YTD returns, but COMPLIANCE REQUIRES IMMEDIATE ATTENTION                    ││
│  │  due to potential sanctions match requiring CEO notification.                       ││
│  │                                                                                      ││
│  │  TOP 3 PRIORITIES TODAY:                                                            ││
│  │  1. 🔴 SANCTIONS ALERT: Review Eastern Shipping Co. transaction                     ││
│  │  2. ⚠️ COVENANT BREACH: Credit line DEBT006 in breach                               ││
│  │  3. 📋 REGULATORY: CTR filing due December 13                                       ││
│  │  ════════════════════════════════════════════════════════════════                   ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                          │                                              │
│                                          ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  TASK 6: determine_distribution                                                     ││
│  │                                                                                      ││
│  │  Distribution Logic:                                                                ││
│  │  ┌─────────────────────┬──────────────────────────────────────────────┐             ││
│  │  │ Overall Status      │ Recipients                                   │             ││
│  │  ├─────────────────────┼──────────────────────────────────────────────┤             ││
│  │  │ CRITICAL            │ CEO, CFO, COO, Board, Risk Committee         │             ││
│  │  │                     │ Slack: #executive-alerts (URGENT)            │             ││
│  │  ├─────────────────────┼──────────────────────────────────────────────┤             ││
│  │  │ WARNING             │ CEO, CFO, COO, Risk Committee                │             ││
│  │  │                     │ Slack: #executive-alerts                     │             ││
│  │  ├─────────────────────┼──────────────────────────────────────────────┤             ││
│  │  │ OK                  │ CEO, CFO                                     │             ││
│  │  │                     │ Slack: #daily-briefing                       │             ││
│  │  └─────────────────────┴──────────────────────────────────────────────┘             ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  WORKFLOW OUTPUTS:                                                                      │
│  • executive_briefing: STRING (full briefing text)                                      │
│  • overall_status: STRING (CRITICAL/WARNING/OK)                                         │
│  • requires_ceo_attention: BOOLEAN                                                      │
│                                                                                          │
│  TRIGGERS:                                                                              │
│  • morning_briefing: 6 AM weekdays (cron "0 6 * * 1-5")                                 │
│  • manual_trigger: Webhook for on-demand generation                                     │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### LLM Integration Details

All workflows use **Ollama** with **Llama 3.2 (3B parameter model)** for AI analysis:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          OLLAMA LLM INTEGRATION                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  API ENDPOINT: http://ollama:11434/api/generate                                         │
│  MODEL: llama3.2:3b                                                                      │
│                                                                                          │
│  REQUEST FORMAT:                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  POST /api/generate                                                                 ││
│  │  {                                                                                  ││
│  │    "model": "llama3.2:3b",                                                          ││
│  │    "prompt": "Your analysis prompt here...",                                        ││
│  │    "stream": false,                                                                 ││
│  │    "options": {                                                                     ││
│  │      "temperature": 0.3,      // Lower = more deterministic                         ││
│  │      "num_predict": 500-1200  // Max tokens in response                             ││
│  │    }                                                                                ││
│  │  }                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  TEMPERATURE SETTINGS BY AGENT:                                                         │
│  ┌─────────────────────────┬──────────────────┬───────────────────────────────────────┐│
│  │ Agent                   │ Temperature      │ Reason                                ││
│  ├─────────────────────────┼──────────────────┼───────────────────────────────────────┤│
│  │ Treasury Monitor        │ 0.3              │ Factual financial analysis            ││
│  │ Portfolio Advisor       │ 0.3              │ Risk assessment accuracy              ││
│  │ Compliance Agent        │ 0.2              │ Regulatory precision (lowest)         ││
│  │ Executive Dashboard     │ 0.3              │ Balanced summary generation           ││
│  │ Main Orchestrator       │ 0.3              │ Unified analysis                      ││
│  └─────────────────────────┴──────────────────┴───────────────────────────────────────┘│
│                                                                                          │
│  TIMEOUT HANDLING:                                                                      │
│  • Default: 120 seconds per LLM call                                                    │
│  • allowFailed: true (workflow continues if LLM fails)                                  │
│  • Fallback summaries provided for critical workflows                                   │
│                                                                                          │
│  WHY LOCAL LLM?                                                                         │
│  • No API costs (OpenAI/Claude can cost $100s/month)                                    │
│  • Data never leaves the premises (compliance requirement)                              │
│  • No rate limits or quotas                                                             │
│  • Works offline after initial model download                                           │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
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

## Why This Solution?

### Business Value
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BUSINESS IMPACT                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   BEFORE (Manual Process)              AFTER (AI Orchestrator)                  │
│   ═══════════════════════              ════════════════════════                 │
│                                                                                  │
│   ┌─────────────────────┐              ┌─────────────────────┐                  │
│   │  Treasury Team      │              │   AI Agent          │                  │
│   │  - 2 hours daily    │              │   - 30 seconds      │                  │
│   │  - Manual reports   │      →       │   - Automated       │                  │
│   │  - Error-prone      │              │   - Consistent      │                  │
│   └─────────────────────┘              └─────────────────────┘                  │
│                                                                                  │
│   ┌─────────────────────┐              ┌─────────────────────┐                  │
│   │  Portfolio Team     │              │   AI Agent          │                  │
│   │  - 3 hours daily    │              │   - 30 seconds      │                  │
│   │  - Spreadsheets     │      →       │   - Real-time       │                  │
│   │  - Delayed insights │              │   - Instant alerts  │                  │
│   └─────────────────────┘              └─────────────────────┘                  │
│                                                                                  │
│   ┌─────────────────────┐              ┌─────────────────────┐                  │
│   │  Compliance Team    │              │   AI Agent          │                  │
│   │  - 4 hours daily    │              │   - 30 seconds      │                  │
│   │  - Manual screening │      →       │   - Auto-flagging   │                  │
│   │  - Missed alerts    │              │   - Zero misses     │                  │
│   └─────────────────────┘              └─────────────────────┘                  │
│                                                                                  │
│   ════════════════════════════════════════════════════════════════════════════  │
│                                                                                  │
│   TOTAL TIME SAVED: 9+ hours daily                                              │
│   ACCURACY IMPROVEMENT: 95%+ consistent analysis                                │
│   COST REDUCTION: No cloud API fees (local LLM)                                 │
│   DATA PRIVACY: All processing on-premises                                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
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
