from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class RunMode(str, Enum):
    FULL = "full"
    TREASURY_ONLY = "treasury_only"
    PORTFOLIO_ONLY = "portfolio_only"
    COMPLIANCE_ONLY = "compliance_only"


class StatusLevel(str, Enum):
    OK = "OK"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class ExecutionState(str, Enum):
    CREATED = "CREATED"
    RUNNING = "RUNNING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    KILLED = "KILLED"


# Request/Response Models
class WorkflowTriggerRequest(BaseModel):
    run_mode: RunMode = RunMode.FULL
    risk_threshold: int = Field(default=70, ge=0, le=100)
    send_notifications: bool = True


class WorkflowTriggerResponse(BaseModel):
    execution_id: str
    status: str
    message: str
    timestamp: datetime


class ExecutionStatus(BaseModel):
    execution_id: str
    flow_id: str
    namespace: str
    state: ExecutionState
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_ms: Optional[int] = None
    outputs: Optional[Dict[str, Any]] = None


# Agent Result Models
class AgentAlert(BaseModel):
    type: str
    active: bool = True
    count: Optional[int] = None
    message: Optional[str] = None


class AgentResult(BaseModel):
    agent: str
    risk_score: int
    status: StatusLevel
    metrics: Dict[str, Any]
    ai_summary: str
    alerts: List[AgentAlert]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# Data Models
class CashPosition(BaseModel):
    account_name: str
    currency: str
    balance: float
    available_balance: float
    bank: str
    region: str


class DebtInstrument(BaseModel):
    debt_id: str
    instrument_type: str
    principal: float
    currency: str
    interest_rate: float
    maturity_date: str
    covenant_status: str


class TreasuryData(BaseModel):
    date: str
    cash_positions: List[CashPosition]
    total_cash_usd: float
    debt_instruments: List[DebtInstrument]
    total_debt: float
    net_position: float
    fx_exposures: Dict[str, Any]
    covenant_breaches: int
    covenant_warnings: int


class Holding(BaseModel):
    ticker: str
    name: str
    asset_class: str
    quantity: float
    current_price: float
    market_value: float
    weight_pct: float
    unrealized_pnl: float


class PortfolioData(BaseModel):
    date: str
    holdings: List[Holding]
    total_aum: float
    var_95_1d: float
    var_99_1d: float
    sharpe_ratio: float
    max_drawdown: float
    risk_score: int
    ytd_return: float
    benchmark_return: float
    alpha: float


class AMLAlert(BaseModel):
    alert_id: str
    type: str
    risk_score: int
    priority: str
    status: str
    entity_name: str
    amount: float
    currency: str


class ComplianceData(BaseModel):
    date: str
    aml_alerts: List[AMLAlert]
    total_alerts: int
    high_priority_count: int
    sanctions_matches: int
    kyc_compliance_rate: float
    clients_pending_review: int
    critical_audit_events: int


class NewsItem(BaseModel):
    headline: str
    source: str
    sentiment: str
    sentiment_score: float
    impact: str


class MarketData(BaseModel):
    date: str
    news_items: List[NewsItem]
    overall_sentiment: str
    sp500_level: float
    sp500_change_pct: float
    vix: float
    fed_funds_rate: float
    treasury_10y: float


class DashboardSummary(BaseModel):
    timestamp: datetime
    overall_status: StatusLevel
    overall_risk_score: int
    treasury_status: StatusLevel
    treasury_risk_score: int
    portfolio_status: StatusLevel
    portfolio_risk_score: int
    compliance_status: StatusLevel
    compliance_risk_score: int
    critical_items: int
    active_alerts: int
    actions_pending: int
    last_execution_id: Optional[str] = None
    next_scheduled_run: Optional[datetime] = None


class HealthCheck(BaseModel):
    status: str
    api_version: str
    kestra_status: str
    ollama_status: str
    database_status: str
    timestamp: datetime
