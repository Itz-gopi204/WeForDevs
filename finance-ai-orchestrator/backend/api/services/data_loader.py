import json
import pandas as pd
from pathlib import Path
from typing import Dict, Any, List
from datetime import datetime
from ..config import settings
from ..models.schemas import (
    TreasuryData,
    PortfolioData,
    ComplianceData,
    MarketData,
    CashPosition,
    DebtInstrument,
    Holding,
    AMLAlert,
    NewsItem,
    DashboardSummary,
    StatusLevel,
)


class DataLoaderService:
    def __init__(self):
        self.data_path = Path(settings.data_base_path)

    def _read_json(self, filepath: Path) -> Dict[str, Any]:
        """Read JSON file and return dict."""
        try:
            with open(filepath, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
            return {}

    def _read_csv(self, filepath: Path) -> pd.DataFrame:
        """Read CSV file and return DataFrame."""
        try:
            return pd.read_csv(filepath)
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
            return pd.DataFrame()

    def get_treasury_data(self) -> TreasuryData:
        """Load and aggregate treasury data."""
        cash_df = self._read_csv(self.data_path / "treasury" / "cash_positions.csv")
        debt_df = self._read_csv(self.data_path / "treasury" / "debt_schedule.csv")
        fx_data = self._read_json(self.data_path / "treasury" / "fx_rates.json")

        # Get latest date
        latest_date = cash_df["date"].max() if not cash_df.empty else datetime.now().strftime("%Y-%m-%d")
        latest_cash = cash_df[cash_df["date"] == latest_date] if not cash_df.empty else pd.DataFrame()

        # FX rates for conversion to USD
        fx_rates = {"USD": 1, "EUR": 1.08, "GBP": 1.27, "JPY": 0.0067, "CHF": 1.14, "CAD": 0.74}

        # Build cash positions
        cash_positions = []
        total_cash_usd = 0
        for _, row in latest_cash.iterrows():
            position = CashPosition(
                account_name=row.get("account_name", ""),
                currency=row.get("currency", "USD"),
                balance=float(row.get("balance", 0)),
                available_balance=float(row.get("available_balance", 0)),
                bank=row.get("bank", ""),
                region=row.get("region", ""),
            )
            cash_positions.append(position)
            total_cash_usd += position.balance * fx_rates.get(position.currency, 1)

        # Build debt instruments
        debt_instruments = []
        total_debt = 0
        covenant_breaches = 0
        covenant_warnings = 0
        for _, row in debt_df.iterrows():
            instrument = DebtInstrument(
                debt_id=str(row.get("debt_id", "")),
                instrument_type=row.get("instrument_type", ""),
                principal=float(row.get("principal", 0)),
                currency=row.get("currency", "USD"),
                interest_rate=float(row.get("interest_rate", 0)),
                maturity_date=str(row.get("maturity_date", "")),
                covenant_status=row.get("covenant_status", "COMPLIANT"),
            )
            debt_instruments.append(instrument)
            total_debt += instrument.principal * fx_rates.get(instrument.currency, 1)

            if instrument.covenant_status == "BREACH":
                covenant_breaches += 1
            elif instrument.covenant_status == "WARNING":
                covenant_warnings += 1

        return TreasuryData(
            date=latest_date,
            cash_positions=cash_positions,
            total_cash_usd=total_cash_usd,
            debt_instruments=debt_instruments,
            total_debt=total_debt,
            net_position=total_cash_usd - total_debt,
            fx_exposures=fx_data.get("exposures", {}),
            covenant_breaches=covenant_breaches,
            covenant_warnings=covenant_warnings,
        )

    def get_portfolio_data(self) -> PortfolioData:
        """Load and aggregate portfolio data."""
        holdings_data = self._read_json(self.data_path / "portfolio" / "holdings.json")
        performance_data = self._read_json(self.data_path / "portfolio" / "performance.json")
        var_df = self._read_csv(self.data_path / "portfolio" / "var_metrics.csv")

        # Get latest VAR metrics
        latest_var = var_df.iloc[0] if not var_df.empty else {}

        # Build holdings list
        holdings = []
        for h in holdings_data.get("holdings", []):
            holding = Holding(
                ticker=h.get("ticker", ""),
                name=h.get("name", ""),
                asset_class=h.get("asset_class", ""),
                quantity=float(h.get("quantity", 0)),
                current_price=float(h.get("current_price", 0)),
                market_value=float(h.get("market_value", 0)),
                weight_pct=float(h.get("weight_pct", 0)),
                unrealized_pnl=float(h.get("unrealized_pnl", 0)),
            )
            holdings.append(holding)

        # Extract performance metrics
        ytd = performance_data.get("performance", {}).get("ytd", {})
        date = var_df["date"].iloc[0] if not var_df.empty else datetime.now().strftime("%Y-%m-%d")

        return PortfolioData(
            date=date,
            holdings=holdings,
            total_aum=float(holdings_data.get("total_aum", 0)),
            var_95_1d=float(latest_var.get("var_95_1d", 0)) if latest_var else 0,
            var_99_1d=float(latest_var.get("var_99_1d", 0)) if latest_var else 0,
            sharpe_ratio=float(latest_var.get("sharpe_ratio", 0)) if latest_var else 0,
            max_drawdown=float(latest_var.get("max_drawdown", 0)) if latest_var else 0,
            risk_score=int(latest_var.get("risk_score", 50)) if latest_var else 50,
            ytd_return=float(ytd.get("return_pct", 0)),
            benchmark_return=float(ytd.get("benchmark_pct", 0)),
            alpha=float(ytd.get("alpha", 0)),
        )

    def get_compliance_data(self) -> ComplianceData:
        """Load and aggregate compliance data."""
        aml_data = self._read_json(self.data_path / "compliance" / "aml_alerts.json")
        kyc_data = self._read_json(self.data_path / "compliance" / "kyc_status.json")
        audit_df = self._read_csv(self.data_path / "compliance" / "audit_logs.csv")

        # Build AML alerts list
        aml_alerts = []
        sanctions_matches = 0
        for alert in aml_data.get("alerts", []):
            aml_alert = AMLAlert(
                alert_id=alert.get("alert_id", ""),
                type=alert.get("type", ""),
                risk_score=int(alert.get("risk_score", 0)),
                priority=alert.get("priority", "LOW"),
                status=alert.get("status", "PENDING"),
                entity_name=alert.get("entity_name", ""),
                amount=float(alert.get("amount", 0)),
                currency=alert.get("currency", "USD"),
            )
            aml_alerts.append(aml_alert)
            if alert.get("type") == "SANCTIONS_MATCH":
                sanctions_matches += 1

        # Get summary metrics
        aml_summary = aml_data.get("summary", {})
        kyc_summary = kyc_data.get("summary", {})

        # Count critical audit events
        critical_audit = len(audit_df[audit_df["risk_level"] == "CRITICAL"]) if not audit_df.empty else 0

        # Calculate KYC compliance rate
        total_clients = kyc_summary.get("total_clients", 1)
        compliant = kyc_summary.get("fully_compliant", 0)
        compliance_rate = (compliant / max(total_clients, 1)) * 100

        return ComplianceData(
            date=datetime.now().strftime("%Y-%m-%d"),
            aml_alerts=aml_alerts,
            total_alerts=aml_summary.get("total_alerts", len(aml_alerts)),
            high_priority_count=aml_summary.get("high_priority", 0),
            sanctions_matches=sanctions_matches,
            kyc_compliance_rate=compliance_rate,
            clients_pending_review=kyc_summary.get("pending_review", 0),
            critical_audit_events=critical_audit,
        )

    def get_market_data(self) -> MarketData:
        """Load and aggregate market data."""
        news_data = self._read_json(self.data_path / "market" / "news_feed.json")
        indicators = self._read_json(self.data_path / "market" / "economic_indicators.json")

        # Build news items list
        news_items = []
        for item in news_data.get("articles", []):
            news_item = NewsItem(
                headline=item.get("headline", ""),
                source=item.get("source", ""),
                sentiment=item.get("sentiment", "NEUTRAL"),
                sentiment_score=float(item.get("sentiment_score", 0)),
                impact=item.get("market_impact", ""),
            )
            news_items.append(news_item)

        # Get market indices
        indices = indicators.get("indices", {})
        sp500 = indices.get("sp500", {})
        rates = indicators.get("interest_rates", {})

        return MarketData(
            date=datetime.now().strftime("%Y-%m-%d"),
            news_items=news_items,
            overall_sentiment=news_data.get("market_summary", {}).get("overall_sentiment", "NEUTRAL"),
            sp500_level=float(sp500.get("value", 0)),
            sp500_change_pct=float(sp500.get("daily_change_pct", 0)),
            vix=float(indices.get("vix", {}).get("value", 0)),
            fed_funds_rate=float(rates.get("fed_funds", 0)),
            treasury_10y=float(rates.get("treasury_10y", 0)),
        )

    def get_dashboard_summary(self) -> DashboardSummary:
        """Generate a consolidated dashboard summary."""
        treasury = self.get_treasury_data()
        portfolio = self.get_portfolio_data()
        compliance = self.get_compliance_data()

        # Calculate risk scores
        treasury_risk = 50
        if treasury.covenant_breaches > 0:
            treasury_risk += 30
        if treasury.covenant_warnings > 0:
            treasury_risk += 15
        treasury_risk = min(treasury_risk, 100)

        portfolio_risk = portfolio.risk_score

        compliance_risk = 40
        if compliance.sanctions_matches > 0:
            compliance_risk += 40
        compliance_risk += compliance.high_priority_count * 10
        compliance_risk = min(compliance_risk, 100)

        # Overall risk is weighted average
        overall_risk = int((treasury_risk + portfolio_risk + compliance_risk) / 3)

        # Determine statuses
        def get_status(score: int) -> StatusLevel:
            if score >= 80:
                return StatusLevel.CRITICAL
            elif score >= 60:
                return StatusLevel.WARNING
            return StatusLevel.OK

        # Count active items
        critical_items = treasury.covenant_breaches + compliance.sanctions_matches
        active_alerts = compliance.total_alerts
        actions_pending = compliance.high_priority_count + (1 if treasury.covenant_breaches > 0 else 0)

        return DashboardSummary(
            timestamp=datetime.utcnow(),
            overall_status=get_status(overall_risk),
            overall_risk_score=overall_risk,
            treasury_status=get_status(treasury_risk),
            treasury_risk_score=treasury_risk,
            portfolio_status=get_status(portfolio_risk),
            portfolio_risk_score=portfolio_risk,
            compliance_status=get_status(compliance_risk),
            compliance_risk_score=compliance_risk,
            critical_items=critical_items,
            active_alerts=active_alerts,
            actions_pending=actions_pending,
        )


data_loader_service = DataLoaderService()
