"""
FastAPI Backend for GreenPulse AI

Main API server providing endpoints for:
- Credit assessment
- Portfolio optimization
- Micro-loan processing
- Greenwashing detection
- Real-time data streaming
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import asyncio
import logging
from datetime import datetime
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents import MasterAgent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="GreenPulse AI API",
    description="Carbon Footprint-Driven Intelligent Financial Ecosystem",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Master Agent
config = {
    "api_keys": {},
    "data_sources": {},
    "models": {}
}
master_agent = MasterAgent(config)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()


# Request/Response Models
class CreditAssessmentRequest(BaseModel):
    entity_id: str = Field(..., description="Unique identifier for entity")
    entity_type: str = Field(default="company", description="Type: company or individual")


class PortfolioOptimizationRequest(BaseModel):
    capital: float = Field(..., gt=0, description="Initial investment capital")
    risk_tolerance: str = Field(default="moderate", description="Risk level: conservative, moderate, aggressive")
    target_return: float = Field(default=0.08, description="Target annual return rate")


class MicroLoanRequest(BaseModel):
    applicant_id: str = Field(..., description="Applicant identifier")
    amount: float = Field(..., gt=0, description="Requested loan amount")
    purpose: str = Field(default="business", description="Loan purpose")
    mobile_payment_history: Optional[List[Dict]] = None
    green_activities: Optional[Dict] = None
    social_data: Optional[Dict] = None


class GreenwashingCheckRequest(BaseModel):
    company_id: str = Field(..., description="Company identifier")


# API Endpoints
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "GreenPulse AI API",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "credit_assessment": "/api/v1/credit/assess",
            "portfolio_optimization": "/api/v1/portfolio/optimize",
            "micro_loan": "/api/v1/loan/apply",
            "greenwashing_check": "/api/v1/greenwashing/check",
            "system_status": "/api/v1/system/status"
        }
    }


@app.get("/api/v1/system/status")
async def get_system_status():
    """Get current system status and agent health."""
    try:
        status = await master_agent.get_system_status()
        return status
    except Exception as e:
        logger.error(f"Error getting system status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/credit/assess")
async def assess_credit(request: CreditAssessmentRequest):
    """
    Assess credit using real-time carbon footprint data.
    
    Returns comprehensive credit rating combining traditional
    financial metrics with carbon performance.
    """
    try:
        logger.info(f"Credit assessment request for: {request.entity_id}")
        
        result = await master_agent.process_request(
            "credit_assessment",
            {
                "entity_id": request.entity_id,
                "entity_type": request.entity_type
            }
        )
        
        # Broadcast update via WebSocket
        await manager.broadcast({
            "type": "credit_assessment_complete",
            "entity_id": request.entity_id,
            "timestamp": datetime.now().isoformat()
        })
        
        return result
        
    except Exception as e:
        logger.error(f"Error in credit assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/portfolio/optimize")
async def optimize_portfolio(request: PortfolioOptimizationRequest):
    """
    Generate optimized investment portfolio with carbon neutrality path.
    
    Returns both traditional and green portfolio options with
    comparative carbon impact analysis.
    """
    try:
        logger.info(f"Portfolio optimization request: ${request.capital}")
        
        result = await master_agent.process_request(
            "portfolio_optimization",
            {
                "capital": request.capital,
                "risk_tolerance": request.risk_tolerance,
                "target_return": request.target_return
            }
        )
        
        await manager.broadcast({
            "type": "portfolio_optimized",
            "capital": request.capital,
            "timestamp": datetime.now().isoformat()
        })
        
        return result
        
    except Exception as e:
        logger.error(f"Error in portfolio optimization: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/loan/apply")
async def apply_micro_loan(request: MicroLoanRequest):
    """
    Process micro-loan application using alternative data sources.
    
    Enables financial access for underserved communities through
    non-traditional credit assessment.
    """
    try:
        logger.info(f"Micro-loan application: {request.applicant_id}")
        
        result = await master_agent.process_request(
            "micro_loan",
            {
                "applicant_id": request.applicant_id,
                "amount": request.amount,
                "purpose": request.purpose,
                "mobile_payment_history": request.mobile_payment_history or [],
                "green_activities": request.green_activities or {},
                "social_data": request.social_data or {}
            }
        )
        
        await manager.broadcast({
            "type": "loan_processed",
            "applicant_id": request.applicant_id,
            "approved": result.get("approval_status", False),
            "timestamp": datetime.now().isoformat()
        })
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing micro-loan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/greenwashing/check")
async def check_greenwashing(request: GreenwashingCheckRequest):
    """
    Detect potential greenwashing by analyzing discrepancies
    between corporate claims and actual carbon performance.
    """
    try:
        logger.info(f"Greenwashing check for: {request.company_id}")
        
        result = await master_agent.process_request(
            "greenwashing_check",
            {"company_id": request.company_id}
        )
        
        await manager.broadcast({
            "type": "greenwashing_check_complete",
            "company_id": request.company_id,
            "risk_index": result.get("greenwashing_risk_index", 0),
            "timestamp": datetime.now().isoformat()
        })
        
        return result
        
    except Exception as e:
        logger.error(f"Error in greenwashing check: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time data streaming.
    
    Clients can connect to receive live updates on:
    - Credit assessments
    - Portfolio changes
    - Market data
    - System alerts
    """
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            logger.info(f"Received WebSocket message: {data}")
            
            # Echo back for now
            await websocket.send_json({
                "type": "acknowledgment",
                "message": "Message received",
                "timestamp": datetime.now().isoformat()
            })
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket client disconnected")


@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
