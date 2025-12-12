# Finance AI Orchestrator - Frontend

## Status: Placeholder

This directory will contain the frontend dashboard for the Finance AI Orchestrator.

## Planned Tech Stack

- **Framework**: React 18 / Next.js 14
- **UI Library**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts / Chart.js
- **State Management**: Zustand / React Query
- **API Client**: Axios / Fetch

## Planned Features

### Dashboard Views

1. **Executive Dashboard**
   - Overall risk score gauge
   - Status indicators for Treasury, Portfolio, Compliance
   - Critical alerts panel
   - Recent actions timeline

2. **Treasury View**
   - Cash positions table
   - Debt schedule with covenant status
   - FX exposure chart
   - Net position trend

3. **Portfolio View**
   - Holdings table with P&L
   - Risk metrics (VaR, Sharpe)
   - Performance vs benchmark chart
   - Asset allocation pie chart

4. **Compliance View**
   - AML alerts list with priority
   - KYC compliance gauge
   - Audit events timeline
   - Sanctions match alerts (critical)

5. **Market View**
   - News feed with sentiment
   - Economic indicators
   - Market indices chart

6. **Workflow Control**
   - Trigger workflow button
   - Execution history table
   - Real-time status updates
   - Logs viewer

## Backend API Endpoints

The frontend will connect to these backend endpoints:

```
GET  http://localhost:8000/health           # Health check
GET  http://localhost:8000/data/dashboard   # Dashboard summary
GET  http://localhost:8000/data/treasury    # Treasury data
GET  http://localhost:8000/data/portfolio   # Portfolio data
GET  http://localhost:8000/data/compliance  # Compliance data
GET  http://localhost:8000/data/market      # Market data
POST http://localhost:8000/workflows/trigger # Trigger workflow
GET  http://localhost:8000/workflows/executions # List executions
```

## Setup Instructions

Once backend is stable:

```bash
# Navigate to frontend directory
cd frontend

# Initialize React project
npx create-next-app@latest . --typescript --tailwind --eslint

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Notes

- Backend must be running first (see ../backend/README.md)
- API runs on port 8000, frontend will run on port 3000
- CORS is already configured in backend for localhost:3000
