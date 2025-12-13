import httpx
from typing import Optional, Dict, Any
from datetime import datetime
from config import settings
from models.schemas import (
    WorkflowTriggerResponse,
    ExecutionStatus,
    ExecutionState,
)


class KestraService:
    def __init__(self):
        self.base_url = settings.kestra_host
        self.namespace = settings.kestra_namespace
        self.flow_id = settings.kestra_flow_id
        self.webhook_key = "finance-orchestrator-trigger"

    async def trigger_workflow(
        self,
        run_mode: str = "full",
        risk_threshold: int = 70,
        send_notifications: bool = True,
    ) -> WorkflowTriggerResponse:
        """Trigger the main orchestrator workflow via webhook."""
        # Use webhook endpoint which doesn't require authentication
        url = f"{self.base_url}/api/v1/executions/webhook/{self.namespace}/{self.flow_id}/{self.webhook_key}"

        payload = {
            "run_mode": run_mode,
            "risk_threshold": risk_threshold,
            "send_notifications": str(send_notifications).lower(),
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()

                return WorkflowTriggerResponse(
                    execution_id=data.get("id", ""),
                    status="TRIGGERED",
                    message=f"Workflow {self.flow_id} triggered successfully",
                    timestamp=datetime.utcnow(),
                )
            except httpx.HTTPStatusError as e:
                return WorkflowTriggerResponse(
                    execution_id="",
                    status="FAILED",
                    message=f"Failed to trigger workflow: {str(e)}",
                    timestamp=datetime.utcnow(),
                )
            except Exception as e:
                return WorkflowTriggerResponse(
                    execution_id="",
                    status="ERROR",
                    message=f"Error: {str(e)}",
                    timestamp=datetime.utcnow(),
                )

    async def get_execution_status(self, execution_id: str) -> Optional[ExecutionStatus]:
        """Get the status of a specific execution."""
        url = f"{self.base_url}/api/v1/executions/{execution_id}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()

                state_map = {
                    "CREATED": ExecutionState.CREATED,
                    "RUNNING": ExecutionState.RUNNING,
                    "SUCCESS": ExecutionState.SUCCESS,
                    "FAILED": ExecutionState.FAILED,
                    "KILLED": ExecutionState.KILLED,
                }

                return ExecutionStatus(
                    execution_id=data.get("id", ""),
                    flow_id=data.get("flowId", ""),
                    namespace=data.get("namespace", ""),
                    state=state_map.get(data.get("state", ""), ExecutionState.CREATED),
                    start_date=data.get("startDate"),
                    end_date=data.get("endDate"),
                    duration_ms=data.get("duration"),
                    outputs=data.get("outputs"),
                )
            except Exception:
                return None

    async def list_executions(
        self, limit: int = 10, state: Optional[str] = None
    ) -> list[Dict[str, Any]]:
        """List recent executions."""
        url = f"{self.base_url}/api/v1/executions"
        params = {
            "namespace": self.namespace,
            "flowId": self.flow_id,
            "size": limit,
        }
        if state:
            params["state"] = state

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                return data.get("results", [])
            except Exception:
                return []

    async def get_execution_logs(self, execution_id: str) -> list[Dict[str, Any]]:
        """Get logs for a specific execution."""
        url = f"{self.base_url}/api/v1/logs/{execution_id}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                return response.json()
            except Exception:
                return []

    async def check_health(self) -> Dict[str, Any]:
        """Check Kestra health status."""
        url = f"{self.base_url}/api/v1/plugins"

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(url)
                return {
                    "status": "healthy" if response.status_code == 200 else "unhealthy",
                    "code": response.status_code,
                }
            except Exception as e:
                return {"status": "unreachable", "error": str(e)}


kestra_service = KestraService()
