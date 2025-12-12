from fastapi import APIRouter
from ..models.schemas import (
    TreasuryData,
    PortfolioData,
    ComplianceData,
    MarketData,
    DashboardSummary,
)
from ..services.data_loader import data_loader_service

router = APIRouter(prefix="/data", tags=["Data"])


@router.get("/dashboard", response_model=DashboardSummary)
async def get_dashboard():
    """
    Get consolidated dashboard summary.

    Returns overall risk scores, status indicators, and key metrics
    across all financial domains (Treasury, Portfolio, Compliance).
    """
    return data_loader_service.get_dashboard_summary()


@router.get("/treasury", response_model=TreasuryData)
async def get_treasury_data():
    """
    Get treasury data including cash positions, debt schedule, and FX exposures.

    Returns:
    - Cash positions across all accounts
    - Debt instruments and covenant status
    - FX exposures and hedge ratios
    - Net position calculations
    """
    return data_loader_service.get_treasury_data()


@router.get("/portfolio", response_model=PortfolioData)
async def get_portfolio_data():
    """
    Get portfolio data including holdings, risk metrics, and performance.

    Returns:
    - Current holdings with market values
    - VaR metrics (95% and 99% confidence)
    - YTD performance vs benchmark
    - Risk score and Sharpe ratio
    """
    return data_loader_service.get_portfolio_data()


@router.get("/compliance", response_model=ComplianceData)
async def get_compliance_data():
    """
    Get compliance data including AML alerts, KYC status, and audit events.

    Returns:
    - Active AML alerts with priority levels
    - Sanctions match indicators
    - KYC compliance rate
    - Critical audit events
    """
    return data_loader_service.get_compliance_data()


@router.get("/market", response_model=MarketData)
async def get_market_data():
    """
    Get market data including news feed and economic indicators.

    Returns:
    - Recent market news with sentiment analysis
    - Key indices (S&P 500, VIX)
    - Interest rates (Fed funds, 10Y Treasury)
    - Overall market sentiment
    """
    return data_loader_service.get_market_data()
