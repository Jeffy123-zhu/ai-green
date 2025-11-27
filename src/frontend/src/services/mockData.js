// Mock data generators for demo mode (when backend is not available)

const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(randomBetween(min, max));

export const mockSystemStatus = () => ({
  status: 'operational',
  timestamp: new Date().toISOString(),
  agents: {
    data_collection: 'active',
    risk_assessment: 'active',
    portfolio_optimization: 'active',
    inclusion: 'active'
  },
  queue_size: randomInt(0, 10),
  cache_size: randomInt(50, 200)
});

export const mockCreditAssessment = (entityId, entityType) => {
  const traditionalScore = randomBetween(45, 95);
  const carbonScore = randomBetween(40, 92);
  const esgScore = randomBetween(50, 90);
  const combinedScore = traditionalScore * 0.6 + carbonScore * 0.4;
  
  let rating, interestAdj;
  if (combinedScore >= 80) { rating = 'AAA'; interestAdj = -0.02; }
  else if (combinedScore >= 70) { rating = 'AA'; interestAdj = -0.01; }
  else if (combinedScore >= 60) { rating = 'A'; interestAdj = 0; }
  else if (combinedScore >= 50) { rating = 'BBB'; interestAdj = 0.01; }
  else { rating = 'BB'; interestAdj = 0.02; }

  const emissions = randomInt(500, 4000);
  const trend = randomBetween(-0.15, 0.1);
  const renewablePct = randomInt(10, 75);

  return {
    entity_id: entityId,
    timestamp: new Date().toISOString(),
    carbon_score: Math.round(carbonScore * 100) / 100,
    risk_analysis: {
      traditional_risk: {
        risk_score: Math.round(traditionalScore * 100) / 100,
        revenue_assessment: traditionalScore > 70 ? 'strong' : 'moderate',
        profitability_assessment: traditionalScore > 65 ? 'strong' : 'moderate',
        leverage_assessment: randomBetween(0, 1) > 0.5 ? 'low' : 'moderate',
        liquidity_assessment: traditionalScore > 60 ? 'strong' : 'moderate',
        default_history: randomBetween(0, 1) > 0.8 ? 'concerning' : 'clean'
      },
      carbon_risk: {
        carbon_risk_score: Math.round(carbonScore * 100) / 100,
        emission_intensity: emissions > 2000 ? 'high' : 'moderate',
        trend_direction: trend < 0 ? 'improving' : 'worsening',
        transition_readiness: renewablePct > 50 ? 'strong' : 'developing',
        regulatory_risk: emissions > 3000 && renewablePct < 30 ? 'high' : renewablePct < 50 ? 'moderate' : 'low',
        stranded_asset_risk: renewablePct < 20 ? 'high' : 'low'
      },
      esg_risk: {
        esg_risk_score: Math.round(esgScore * 100) / 100,
        environmental_rating: esgScore > 80 ? 'excellent' : esgScore > 70 ? 'good' : 'fair',
        social_rating: esgScore > 75 ? 'good' : 'fair',
        governance_rating: esgScore > 70 ? 'good' : 'fair',
        sdg_aligned_count: randomInt(2, 4),
        reputational_risk: esgScore > 70 ? 'low' : 'moderate'
      },
      composite_risk_score: Math.round(combinedScore * 100) / 100,
      credit_score: Math.round(300 + (combinedScore / 100) * 550),
      risk_category: combinedScore >= 80 ? 'low_risk' : combinedScore >= 60 ? 'moderate_risk' : 'elevated_risk'
    },
    credit_rating: {
      rating,
      combined_score: Math.round(combinedScore * 100) / 100,
      traditional_score: Math.round(traditionalScore * 100) / 100,
      carbon_score: Math.round(carbonScore * 100) / 100,
      interest_rate_adjustment: interestAdj
    },
    recommendations: carbonScore < 60 ? [
      'Consider implementing renewable energy sources to improve carbon score',
      'Develop a carbon reduction roadmap to access better financing terms',
      'Improve ESG reporting transparency to enhance investor confidence'
    ] : [
      'Maintain current sustainability initiatives',
      'Consider carbon offset programs for remaining emissions'
    ],
    status: 'success'
  };
};

