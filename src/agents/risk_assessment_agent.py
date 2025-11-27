"""
Risk Assessment Agent - Evaluates credit and carbon risk

Combines traditional credit analysis with carbon risk quantification
to provide comprehensive risk assessment.
"""

import asyncio
from typing import Dict, List, Any
import logging
from datetime import datetime
import random

logger = logging.getLogger(__name__)


class RiskAssessmentAgent:
    """Assesses both traditional financial risk and carbon-related risk."""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.risk_models = {}
        
    async def assess_risk(self, entity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Comprehensive risk assessment combining multiple factors.
        """
        logger.info("Starting comprehensive risk assessment")
        
        # Parallel risk analysis
        traditional_risk_task = self._assess_traditional_risk(
            entity_data.get("financial", {})
        )
        carbon_risk_task = self._assess_carbon_risk(
            entity_data.get("carbon_emissions", {})
        )
        esg_risk_task = self._assess_esg_risk(
            entity_data.get("esg_metrics", {})
        )
        
        traditional_risk, carbon_risk, esg_risk = await asyncio.gather(
            traditional_risk_task, carbon_risk_task, esg_risk_task
        )
        
        # Calculate composite risk score
        composite_score = self._calculate_composite_score(
            traditional_risk, carbon_risk, esg_risk
        )
        
        return {
            "timestamp": datetime.now().isoformat(),
            "traditional_risk": traditional_risk,
            "carbon_risk": carbon_risk,
            "esg_risk": esg_risk,
            "composite_risk_score": composite_score,
            "credit_score": self._convert_to_credit_score(composite_score),
            "risk_category": self._categorize_risk(composite_score)
        }
    
    async def _assess_traditional_risk(
        self, financial_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Assess traditional financial risk factors."""
        await asyncio.sleep(0.05)
        
        revenue = financial_data.get("revenue", 0)
        profit_margin = financial_data.get("profit_margin", 0)
        debt_to_equity = financial_data.get("debt_to_equity", 0)
        current_ratio = financial_data.get("current_ratio", 0)
        defaults = financial_data.get("payment_defaults", 0)
        
        # Simple risk scoring algorithm
        revenue_score = min(100, (revenue / 100000))  # Normalize
        profitability_score = profit_margin * 100
        leverage_score = max(0, 100 - (debt_to_equity * 50))
        liquidity_score = min(100, current_ratio * 40)
        default_penalty = defaults * 15
        
        risk_score = (
            revenue_score * 0.2 +
            profitability_score * 0.3 +
            leverage_score * 0.2 +
            liquidity_score * 0.3 -
            default_penalty
        )
        
        return {
            "risk_score": max(0, min(100, risk_score)),
            "revenue_assessment": "strong" if revenue > 5000000 else "moderate",
            "profitability_assessment": "strong" if profit_margin > 0.15 else "moderate",
            "leverage_assessment": "low" if debt_to_equity < 1.0 else "moderate",
            "liquidity_assessment": "strong" if current_ratio > 1.5 else "moderate",
            "default_history": "clean" if defaults == 0 else "concerning"
        }
    
    async def _assess_carbon_risk(
        self, carbon_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Assess carbon-related financial risk."""
        await asyncio.sleep(0.05)
        
        total_emissions = carbon_data.get("total_co2_tons", 0)
        trend = carbon_data.get("trend", 0)
        renewable_pct = carbon_data.get("renewable_energy_percentage", 0)
        offset_tons = carbon_data.get("carbon_offset_tons", 0)
        
        # Carbon risk factors
        emission_intensity_risk = min(100, total_emissions / 50)
        trend_risk = max(0, trend * 100)  # Positive trend increases risk
        transition_risk = max(0, 100 - renewable_pct)
        offset_benefit = min(30, offset_tons / 10)
        
        carbon_risk_score = max(0, min(100,
            emission_intensity_risk * 0.4 +
            trend_risk * 0.3 +
            transition_risk * 0.3 -
            offset_benefit
        ))
        
        # Regulatory risk assessment
        regulatory_risk = self._assess_regulatory_risk(total_emissions, renewable_pct)
        
        return {
            "carbon_risk_score": round(100 - carbon_risk_score, 2),  # Invert for consistency
            "emission_intensity": "high" if total_emissions > 2000 else "moderate",
            "trend_direction": "improving" if trend < 0 else "worsening",
            "transition_readiness": "strong" if renewable_pct > 50 else "developing",
            "regulatory_risk": regulatory_risk,
            "stranded_asset_risk": "high" if renewable_pct < 20 else "low"
        }
    
    async def _assess_esg_risk(
        self, esg_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Assess ESG-related risks."""
        await asyncio.sleep(0.05)
        
        env_score = esg_data.get("environmental_score", 50)
        social_score = esg_data.get("social_score", 50)
        gov_score = esg_data.get("governance_score", 50)
        
        # Weighted ESG score
        esg_score = (env_score * 0.4 + social_score * 0.3 + gov_score * 0.3)
        
        # SDG alignment bonus
        sdg_alignment = esg_data.get("sdg_alignment", {})
        sdg_bonus = sum(1 for v in sdg_alignment.values() if v) * 5
        
        final_score = min(100, esg_score + sdg_bonus)
        
        return {
            "esg_risk_score": round(final_score, 2),
            "environmental_rating": self._rate_component(env_score),
            "social_rating": self._rate_component(social_score),
            "governance_rating": self._rate_component(gov_score),
            "sdg_aligned_count": sum(1 for v in sdg_alignment.values() if v),
            "reputational_risk": "low" if final_score > 70 else "moderate"
        }
    
    def _assess_regulatory_risk(
        self, emissions: float, renewable_pct: float
    ) -> str:
        """Assess risk from carbon regulations."""
        if emissions > 3000 and renewable_pct < 30:
            return "high"
        elif emissions > 1500 or renewable_pct < 50:
            return "moderate"
        else:
            return "low"
    
    def _calculate_composite_score(
        self, traditional: Dict, carbon: Dict, esg: Dict
    ) -> float:
        """Calculate weighted composite risk score."""
        trad_score = traditional.get("risk_score", 50)
        carbon_score = carbon.get("carbon_risk_score", 50)
        esg_score = esg.get("esg_risk_score", 50)
        
        # Weighted average: 50% traditional, 30% carbon, 20% ESG
        composite = (trad_score * 0.5 + carbon_score * 0.3 + esg_score * 0.2)
        
        return round(composite, 2)
    
    def _convert_to_credit_score(self, risk_score: float) -> int:
        """Convert risk score to traditional credit score range (300-850)."""
        # Map 0-100 risk score to 300-850 credit score
        credit_score = 300 + (risk_score / 100) * 550
        return int(credit_score)
    
    def _categorize_risk(self, score: float) -> str:
        """Categorize overall risk level."""
        if score >= 80:
            return "low_risk"
        elif score >= 60:
            return "moderate_risk"
        elif score >= 40:
            return "elevated_risk"
        else:
            return "high_risk"
    
    def _rate_component(self, score: float) -> str:
        """Rate individual component score."""
        if score >= 80:
            return "excellent"
        elif score >= 70:
            return "good"
        elif score >= 60:
            return "fair"
        else:
            return "needs_improvement"
    
    async def detect_greenwashing(
        self, entity_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Detect potential greenwashing by analyzing discrepancies
        between claims and actual performance.
        """
        logger.info("Analyzing for greenwashing indicators")
        
        carbon_data = entity_data.get("carbon_emissions", {})
        esg_data = entity_data.get("esg_metrics", {})
        
        anomalies = []
        risk_factors = 0
        
        # Check for inconsistencies
        env_score = esg_data.get("environmental_score", 50)
        total_emissions = carbon_data.get("total_co2_tons", 0)
        renewable_pct = carbon_data.get("renewable_energy_percentage", 0)
        trend = carbon_data.get("trend", 0)
        
        # Anomaly detection logic
        if env_score > 80 and total_emissions > 3000:
            anomalies.append({
                "type": "high_score_high_emissions",
                "description": "Environmental score is high but emissions are substantial",
                "severity": "medium"
            })
            risk_factors += 2
        
        if env_score > 70 and renewable_pct < 20:
            anomalies.append({
                "type": "score_renewable_mismatch",
                "description": "High environmental score but low renewable energy usage",
                "severity": "high"
            })
            risk_factors += 3
        
        if trend > 0.05 and env_score > 75:
            anomalies.append({
                "type": "increasing_emissions_high_score",
                "description": "Emissions increasing while maintaining high environmental score",
                "severity": "high"
            })
            risk_factors += 3
        
        # Calculate greenwashing risk index (0-100)
        risk_index = min(100, risk_factors * 15)
        
        recommendations = []
        if risk_index > 50:
            recommendations.append("Request third-party verification of carbon claims")
            recommendations.append("Conduct detailed supply chain emissions audit")
        if risk_index > 30:
            recommendations.append("Monitor emissions data more frequently")
        
        return {
            "risk_index": risk_index,
            "risk_level": "high" if risk_index > 60 else "moderate" if risk_index > 30 else "low",
            "anomalies": anomalies,
            "anomaly_count": len(anomalies),
            "recommendations": recommendations,
            "confidence": round(random.uniform(0.75, 0.95), 2)
        }
