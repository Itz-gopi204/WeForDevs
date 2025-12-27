# Finance AI Dashboard - Frontend

> **AssembleHack25 Hackathon Submission**
> Executive-grade React dashboard for AI-powered financial intelligence

## Overview

The Finance AI Dashboard provides a modern, responsive interface for monitoring financial health across treasury, portfolio, compliance, and market intelligence domains. It connects to the FastAPI backend and displays real-time AI-generated insights.

## Screenshots

### Dashboard Overview
```
┌────────────────────────────────────────────────────────────────────────┐
│  Finance AI                 Dashboard                    [OK] Status   │
│  Orchestrator              Last updated: 9:30 PM          [Refresh]   │
├────────────┬───────────────────────────────────────────────────────────┤
│            │                                                           │
│  Dashboard │   ┌─────────────────────────────────────────────────┐    │
│  Treasury  │   │         OVERALL RISK SCORE                      │    │
│  Portfolio │   │              65/100                              │    │
│  Compliance│   │         ████████████░░░░░░░░                    │    │
│  Market    │   │              WARNING                             │    │
│            │   └─────────────────────────────────────────────────┘    │
│            │                                                           │
│            │   ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│            │   │ Treasury │  │ Portfolio│  │Compliance│              │
│            │   │   45     │  │   72     │  │   85     │              │
│            │   │   OK     │  │ WARNING  │  │ CRITICAL │              │
│            │   └──────────┘  └──────────┘  └──────────┘              │
│  ┌───────┐ │                                                           │
│  │ Run   │ │   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐              │
│  │  AI   │ │   │   3   │ │   5   │ │   2   │ │  35%  │              │
│  │Analysis│ │   │Critical│ │Alerts │ │Pending│ │Health │              │
│  └───────┘ │   └───────┘ └───────┘ └───────┘ └───────┘              │
│            │                                                           │
└────────────┴───────────────────────────────────────────────────────────┘
```

## Features

### Real-Time Dashboard
- **Overall Risk Score** - Aggregated risk across all domains (0-100)
- **Status Indicators** - Visual OK/WARNING/CRITICAL states
- **Auto-refresh** - Updates every 30 seconds
- **Last Updated Timestamp** - Know when data was refreshed

### Treasury Management
- Cash positions by account, bank, currency, region
- Debt instruments with covenant status tracking
- FX exposures and hedge ratios
- Net position calculation

### Portfolio Analytics
- Holdings table with P&L tracking
- Total AUM and YTD returns
- VaR (Value at Risk) metrics
- Sharpe ratio and alpha generation
- Asset class breakdown

### Compliance Monitoring
- AML (Anti-Money Laundering) alerts dashboard
- Sanctions match detection with priority levels
- KYC compliance rate tracking
- Clients pending review count
- Audit event monitoring

### Market Intelligence
- News feed with sentiment analysis
- Overall market sentiment indicator
- Sentiment scores per news item
- Source attribution

### AI Integration
- One-click "Run AI Analysis" button
- Triggers Kestra workflow orchestration
- Real-time status updates
- Powered by Llama 3.2 LLM

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 4** | Styling |
| **Recharts** | Data visualization |
| **Lucide React** | Icons |
| **Axios** | HTTP client |

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend running on http://localhost:8000

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access
- **Development**: http://localhost:5173
- **Alternative ports**: 5174, 5175 (if 5173 is busy)

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx              # Main dashboard component
│   ├── main.tsx             # React entry point
│   ├── index.css            # Tailwind + custom styles
│   └── services/
│       └── api.ts           # API client & TypeScript types
├── public/
│   └── vite.svg             # Favicon
├── index.html               # HTML template
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## API Integration

The dashboard connects to the FastAPI backend:

```typescript
// API Base URL
const API_BASE_URL = 'http://localhost:8000';

// Endpoints used
GET /data/dashboard    // Aggregated summary
GET /data/treasury     // Treasury data
GET /data/portfolio    // Portfolio data
GET /data/compliance   // Compliance data
GET /data/market       // Market intelligence
POST /workflows/trigger // Trigger AI analysis
```

## Component Architecture

### Main App Component
```
App.tsx
├── Sidebar Navigation
│   ├── Logo & Branding
│   ├── Nav Items (Dashboard, Treasury, Portfolio, Compliance, Market)
│   └── AI Analysis Button
├── Header
│   ├── Page Title
│   ├── Last Updated Time
│   └── Status Badge
└── Content Area
    ├── Error State (connection issues)
    ├── Loading State (spinner)
    ├── Dashboard View (risk cards, stats)
    ├── Treasury View (cash, debt tables)
    ├── Portfolio View (holdings, metrics)
    ├── Compliance View (AML alerts)
    └── Market View (news feed)
```

## Styling

### Color Scheme (Dark Theme)
- **Background**: Slate 900 (#0f172a)
- **Cards**: Slate 800 (#1e293b)
- **Text Primary**: White (#f8fafc)
- **Text Secondary**: Slate 400 (#94a3b8)
- **Accent Blue**: Blue 600 (#2563eb)

### Status Colors
- **OK**: Green (#22c55e)
- **WARNING**: Yellow (#eab308)
- **CRITICAL**: Red (#ef4444)

### Custom CSS Classes
```css
.card           /* Dark card container */
.btn-primary    /* Blue action button */
.btn-secondary  /* Gray secondary button */
.nav-item       /* Navigation item */
.badge          /* Status badge */
.animate-fade-in /* Fade in animation */
.animate-glow   /* Pulsing glow effect */
```

## Development

### Available Scripts

```bash
# Development server with HMR
npm run dev

# Type checking
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```


### Adding New Features

1. **New View**: Add to `navItems` array and create corresponding render section
2. **New API**: Add types and fetch function in `services/api.ts`
3. **New Component**: Create in `src/components/` (recommended for larger apps)

## Error Handling

The dashboard handles errors gracefully:

- **Backend Offline**: Shows connection error with instructions
- **API Errors**: Displays error message with retry button
- **Loading States**: Shows spinner during data fetch

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- **Hot Module Replacement**: Instant updates during development
- **Code Splitting**: Automatic with Vite
- **Optimized Dependencies**: Pre-bundled with esbuild

---

**Built with React + TypeScript + Tailwind for AssembleHack25**
