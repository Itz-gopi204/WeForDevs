import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface DashboardSummary {
  timestamp: string;
  overall_status: 'OK' | 'WARNING' | 'CRITICAL';
  overall_risk_score: number;
  treasury_status: 'OK' | 'WARNING' | 'CRITICAL';
  treasury_risk_score: number;
  portfolio_status: 'OK' | 'WARNING' | 'CRITICAL';
  portfolio_risk_score: number;
  compliance_status: 'OK' | 'WARNING' | 'CRITICAL';
  compliance_risk_score: number;
  critical_items: number;
  active_alerts: number;
  actions_pending: number;
}

export interface CashPosition {
  account_name: string;
  currency: string;
  balance: number;
  available_balance: number;
  bank: string;
  region: string;
}

export interface DebtInstrument {
  debt_id: string;
  instrument_type: string;
  principal: number;
  currency: string;
  interest_rate: number;
  maturity_date: string;
  covenant_status: 'COMPLIANT' | 'WARNING' | 'BREACH';
}

export interface TreasuryData {
  date: string;
  cash_positions: CashPosition[];
  total_cash_usd: number;
  debt_instruments: DebtInstrument[];
  total_debt: number;
  net_position: number;
  fx_exposures: Record<string, {
    net_position: number;
    hedged_amount: number;
    unhedged_exposure: number;
    hedge_ratio: number;
  }>;
  covenant_breaches: number;
  covenant_warnings: number;
}

export interface Holding {
  ticker: string;
  name: string;
  asset_class: string;
  quantity: number;
  current_price: number;
  market_value: number;
  weight_pct: number;
  unrealized_pnl: number;
}

export interface PortfolioData {
  date: string;
  holdings: Holding[];
  total_aum: number;
  var_95_1d: number;
  var_99_1d: number;
  sharpe_ratio: number;
  max_drawdown: number;
  risk_score: number;
  ytd_return: number;
  benchmark_return: number;
  alpha: number;
}

export interface AMLAlert {
  alert_id: string;
  type: string;
  risk_score: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  entity_name: string;
  amount: number;
  currency: string;
}

export interface ComplianceData {
  date: string;
  aml_alerts: AMLAlert[];
  total_alerts: number;
  high_priority_count: number;
  sanctions_matches: number;
  kyc_compliance_rate: number;
  clients_pending_review: number;
  critical_audit_events: number;
}

export interface NewsItem {
  headline: string;
  source: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  sentiment_score: number;
  impact: string;
}

export interface MarketData {
  date: string;
  news_items: NewsItem[];
  overall_sentiment: string;
  sp500_level: number;
  sp500_change_pct: number;
  vix: number;
  fed_funds_rate: number;
  treasury_10y: number;
}

export interface WorkflowTriggerResponse {
  execution_id: string;
  status: string;
  message: string;
  timestamp: string;
}

export interface HealthCheck {
  status: string;
  api_version: string;
  kestra_status: string;
  ollama_status: string;
  database_status: string;
  timestamp: string;
}

// API Functions
export const fetchDashboard = async (): Promise<DashboardSummary> => {
  const response = await api.get('/data/dashboard');
  return response.data;
};

export const fetchTreasury = async (): Promise<TreasuryData> => {
  const response = await api.get('/data/treasury');
  return response.data;
};

export const fetchPortfolio = async (): Promise<PortfolioData> => {
  const response = await api.get('/data/portfolio');
  return response.data;
};

export const fetchCompliance = async (): Promise<ComplianceData> => {
  const response = await api.get('/data/compliance');
  return response.data;
};

export const fetchMarket = async (): Promise<MarketData> => {
  const response = await api.get('/data/market');
  return response.data;
};

export const fetchHealth = async (): Promise<HealthCheck> => {
  const response = await api.get('/health');
  return response.data;
};

export const triggerWorkflow = async (
  runMode: string = 'full',
  riskThreshold: number = 70,
  sendNotifications: boolean = true
): Promise<WorkflowTriggerResponse> => {
  const response = await api.post('/workflows/trigger', {
    run_mode: runMode,
    risk_threshold: riskThreshold,
    send_notifications: sendNotifications,
  });
  return response.data;
};

export default api;
