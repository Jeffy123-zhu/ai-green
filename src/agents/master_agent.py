"""
Master Agent - Central Orchestrator for GreenPulse AI System

This agent coordinates all sub-agents and manages the overall workflow
for carbon footprint analysis and financial decision-making.
"""

import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

from .data_collection_agent import DataCollectionAgent
from .risk_assessment_agent import RiskAssessmentAgent
from .portfolio_optimization_agent import PortfolioOptimizationAgent
from .inclusion_agent import InclusionAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MasterAgent:
    """
    Central coordinator for the multi-agent system.
    Manages task delegation and result aggregation.
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.data_agent = DataCollectionAgent(config)
        self.risk_agent = RiskAssessmentAgent(config)
        self.portfolio_agent = PortfolioOptimizationAgent(config)
        self.inclusion_agent = InclusionAgent(config)
        
        self.task_queue = asyncio.Queue()
        self.results_cache = {}
        
        logger.info("Master Agent initialized successfully")
    
    async def process_request(self, request_type: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main entry point for processing user requests.
        Routes to appropriate agent based on request type.
        """
        logger.info(f"Processing request: {request_type}")
        
        try:
            if request_type == "credit_assessment":
                return await self._assess_credit(params)
            elif request_type == "portfolio_optimization":
                return await self._optimize_portfolio(params)
            elif request_type == "micro_loan":
                return await self._process_micro_loan(params)
            elif request_type == "greenwashing_check":
                return await self._check_greenwashing(params)
            else:
                raise ValueError(f"Unknown request type: {request_type}")
                
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}")
            return {"error": str(e), "status": "failed"}
    
    async def _assess_credit(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Comprehensive credit assessment combining traditional and carbon metrics.
        """
        entity_id = params.get("entity_id")
        entity_type = params.get("entity_type", "company")
        
        # Step 1: Collect data from multiple sources
        logger.info(f"Collecting data for entity: {entity_id}")
        data = await self.data_agent.collect_all_data(entity_id, entity_type)
        
        # Step 2: Perform risk assessment
        logger.info("Performing risk assessment")
        risk_analysis = await self.risk_agent.assess_risk(data)
        
        # Step 3: Calculate carbon credit score
        carbon_score = await self._calculate_carbon_score(data)
        
        # Step 4: Generate final credit rating
        final_rating = self._generate_credit_rating(risk_analysis, carbon_score)
        
        return {
            "entity_id": entity_id,
            "timestamp": datetime.now().isoformat(),
            "carbon_score": carbon_score,
            "risk_analysis": risk_analysis,
            "credit_rating": final_rating,
            "recommendations": self._generate_recommendations(final_rating),
            "status": "success"
        }
    
    async def _optimize_portfolio(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate optimized investment portfolio with carbon neutrality path.
        """
        initial_capital = params.get("capital", 100000)
        risk_tolerance = params.get("risk_tolerance", "moderate")
        target_return = params.get("target_return", 0.08)
        
        logger.info(f"Optimizing portfolio: capital=${initial_capital}, risk={risk_tolerance}")
        
        # Collect market data
        market_data = await self.data_agent.collect_market_data()
        
        # Generate traditional portfolio
        traditional_portfolio = await self.portfolio_agent.optimize_traditional(
            initial_capital, risk_tolerance, target_return, market_data
        )
        
        # Generate green portfolio
        green_portfolio = await self.portfolio_agent.optimize_green(
            initial_capital, risk_tolerance, target_return, market_data
        )
        
        # Calculate carbon impact
        carbon_comparison = await self._compare_carbon_impact(
            traditional_portfolio, green_portfolio
        )
        
        return {
            "timestamp": datetime.now().isoformat(),
            "traditional_portfolio": traditional_portfolio,
            "green_portfolio": green_portfolio,
            "carbon_comparison": carbon_comparison,
            "recommendations": "Consider green portfolio for 40% lower carbon footprint",
            "status": "success"
        }
    
    async def _process_micro_loan(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process micro-loan application using alternative data sources.
        """
        applicant_id = params.get("applicant_id")
        loan_amount = params.get("amount")
        purpose = params.get("purpose", "business")
        
        logger.info(f"Processing micro-loan for applicant: {applicant_id}")
        
        # Use inclusion agent for alternative credit assessment
        assessment = await self.inclusion_agent.assess_alternative_credit(params)
        
        # Calculate loan terms
        loan_terms = await self.inclusion_agent.calculate_loan_terms(
            assessment, loan_amount
        )
        
        return {
            "applicant_id": applicant_id,
            "timestamp": datetime.now().isoformat(),
            "assessment": assessment,
            "loan_terms": loan_terms,
            "approval_status": assessment.get("approved", False),
            "status": "success"
        }
    
    async def _check_greenwashing(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Detect potential greenwashing by comparing claims vs actual data.
        """
        company_id = params.get("company_id")
        
        logger.info(f"Checking greenwashing for company: {company_id}")
        
        # Collect company claims and actual data
        data = await self.data_agent.collect_all_data(company_id, "company")
        
        # Analyze discrepancies
        analysis = await self.risk_agent.detect_greenwashing(data)
        
        return {
            "company_id": company_id,
            "timestamp": datetime.now().isoformat(),
            "greenwashing_risk_index": analysis.get("risk_index", 0),
            "anomalies": analysis.get("anomalies", []),
            "recommendations": analysis.get("recommendations", []),
            "status": "success"
        }
    
    async def _calculate_carbon_score(self, data: Dict[str, Any]) -> float:
        """
        Calculate dynamic carbon credit score (0-100).
        Higher score indicates better carbon performance.
        """
        emissions = data.get("carbon_emissions", {})
        
        # Normalize emissions data
        total_emissions = emissions.get("total_co2_tons", 0)
        emissions_trend = emissions.get("trend", 0)  # Negative is good
        renewable_energy_pct = data.get("renewable_energy_percentage", 0)
        
        # Weighted scoring algorithm
        base_score = max(0, 100 - (total_emissions / 1000))  # Penalize high emissions
        trend_bonus = max(-20, min(20, -emissions_trend * 10))  # Reward reduction
        renewable_bonus = renewable_energy_pct * 0.3  # Up to 30 points
        
        final_score = min(100, max(0, base_score + trend_bonus + renewable_bonus))
        
        return round(final_score, 2)
    
    def _generate_credit_rating(
        self, risk_analysis: Dict[str, Any], carbon_score: float
    ) -> Dict[str, Any]:
        """
        Generate final credit rating combining traditional and carbon metrics.
        """
        traditional_score = risk_analysis.get("credit_score", 50)
        
        # Weighted combination: 60% traditional, 40% carbon
        combined_score = (traditional_score * 0.6) + (carbon_score * 0.4)
        
        # Determine rating category
        if combined_score >= 80:
            rating = "AAA"
            interest_rate_adjustment = -0.02  # 2% discount
        elif combined_score >= 70:
            rating = "AA"
            interest_rate_adjustment = -0.01
        elif combined_score >= 60:
            rating = "A"
            interest_rate_adjustment = 0
        elif combined_score >= 50:
            rating = "BBB"
            interest_rate_adjustment = 0.01
        else:
            rating = "BB"
            interest_rate_adjustment = 0.02  # 2% premium
        
        return {
            "rating": rating,
            "combined_score": round(combined_score, 2),
            "traditional_score": traditional_score,
            "carbon_score": carbon_score,
            "interest_rate_adjustment": interest_rate_adjustment
        }
    
    def _generate_recommendations(self, rating: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations based on credit rating."""
        recommendations = []
        
        if rating["carbon_score"] < 50:
            recommendations.append(
                "Consider implementing renewable energy sources to improve carbon score"
            )
            recommendations.append(
                "Develop a carbon reduction roadmap to access better financing terms"
            )
        
        if rating["combined_score"] < 60:
            recommendations.append(
                "Improve ESG reporting transparency to enhance investor confidence"
            )
        
        return recommendations
    
    async def _compare_carbon_impact(
        self, traditional: Dict, green: Dict
    ) -> Dict[str, Any]:
        """Compare carbon footprint of two portfolios."""
        trad_emissions = sum([
            asset.get("annual_co2_tons", 0) * asset.get("allocation", 0)
            for asset in traditional.get("assets", [])
        ])
        
        green_emissions = sum([
            asset.get("annual_co2_tons", 0) * asset.get("allocation", 0)
            for asset in green.get("assets", [])
        ])
        
        reduction = trad_emissions - green_emissions
        reduction_pct = (reduction / trad_emissions * 100) if trad_emissions > 0 else 0
        
        return {
            "traditional_emissions_tons": round(trad_emissions, 2),
            "green_emissions_tons": round(green_emissions, 2),
            "reduction_tons": round(reduction, 2),
            "reduction_percentage": round(reduction_pct, 2),
            "net_zero_timeline_years": round(green_emissions / max(1, reduction) * 10, 1)
        }
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Return current system status and agent health."""
        return {
            "timestamp": datetime.now().isoformat(),
            "agents": {
                "data_collection": "active",
                "risk_assessment": "active",
                "portfolio_optimization": "active",
                "inclusion": "active"
            },
            "queue_size": self.task_queue.qsize(),
            "cache_size": len(self.results_cache),
            "status": "operational"
        }