export const mockPortfolioOptimization = (capital, riskTolerance, targetReturn) => {
  const generateAssets = (isGreen) => {
    const assetSets = {
      conservative: isGreen ? [
        { name: 'Green Bonds', allocation: 0.50, expected_return: 0.045, volatility: 0.06, annual_co2_tons: 25 },
        { name: 'Renewable Energy Funds', allocation: 0.25, expected_return: 0.07, volatility: 0.12, annual_co2_tons: 50 },
        { name: 'ESG Index Funds', allocation: 0.15, expected_return: 0.065, volatility: 0.10, annual_co2_tons: 100 },
        { name: 'Sustainable Real Estate', allocation: 0.10, expected_return: 0.055, volatility: 0.09, annual_co2_tons: 75 }
      ] : [
        { name: 'Corporate Bonds', allocation: 0.60, expected_return: 0.04, volatility: 0.05, annual_co2_tons: 500 },
        { name: 'Large Cap Stocks', allocation: 0.25, expected_return: 0.08, volatility: 0.15, annual_co2_tons: 2000 },
        { name: 'Real Estate', allocation: 0.10, expected_return: 0.06, volatility: 0.12, annual_co2_tons: 1500 },
        { name: 'Cash', allocation: 0.05, expected_return: 0.01, volatility: 0.02, annual_co2_tons: 0 }
      ],
      moderate: isGreen ? [
        { name: 'ESG Equity Funds', allocation: 0.35, expected_return: 0.085, volatility: 0.14, annual_co2_tons: 90 },
        { name: 'Green Bonds', allocation: 0.30, expected_return: 0.045, volatility: 0.06, annual_co2_tons: 25 },
        { name: 'Renewable Infrastructure', allocation: 0.20, expected_return: 0.075, volatility: 0.11, annual_co2_tons: 60 },
        { name: 'Sustainable Agriculture', allocation: 0.15, expected_return: 0.070, volatility: 0.13, annual_co2_tons: 50 }
      ] : [
        { name: 'Index Funds', allocation: 0.40, expected_return: 0.08, volatility: 0.15, annual_co2_tons: 2000 },
        { name: 'Bonds', allocation: 0.30, expected_return: 0.04, volatility: 0.06, annual_co2_tons: 500 },
        { name: 'Stocks', allocation: 0.20, expected_return: 0.10, volatility: 0.18, annual_co2_tons: 2500 },
        { name: 'Alternatives', allocation: 0.10, expected_return: 0.07, volatility: 0.20, annual_co2_tons: 1800 }
      ],
      aggressive: isGreen ? [
        { name: 'Clean Tech Stocks', allocation: 0.40, expected_return: 0.13, volatility: 0.24, annual_co2_tons: 75 },
        { name: 'Solar Energy Companies', allocation: 0.25, expected_return: 0.14, volatility: 0.26, annual_co2_tons: 40 },
        { name: 'Electric Vehicle Sector', allocation: 0.20, expected_return: 0.12, volatility: 0.23, annual_co2_tons: 100 },
        { name: 'Carbon Credit Futures', allocation: 0.15, expected_return: 0.10, volatility: 0.28, annual_co2_tons: 25 }
      ] : [
        { name: 'Growth Stocks', allocation: 0.50, expected_return: 0.12, volatility: 0.25, annual_co2_tons: 3000 },
        { name: 'Tech Stocks', allocation: 0.25, expected_return: 0.15, volatility: 0.30, annual_co2_tons: 2500 },
        { name: 'Emerging Markets', allocation: 0.15, expected_return: 0.10, volatility: 0.28, annual_co2_tons: 3500 },
        { name: 'Commodities', allocation: 0.10, expected_return: 0.08, volatility: 0.22, annual_co2_tons: 4000 }
      ]
    };
    
    return assetSets[riskTolerance].map(asset => ({
      ...asset,
      type: isGreen ? 'green' : 'traditional',
      value: Math.round(capital * asset.allocation * 100) / 100,
      annual_co2_tons: Math.round(asset.annual_co2_tons * asset.allocation),
      ...(isGreen && { esg_rating: randomBetween(0, 1) > 0.5 ? 'AAA' : 'AA', sdg_aligned: true })
    }));
  };

  const calcMetrics = (assets) => {
    const expectedReturn = assets.reduce((sum, a) => sum + a.expected_return * a.allocation, 0);
    const volatility = assets.reduce((sum, a) => sum + a.volatility * a.allocation, 0);
    const carbonFootprint = assets.reduce((sum, a) => sum + a.annual_co2_tons, 0);
    const sharpeRatio = (expectedReturn - 0.02) / volatility;
    return { expectedReturn, volatility, sharpeRatio, carbonFootprint };
  };

  const tradAssets = generateAssets(false);
  const greenAssets = generateAssets(true);
  const tradMetrics = calcMetrics(tradAssets);
  const greenMetrics = calcMetrics(greenAssets);

  const reduction = tradMetrics.carbonFootprint - greenMetrics.carbonFootprint;
  const reductionPct = (reduction / tradMetrics.carbonFootprint) * 100;

  return {
    timestamp: new Date().toISOString(),
    traditional_portfolio: {
      portfolio_type: 'traditional',
      total_value: capital,
      assets: tradAssets,
      expected_return: Math.round(tradMetrics.expectedReturn * 10000) / 10000,
      volatility: Math.round(tradMetrics.volatility * 10000) / 10000,
      sharpe_ratio: Math.round(tradMetrics.sharpeRatio * 1000) / 1000,
      annual_carbon_footprint: Math.round(tradMetrics.carbonFootprint)
    },
    green_portfolio: {
      portfolio_type: 'green',
      total_value: capital,
      assets: greenAssets,
      expected_return: Math.round(greenMetrics.expectedReturn * 10000) / 10000,
      volatility: Math.round(greenMetrics.volatility * 10000) / 10000,
      sharpe_ratio: Math.round(greenMetrics.sharpeRatio * 1000) / 1000,
      annual_carbon_footprint: Math.round(greenMetrics.carbonFootprint),
      carbon_neutrality_timeline_years: greenMetrics.carbonFootprint <= 100 ? 2 : greenMetrics.carbonFootprint <= 300 ? 5 : 8,
      sdg_alignment_score: 85
    },
    carbon_comparison: {
      traditional_emissions_tons: Math.round(tradMetrics.carbonFootprint),
      green_emissions_tons: Math.round(greenMetrics.carbonFootprint),
      reduction_tons: Math.round(reduction),
      reduction_percentage: Math.round(reductionPct * 10) / 10,
      net_zero_timeline_years: greenMetrics.carbonFootprint <= 100 ? 2 : greenMetrics.carbonFootprint <= 300 ? 5 : 8
    },
    recommendations: `Consider green portfolio for ${Math.round(reductionPct)}% lower carbon footprint with comparable returns`,
    status: 'success'
  };
};

