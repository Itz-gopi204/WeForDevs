import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Shield,
  Newspaper,
  Play,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Bell,
  Zap,
  Brain,
} from 'lucide-react';
import {
  fetchDashboard,
  fetchTreasury,
  fetchPortfolio,
  fetchCompliance,
  fetchMarket,
  triggerWorkflow,
} from './services/api';
import type {
  DashboardSummary,
  TreasuryData,
  PortfolioData,
  ComplianceData,
  MarketData,
} from './services/api';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

type TabType = 'dashboard' | 'treasury' | 'portfolio' | 'compliance' | 'market';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [treasury, setTreasury] = useState<TreasuryData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [compliance, setCompliance] = useState<ComplianceData | null>(null);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashData, treasuryData, portfolioData, complianceData, marketData] = await Promise.all([
        fetchDashboard(),
        fetchTreasury(),
        fetchPortfolio(),
        fetchCompliance(),
        fetchMarket(),
      ]);
      setDashboard(dashData);
      setTreasury(treasuryData);
      setPortfolio(portfolioData);
      setCompliance(complianceData);
      setMarket(marketData);
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to connect to backend. Make sure the backend is running on http://localhost:8000');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRunAI = async () => {
    setWorkflowRunning(true);
    try {
      const result = await triggerWorkflow('full', 70, true);
      alert(`AI Analysis Started!\n\nExecution ID: ${result.execution_id}\nStatus: ${result.status}\n\n${result.message}`);
    } catch (error) {
      alert('Failed to trigger AI workflow. Please check if backend is running.');
    }
    setWorkflowRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'text-red-400';
      case 'WARNING': return 'text-yellow-400';
      case 'OK': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-500/20 border-red-500/30';
      case 'WARNING': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'OK': return 'bg-green-500/20 border-green-500/30';
      default: return 'bg-slate-500/20 border-slate-500/30';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#ef4444';
    if (score >= 60) return '#eab308';
    return '#22c55e';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'treasury', label: 'Treasury', icon: Wallet },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'market', label: 'Market Intel', icon: Newspaper },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800/50 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Finance AI</h1>
              <p className="text-xs text-slate-400">Orchestrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`nav-item w-full ${activeTab === item.id ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* AI Trigger Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleRunAI}
            disabled={workflowRunning}
            className={`w-full btn-primary justify-center ${workflowRunning ? 'opacity-50 cursor-not-allowed' : 'animate-glow'}`}
          >
            {workflowRunning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Running AI...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Run AI Analysis
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Powered by Llama 3.2 + Kestra
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-slate-800/30 border-b border-slate-700 px-6 py-4 sticky top-0 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white capitalize">{activeTab}</h2>
              <p className="text-sm text-slate-400">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadData}
                className="btn-secondary"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {dashboard && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusBg(dashboard.overall_status)}`}>
                  {dashboard.overall_status === 'CRITICAL' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                  {dashboard.overall_status === 'WARNING' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                  {dashboard.overall_status === 'OK' && <CheckCircle className="w-5 h-5 text-green-400" />}
                  <span className={`font-medium ${getStatusColor(dashboard.overall_status)}`}>
                    {dashboard.overall_status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Error State */}
          {error && (
            <div className="card p-8 border border-red-500/30 bg-red-500/10 animate-fade-in">
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Connection Error</h3>
                <p className="text-slate-300 mb-4 max-w-md">{error}</p>
                <div className="bg-slate-800 rounded-lg p-4 text-left mb-6 w-full max-w-lg">
                  <p className="text-sm text-slate-400 mb-2">To start the backend, run:</p>
                  <code className="text-green-400 font-mono text-sm">cd backend && docker-compose up -d</code>
                </div>
                <button onClick={loadData} className="btn-primary">
                  <RefreshCw className="w-4 h-4" />
                  Retry Connection
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {!error && loading && !dashboard ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : !error && (
            <>
              {/* Dashboard View */}
              {activeTab === 'dashboard' && dashboard && (
                <div className="space-y-6 animate-fade-in">
                  {/* Overall Risk Score */}
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-slate-300">Overall Risk Score</h3>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-5xl font-bold" style={{ color: getRiskColor(dashboard.overall_risk_score) }}>
                            {dashboard.overall_risk_score}
                          </span>
                          <span className="text-slate-400">/100</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getStatusColor(dashboard.overall_status)}`}>
                          {dashboard.overall_status}
                        </div>
                        <p className="text-slate-400 text-sm mt-1">
                          {dashboard.critical_items} critical items
                        </p>
                      </div>
                    </div>
                    {/* Risk Bar */}
                    <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${dashboard.overall_risk_score}%`,
                          backgroundColor: getRiskColor(dashboard.overall_risk_score),
                        }}
                      />
                    </div>
                  </div>

                  {/* Risk Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Treasury Card */}
                    <div className={`card p-6 border ${getStatusBg(dashboard.treasury_status)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-blue-400" />
                          </div>
                          <h3 className="font-medium text-white">Treasury</h3>
                        </div>
                        <span className={`text-2xl font-bold ${getStatusColor(dashboard.treasury_status)}`}>
                          {dashboard.treasury_risk_score}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${dashboard.treasury_risk_score}%`,
                            backgroundColor: getRiskColor(dashboard.treasury_risk_score),
                          }}
                        />
                      </div>
                      <p className={`mt-3 text-sm ${getStatusColor(dashboard.treasury_status)}`}>
                        {dashboard.treasury_status}
                      </p>
                    </div>

                    {/* Portfolio Card */}
                    <div className={`card p-6 border ${getStatusBg(dashboard.portfolio_status)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-purple-400" />
                          </div>
                          <h3 className="font-medium text-white">Portfolio</h3>
                        </div>
                        <span className={`text-2xl font-bold ${getStatusColor(dashboard.portfolio_status)}`}>
                          {dashboard.portfolio_risk_score}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${dashboard.portfolio_risk_score}%`,
                            backgroundColor: getRiskColor(dashboard.portfolio_risk_score),
                          }}
                        />
                      </div>
                      <p className={`mt-3 text-sm ${getStatusColor(dashboard.portfolio_status)}`}>
                        {dashboard.portfolio_status}
                      </p>
                    </div>

                    {/* Compliance Card */}
                    <div className={`card p-6 border ${getStatusBg(dashboard.compliance_status)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-400" />
                          </div>
                          <h3 className="font-medium text-white">Compliance</h3>
                        </div>
                        <span className={`text-2xl font-bold ${getStatusColor(dashboard.compliance_status)}`}>
                          {dashboard.compliance_risk_score}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${dashboard.compliance_risk_score}%`,
                            backgroundColor: getRiskColor(dashboard.compliance_risk_score),
                          }}
                        />
                      </div>
                      <p className={`mt-3 text-sm ${getStatusColor(dashboard.compliance_status)}`}>
                        {dashboard.compliance_status}
                      </p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{dashboard.critical_items}</p>
                          <p className="text-sm text-slate-400">Critical Items</p>
                        </div>
                      </div>
                    </div>
                    <div className="card p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Bell className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{dashboard.active_alerts}</p>
                          <p className="text-sm text-slate-400">Active Alerts</p>
                        </div>
                      </div>
                    </div>
                    <div className="card p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{dashboard.actions_pending}</p>
                          <p className="text-sm text-slate-400">Actions Pending</p>
                        </div>
                      </div>
                    </div>
                    <div className="card p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {100 - dashboard.overall_risk_score}%
                          </p>
                          <p className="text-sm text-slate-400">Health Score</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Treasury View */}
              {activeTab === 'treasury' && treasury && (
                <div className="space-y-6 animate-fade-in">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">Total Cash (USD)</p>
                      <p className="text-2xl font-bold text-green-400">{formatCurrency(treasury.total_cash_usd)}</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">Total Debt</p>
                      <p className="text-2xl font-bold text-red-400">{formatCurrency(treasury.total_debt)}</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">Net Position</p>
                      <p className={`text-2xl font-bold ${treasury.net_position >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(treasury.net_position)}
                      </p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">Covenant Issues</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {treasury.covenant_breaches + treasury.covenant_warnings}
                      </p>
                    </div>
                  </div>

                  {/* Cash Positions Table */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="font-medium text-white">Cash Positions</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-700/50">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Account</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Bank</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Currency</th>
                            <th className="text-right py-3 px-4 text-xs uppercase text-slate-400">Balance</th>
                            <th className="text-right py-3 px-4 text-xs uppercase text-slate-400">Available</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Region</th>
                          </tr>
                        </thead>
                        <tbody>
                          {treasury.cash_positions.map((pos, idx) => (
                            <tr key={idx} className="border-t border-slate-700 hover:bg-slate-700/30">
                              <td className="py-3 px-4 text-white">{pos.account_name}</td>
                              <td className="py-3 px-4 text-slate-300">{pos.bank}</td>
                              <td className="py-3 px-4">
                                <span className="badge bg-blue-500/20 text-blue-400">{pos.currency}</span>
                              </td>
                              <td className="py-3 px-4 text-right text-white font-mono">
                                {formatNumber(pos.balance, 0)}
                              </td>
                              <td className="py-3 px-4 text-right text-slate-300 font-mono">
                                {formatNumber(pos.available_balance, 0)}
                              </td>
                              <td className="py-3 px-4 text-slate-400">{pos.region}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Debt Instruments Table */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="font-medium text-white">Debt Instruments</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-700/50">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">ID</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Type</th>
                            <th className="text-right py-3 px-4 text-xs uppercase text-slate-400">Principal</th>
                            <th className="text-right py-3 px-4 text-xs uppercase text-slate-400">Rate</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Maturity</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {treasury.debt_instruments.map((debt, idx) => (
                            <tr key={idx} className="border-t border-slate-700 hover:bg-slate-700/30">
                              <td className="py-3 px-4 text-white font-mono">{debt.debt_id}</td>
                              <td className="py-3 px-4 text-slate-300">{debt.instrument_type}</td>
                              <td className="py-3 px-4 text-right text-white font-mono">
                                {formatCurrency(debt.principal)}
                              </td>
                              <td className="py-3 px-4 text-right text-slate-300">{debt.interest_rate}%</td>
                              <td className="py-3 px-4 text-slate-400">{debt.maturity_date}</td>
                              <td className="py-3 px-4">
                                <span className={`badge ${
                                  debt.covenant_status === 'BREACH' ? 'bg-red-500/20 text-red-400' :
                                  debt.covenant_status === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {debt.covenant_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio View */}
              {activeTab === 'portfolio' && portfolio && (
                <div className="space-y-6 animate-fade-in">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">Total AUM</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(portfolio.total_aum)}</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">YTD Return</p>
                      <p className={`text-2xl font-bold flex items-center gap-1 ${portfolio.ytd_return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {portfolio.ytd_return >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {portfolio.ytd_return}%
                      </p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">Alpha</p>
                      <p className={`text-2xl font-bold ${portfolio.alpha >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {portfolio.alpha > 0 ? '+' : ''}{portfolio.alpha}%
                      </p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">Sharpe Ratio</p>
                      <p className="text-2xl font-bold text-blue-400">{portfolio.sharpe_ratio}</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">VaR (95%, 1D)</p>
                      <p className="text-2xl font-bold text-yellow-400">{formatCurrency(portfolio.var_95_1d)}</p>
                    </div>
                  </div>

                  {/* Holdings Table */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="font-medium text-white">Holdings</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-700/50">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Ticker</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Name</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Class</th>
                            <th className="text-right py-3 px-4 text-xs uppercase text-slate-400">Quantity</th>
                            <th className="text-right py-3 px-4 text-xs uppercase text-slate-400">Price</th>
                            <th className="text-right py-3 px-4 text-xs uppercase text-slate-400">Market Value</th>
                            <th className="text-right py-3 px-4 text-xs uppercase text-slate-400">P&L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.holdings.map((holding, idx) => (
                            <tr key={idx} className="border-t border-slate-700 hover:bg-slate-700/30">
                              <td className="py-3 px-4 text-white font-bold">{holding.ticker}</td>
                              <td className="py-3 px-4 text-slate-300">{holding.name}</td>
                              <td className="py-3 px-4">
                                <span className={`badge ${
                                  holding.asset_class === 'Equity' ? 'bg-blue-500/20 text-blue-400' :
                                  holding.asset_class === 'Fixed Income' ? 'bg-purple-500/20 text-purple-400' :
                                  holding.asset_class === 'Commodities' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {holding.asset_class}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-slate-300 font-mono">
                                {formatNumber(holding.quantity, 0)}
                              </td>
                              <td className="py-3 px-4 text-right text-white font-mono">
                                ${formatNumber(holding.current_price)}
                              </td>
                              <td className="py-3 px-4 text-right text-white font-mono">
                                {formatCurrency(holding.market_value)}
                              </td>
                              <td className={`py-3 px-4 text-right font-mono ${holding.unrealized_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {holding.unrealized_pnl >= 0 ? '+' : ''}{formatCurrency(holding.unrealized_pnl)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance View */}
              {activeTab === 'compliance' && compliance && (
                <div className="space-y-6 animate-fade-in">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">Total Alerts</p>
                      <p className="text-2xl font-bold text-white">{compliance.total_alerts}</p>
                    </div>
                    <div className="card p-4 border border-red-500/30">
                      <p className="text-sm text-slate-400">High Priority</p>
                      <p className="text-2xl font-bold text-red-400">{compliance.high_priority_count}</p>
                    </div>
                    <div className="card p-4 border border-red-500/30">
                      <p className="text-sm text-slate-400">Sanctions Matches</p>
                      <p className="text-2xl font-bold text-red-400">{compliance.sanctions_matches}</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">KYC Compliance</p>
                      <p className="text-2xl font-bold text-green-400">{formatNumber(compliance.kyc_compliance_rate)}%</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-slate-400">Pending Review</p>
                      <p className="text-2xl font-bold text-yellow-400">{compliance.clients_pending_review}</p>
                    </div>
                  </div>

                  {/* AML Alerts Table */}
                  <div className="card">
                    <div className="card-header flex items-center justify-between">
                      <h3 className="font-medium text-white">AML Alerts</h3>
                      <span className="badge bg-red-500/20 text-red-400">{compliance.aml_alerts.length} Active</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-700/50">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Alert ID</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Type</th>
                            <th className="text-center py-3 px-4 text-xs uppercase text-slate-400">Risk</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Priority</th>
                            <th className="text-right py-3 px-4 text-xs uppercase text-slate-400">Amount</th>
                            <th className="text-left py-3 px-4 text-xs uppercase text-slate-400">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {compliance.aml_alerts.map((alert, idx) => (
                            <tr key={idx} className={`border-t border-slate-700 hover:bg-slate-700/30 ${
                              alert.type === 'SANCTIONS_MATCH' ? 'bg-red-500/10' : ''
                            }`}>
                              <td className="py-3 px-4 text-white font-mono">{alert.alert_id}</td>
                              <td className="py-3 px-4 text-slate-300">
                                {alert.type === 'SANCTIONS_MATCH' && (
                                  <span className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                    {alert.type.replace(/_/g, ' ')}
                                  </span>
                                )}
                                {alert.type !== 'SANCTIONS_MATCH' && alert.type.replace(/_/g, ' ')}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`font-bold ${
                                  alert.risk_score >= 80 ? 'text-red-400' :
                                  alert.risk_score >= 60 ? 'text-yellow-400' :
                                  'text-green-400'
                                }`}>
                                  {alert.risk_score}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`badge ${
                                  alert.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                  alert.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {alert.priority}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-white font-mono">
                                {alert.currency === 'EUR' ? '€' : '$'}{formatNumber(alert.amount, 0)}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`badge ${
                                  alert.status === 'PENDING_REVIEW' ? 'bg-yellow-500/20 text-yellow-400' :
                                  alert.status === 'UNDER_INVESTIGATION' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {alert.status.replace(/_/g, ' ')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Market View */}
              {activeTab === 'market' && market && (
                <div className="space-y-6 animate-fade-in">
                  {/* Sentiment Overview */}
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-slate-300">Market Sentiment</h3>
                        <p className={`text-2xl font-bold mt-2 ${
                          market.overall_sentiment.includes('POSITIVE') ? 'text-green-400' :
                          market.overall_sentiment.includes('NEGATIVE') ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {market.overall_sentiment.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">{market.news_items.length} news items analyzed</p>
                      </div>
                    </div>
                  </div>

                  {/* News Feed */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="font-medium text-white">Market News Feed</h3>
                    </div>
                    <div className="divide-y divide-slate-700">
                      {market.news_items.map((item, idx) => (
                        <div key={idx} className="p-4 hover:bg-slate-700/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{item.headline}</h4>
                              <p className="text-sm text-slate-400 mt-1">{item.source}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`badge ${
                                item.sentiment === 'POSITIVE' ? 'bg-green-500/20 text-green-400' :
                                item.sentiment === 'NEGATIVE' ? 'bg-red-500/20 text-red-400' :
                                item.sentiment === 'MIXED' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-slate-500/20 text-slate-400'
                              }`}>
                                {item.sentiment}
                              </span>
                              <span className={`text-sm font-mono ${
                                item.sentiment_score > 0 ? 'text-green-400' :
                                item.sentiment_score < 0 ? 'text-red-400' :
                                'text-slate-400'
                              }`}>
                                {item.sentiment_score > 0 ? '+' : ''}{formatNumber(item.sentiment_score)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
