"""
Inclusion Agent - Enables financial access for underserved communities

Uses alternative data sources to assess creditworthiness for
individuals and small businesses without traditional credit history.
"""

import asyncio
from typing import Dict, List, Any
import logging
from datetime import datetime
import random

logger = logging.getLogger(__name__)


class InclusionAgent:
    """Provides financial inclusion through alternative credit assessment."""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.base_interest_rate = 0.08  # 8% base rate
        
    async def assess_alternative_credit(
        self, applicant_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Assess creditworthiness using non-traditional data sources.
        """
        logger.info(f"Assessing alternative credit for applicant")
        
        # Collect alternative data
        mobile_payment_score = await self._analyze_mobile_payments(
            applicant_data.get("mobile_payment_history", [])
        )
        
        green_activity_score = await self._analyze_green_activities(
            applicant_data.get("green_activities", {})
        )
        
        social_score = await self._analyze_social_factors(
            applicant_data.get("social_data", {})
        )
        
        # Calculate composite alternative credit score
        composite_score = (
            mobile_payment_score * 0.50 +
            green_activity_score * 0.30 +
            social_score * 0.20
        )
        
        # Determine approval
        approved = composite_score >= 55
        
        return {
            "applicant_id": applicant_data.get("applicant_id"),
            "timestamp": datetime.now().isoformat(),
            "alternative_credit_score": round(composite_score, 2),
            "mobile_payment_score": mobile_payment_score,
            "green_activity_score": green_activity_score,
            "social_score": social_score,
            "approved": approved,
            "confidence_level": round(random.uniform(0.70, 0.92), 2),
            "assessment_method": "alternative_data"
        }
    
    async def _analyze_mobile_payments(
        self, payment_history: List[Dict[str, Any]]
    ) -> float:
        """Analyze mobile payment patterns for creditworthiness."""
        await asyncio.sleep(0.05)
        
        if not payment_history:
            # Simulate payment history
            payment_history = [
                {"amount": random.randint(50, 500), "type": "income"}
                for _ in range(random.randint(10, 30))
            ]
        
        # Calculate metrics
        transaction_count = len(payment_history)
        avg_transaction = sum(p.get("amount", 0) for p in payment_history) / max(1, transaction_count)
        
        # Scoring logic
        frequency_score = min(50, transaction_count * 2)
        amount_score = min(50, avg_transaction / 10)
        
        return min(100, frequency_score + amount_score)
    
    async def _analyze_green_activities(
        self, green_data: Dict[str, Any]
    ) -> float:
        """Analyze green/sustainable activities."""
        await asyncio.sleep(0.05)
        
        score = 0
        
        # Solar panel ownership
        if green_data.get("has_solar_panels", False):
            score += 30
            generation_kwh = green_data.get("solar_generation_kwh", 0)
            score += min(20, generation_kwh / 100)
        
        # Organic farming
        if green_data.get("organic_farming", False):
            score += 25
        
        # Sustainable practices
        sustainable_practices = green_data.get("sustainable_practices", [])
        score += min(25, len(sustainable_practices) * 8)
        
        return min(100, score)
    
    async def _analyze_social_factors(
        self, social_data: Dict[str, Any]
    ) -> float:
        """Analyze social and community factors."""
        await asyncio.sleep(0.05)
        
        score = 50  # Base score
        
        # Community involvement
        if social_data.get("community_member", False):
            score += 15
        
        # Business references
        references = social_data.get("business_references", 0)
        score += min(20, references * 5)
        
        # Years in community
        years_in_community = social_data.get("years_in_community", 0)
        score += min(15, years_in_community * 2)
        
        return min(100, score)
    
    async def calculate_loan_terms(
        self,
        assessment: Dict[str, Any],
        loan_amount: float
    ) -> Dict[str, Any]:
        """
        Calculate loan terms based on alternative credit assessment.
        """
        logger.info(f"Calculating loan terms for amount: ${loan_amount}")
        
        credit_score = assessment.get("alternative_credit_score", 50)
        
        # Adjust interest rate based on credit score
        if credit_score >= 80:
            interest_rate = self.base_interest_rate - 0.02  # 6%
            max_loan_amount = loan_amount * 1.2
        elif credit_score >= 65:
            interest_rate = self.base_interest_rate  # 8%
            max_loan_amount = loan_amount
        elif credit_score >= 55:
            interest_rate = self.base_interest_rate + 0.02  # 10%
            max_loan_amount = loan_amount * 0.8
        else:
            interest_rate = self.base_interest_rate + 0.04  # 12%
            max_loan_amount = loan_amount * 0.5
        
        # Calculate repayment schedule
        loan_term_months = 24  # 2 years
        monthly_rate = interest_rate / 12
        
        # Monthly payment calculation
        if monthly_rate > 0:
            monthly_payment = loan_amount * (
                monthly_rate * (1 + monthly_rate) ** loan_term_months
            ) / ((1 + monthly_rate) ** loan_term_months - 1)
        else:
            monthly_payment = loan_amount / loan_term_months
        
        total_repayment = monthly_payment * loan_term_months
        total_interest = total_repayment - loan_amount
        
        return {
            "approved_amount": round(min(loan_amount, max_loan_amount), 2),
            "interest_rate": round(interest_rate, 4),
            "loan_term_months": loan_term_months,
            "monthly_payment": round(monthly_payment, 2),
            "total_repayment": round(total_repayment, 2),
            "total_interest": round(total_interest, 2),
            "first_payment_date": self._calculate_first_payment_date(),
            "special_terms": self._generate_special_terms(assessment)
        }
    
    def _calculate_first_payment_date(self) -> str:
        """Calculate first payment date (30 days from now)."""
        from datetime import timedelta
        first_payment = datetime.now() + timedelta(days=30)
        return first_payment.strftime("%Y-%m-%d")
    
    def _generate_special_terms(
        self, assessment: Dict[str, Any]
    ) -> List[str]:
        """Generate special terms based on green activities."""
        terms = []
        
        green_score = assessment.get("green_activity_score", 0)
        
        if green_score > 70:
            terms.append("Green bonus: 0.5% interest rate reduction for maintaining solar generation")
            terms.append("Carbon credit: Earn credits for verified emission reductions")
        
        if green_score > 50:
            terms.append("Flexible repayment: Adjust payments based on seasonal income")
        
        terms.append("Financial literacy: Free access to online financial education")
        
        return terms
    
    async def provide_multilingual_support(
        self,
        message: str,
        source_language: str,
        target_language: str = "en"
    ) -> Dict[str, Any]:
        """
        Provide multilingual customer support.
        In production, this would use translation APIs.
        """
        logger.info(f"Translating from {source_language} to {target_language}")
        
        await asyncio.sleep(0.05)
        
        # Simulate translation
        translated_message = f"[Translated from {source_language}]: {message}"
        
        return {
            "original_message": message,
            "translated_message": translated_message,
            "source_language": source_language,
            "target_language": target_language,
            "confidence": round(random.uniform(0.85, 0.98), 2)
        }
    
    async def generate_financial_education_content(
        self,
        topic: str,
        user_level: str = "beginner"
    ) -> Dict[str, Any]:
        """
        Generate personalized financial education content.
        """
        logger.info(f"Generating education content: {topic} for {user_level}")
        
        await asyncio.sleep(0.05)
        
        content_library = {
            "savings": {
                "beginner": "Start by saving 10% of your income each month. Even small amounts add up over time.",
                "intermediate": "Consider high-yield savings accounts and emergency funds covering 3-6 months of expenses.",
                "advanced": "Optimize savings through tax-advantaged accounts and automated investment strategies."
            },
            "credit": {
                "beginner": "Credit is borrowed money you must repay. Good credit history helps you access better loan terms.",
                "intermediate": "Maintain credit utilization below 30% and always pay on time to build strong credit.",
                "advanced": "Leverage credit strategically for business growth while managing debt-to-income ratios."
            },
            "investment": {
                "beginner": "Investing means putting money into assets that can grow in value over time.",
                "intermediate": "Diversify investments across stocks, bonds, and other assets to manage risk.",
                "advanced": "Consider ESG investing to align financial goals with environmental and social values."
            }
        }
        
        content = content_library.get(topic, {}).get(user_level, "Content not available")
        
        return {
            "topic": topic,
            "level": user_level,
            "content": content,
            "next_steps": [
                "Practice with small amounts",
                "Track your progress",
                "Ask questions when unsure"
            ],
            "resources": [
                "Video tutorials available",
                "Interactive calculators",
                "Community support forum"
            ]
        }