export const mockMicroLoan = (applicantId, amount, purpose, additionalData) => {
  const mobileScore = randomBetween(50, 95);
  const greenScore = randomBetween(40, 90);
  const socialScore = randomBetween(55, 85);
  const compositeScore = mobileScore * 0.5 + greenScore * 0.3 + socialScore * 0.2;
  const approved = compositeScore >= 55;

  let interestRate = 0.08;
  let maxAmount = amount;
  if (compositeScore >= 80) { interestRate = 0.06; maxAmount = amount * 1.2; }
  else if (compositeScore >= 65) { interestRate = 0.08; }
  else if (compositeScore >= 55) { interestRate = 0.10; maxAmount = amount * 0.8; }
  else { interestRate = 0.12; maxAmount = amount * 0.5; }

  const approvedAmount = Math.min(amount, maxAmount);
  const termMonths = 24;
  const monthlyRate = interestRate / 12;
  const monthlyPayment = approvedAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  const totalRepayment = monthlyPayment * termMonths;

  const firstPayment = new Date();
  firstPayment.setDate(firstPayment.getDate() + 30);

  return {
    applicant_id: applicantId,
    timestamp: new Date().toISOString(),
    assessment: {
      applicant_id: applicantId,
      alternative_credit_score: Math.round(compositeScore * 100) / 100,
      mobile_payment_score: Math.round(mobileScore * 100) / 100,
      green_activity_score: Math.round(greenScore * 100) / 100,
      social_score: Math.round(socialScore * 100) / 100,
      approved,
      confidence_level: Math.round(randomBetween(0.75, 0.92) * 100) / 100,
      assessment_method: 'alternative_data'
    },
    loan_terms: {
      approved_amount: Math.round(approvedAmount * 100) / 100,
      interest_rate: Math.round(interestRate * 10000) / 10000,
      loan_term_months: termMonths,
      monthly_payment: Math.round(monthlyPayment * 100) / 100,
      total_repayment: Math.round(totalRepayment * 100) / 100,
      total_interest: Math.round((totalRepayment - approvedAmount) * 100) / 100,
      first_payment_date: firstPayment.toISOString().split('T')[0],
      special_terms: greenScore > 70 ? [
        'Green bonus: 0.5% interest rate reduction for maintaining solar generation',
        'Carbon credit: Earn credits for verified emission reductions',
        'Flexible repayment: Adjust payments based on seasonal income',
        'Financial literacy: Free access to online financial education'
      ] : [
        'Flexible repayment: Adjust payments based on seasonal income',
        'Financial literacy: Free access to online financial education'
      ]
    },
    approval_status: approved,
    status: 'success'
  };
};

