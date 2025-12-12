from fastapi import APIRouter, HTTPException
from typing import Optional, List, Dict, Any
from ..models.schemas import (
    WorkflowTriggerRequest,
    WorkflowTriggerResponse,
    ExecutionStatus,
)
from ..services.kestra import kestra_service

router = APIRouter(prefix="/workflows", tags=["Workflows"])


@router.post("/trigger", response_model=WorkflowTriggerResponse)
async def trigger_workflow(request: WorkflowTriggerRequest):
    """
    Trigger the Finance AI Orchestrator workflow.

    - **run_mode**: full, treasury_only, portfolio_only, or compliance_only
    - **risk_threshold**: Global risk threshold (0-100) for triggering alerts
    - **send_notifications**: Enable/disable notifications
    """
    result = await kestra_service.trigger_workflow(
        run_mode=request.run_mode.value,
        risk_threshold=request.risk_threshold,
        send_notifications=request.send_notifications,
    )

    if result.status == "ERROR":
        raise HTTPException(status_code=500, detail=result.message)

    return result


@router.get("/executions", response_model=List[Dict[str, Any]])
async def list_executions(
    limit: int = 10,
    state: Optional[str] = None,
):
    """
    List recent workflow executions.

    - **limit**: Maximum number of executions to return
    - **state**: Filter by execution state (CREATED, RUNNING, SUCCESS, FAILED)
    """
    return await kestra_service.list_executions(limit=limit, state=state)


@router.get("/executions/{execution_id}", response_model=ExecutionStatus)
async def get_execution(execution_id: str):
    """
    Get the status of a specific execution.

    - **execution_id**: The unique execution ID
    """
    result = await kestra_service.get_execution_status(execution_id)
    if not result:
        raise HTTPException(status_code=404, detail="Execution not found")
    return result


@router.get("/executions/{execution_id}/logs")
async def get_execution_logs(execution_id: str):
    """
    Get logs for a specific execution.

    - **execution_id**: The unique execution ID
    """
    logs = await kestra_service.get_execution_logs(execution_id)
    return {"execution_id": execution_id, "logs": logs}


@router.post("/trigger/treasury")
async def trigger_treasury_only():
    """Trigger treasury analysis only."""
    result = await kestra_service.trigger_workflow(
        run_mode="treasury_only",
        risk_threshold=70,
        send_notifications=True,
    )
    return result


@router.post("/trigger/portfolio")
async def trigger_portfolio_only():
    """Trigger portfolio analysis only."""
    result = await kestra_service.trigger_workflow(
        run_mode="portfolio_only",
        risk_threshold=70,
        send_notifications=True,
    )
    return result


@router.post("/trigger/compliance")
async def trigger_compliance_only():
    """Trigger compliance analysis only."""
    result = await kestra_service.trigger_workflow(
        run_mode="compliance_only",
        risk_threshold=70,
        send_notifications=True,
    )
    return result