export const mockGreenwashingCheck = (companyId) => {
  const envScore = randomInt(50, 95);
  const emissions = randomInt(500, 4000);
  const renewablePct = randomInt(10, 70);
  const trend = randomBetween(-0.1, 0.1);

  const anomalies = [];
  let riskFactors = 0;

  if (envScore > 80 && emissions > 3000) {
    anomalies.push({
      type: 'high_score_high_emissions',
      description: 'Environmental score is high but emissions are substantial',
      severity: 'medium'
    });
    riskFactors += 2;
  }

  if (envScore > 70 && renewablePct < 20) {
    anomalies.push({
      type: 'score_renewable_mismatch',
      description: 'High environmental score but low renewable energy usage',
      severity: 'high'
    });
    riskFactors += 3;
  }

  if (trend > 0.05 && envScore > 75) {
    anomalies.push({
      type: 'increasing_emissions_high_score',
      description: 'Emissions increasing while maintaining high environmental score',
      severity: 'high'
    });
    riskFactors += 3;
  }

  const riskIndex = Math.min(100, riskFactors * 15 + randomInt(0, 20));
  const riskLevel = riskIndex > 60 ? 'high' : riskIndex > 30 ? 'moderate' : 'low';

  const recommendations = [];
  if (riskIndex > 50) {
    recommendations.push('Request third-party verification of carbon claims');
    recommendations.push('Conduct detailed supply chain emissions audit');
  }
  if (riskIndex > 30) {
    recommendations.push('Monitor emissions data more frequently');
  }
  if (riskIndex <= 30) {
    recommendations.push('Continue current monitoring practices');
    recommendations.push('Consider publishing detailed sustainability reports');
  }

  return {
    company_id: companyId,
    timestamp: new Date().toISOString(),
    greenwashing_risk_index: riskIndex,
    risk_level: riskLevel,
    anomalies,
    anomaly_count: anomalies.length,
    recommendations,
    confidence: Math.round(randomBetween(0.75, 0.95) * 100) / 100,
    status: 'success'
  };
};
