import React, { useState } from 'react';
import { apiService } from '../services/api';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

function CreditAssessment() {
  const [entityId, setEntityId] = useState('');
  const [entityType, setEntityType] = useState('company');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiService.assessCredit(entityId, entityType);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'assessment_failed: connection_error');
    } finally {
      setLoading(false);
    }
  };

  const getRatingConfig = (rating) => {
    const configs = {
      'AAA': { color: '#00ff88', bg: 'rgba(0,255,136,0.15)', label: 'EXCELLENT' },
      'AA': { color: '#00d4ff', bg: 'rgba(0,212,255,0.15)', label: 'VERY_GOOD' },
      'A': { color: '#a855f7', bg: 'rgba(168,85,247,0.15)', label: 'GOOD' },
      'BBB': { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', label: 'FAIR' },
      'BB': { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'BELOW_AVG' }
    };
    return configs[rating] || configs['BBB'];
  };

  const getRadarData = (result) => {
    if (!result) return [];
    return [
      { subject: 'financial', value: result.risk_analysis?.traditional_risk?.risk_score || 0, fullMark: 100 },
      { subject: 'carbon', value: result.carbon_score || 0, fullMark: 100 },
      { subject: 'esg', value: result.risk_analysis?.esg_risk?.esg_risk_score || 0, fullMark: 100 },
      { subject: 'regulatory', value: result.risk_analysis?.carbon_risk?.carbon_risk_score || 0, fullMark: 100 },
      { subject: 'transition', value: result.risk_analysis?.carbon_risk?.transition_readiness === 'strong' ? 85 : 55, fullMark: 100 }
    ];
  };

  const getScoreBreakdown = (result) => {
    if (!result) return [];
    return [
      { name: 'traditional', score: result.credit_rating?.traditional_score || 0, fill: '#00d4ff' },
      { name: 'carbon', score: result.carbon_score || 0, fill: '#00ff88' },
      { name: 'esg', score: result.risk_analysis?.esg_risk?.esg_risk_score || 0, fill: '#a855f7' },
      { name: 'combined', score: result.credit_rating?.combined_score || 0, fill: '#fbbf24' }
    ];
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#00ff88';
    if (score >= 60) return '#00d4ff';
    if (score >= 40) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div className="credit-assessment">
      <div className="card">
        <h2>carbon_credit_assessment</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
          // real-time credit evaluation combining traditional metrics with carbon footprint analysis
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="entityId">entity_id</label>
              <input type="text" id="entityId" value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="enter_company_or_individual_id" required />
            </div>
            <div className="form-group">
              <label htmlFor="entityType">entity_type</label>
              <select id="entityType" value={entityType} onChange={(e) => setEntityType(e.target.value)}>
                <option value="company">company</option>
                <option value="individual">individual</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (<><span className="spinner"></span>analyzing...</>) : 'run_assessment'}
          </button>
        </form>
        {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
      </div>

      {result && result.status === 'success' && (
        <>
          <div className="card rating-hero">
            <div className="rating-display">
              <div className="rating-badge-large" style={{ background: getRatingConfig(result.credit_rating.rating).bg, color: getRatingConfig(result.credit_rating.rating).color, border: `2px solid ${getRatingConfig(result.credit_rating.rating).color}` }}>
                {result.credit_rating.rating}
              </div>
              <div className="rating-info">
                <div className="rating-label" style={{ fontFamily: 'JetBrains Mono' }}>status: {getRatingConfig(result.credit_rating.rating).label}</div>
                <div className="rating-score" style={{ fontFamily: 'JetBrains Mono' }}>combined_score: <strong style={{ color: 'var(--accent-green)' }}>{result.credit_rating.combined_score}</strong>/100</div>
                <div className="rating-adjustment" style={{ color: result.credit_rating.interest_rate_adjustment < 0 ? '#00ff88' : '#ef4444', fontFamily: 'JetBrains Mono' }}>
                  interest_rate_adj: {result.credit_rating.interest_rate_adjustment > 0 ? '+' : ''}{(result.credit_rating.interest_rate_adjustment * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          <div className="charts-row">
            <div className="card chart-card">
              <h3>risk_profile_radar</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer>
                  <RadarChart data={getRadarData(result)}>
                    <PolarGrid stroke="#2d3748" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontFamily: 'JetBrains Mono' }} />
                    <Radar name="score" dataKey="value" stroke="#00ff88" fill="#00ff88" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card chart-card">
              <h3>score_breakdown</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer>
                  <BarChart data={getScoreBreakdown(result)} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontFamily: 'JetBrains Mono' }} />
                    <YAxis type="category" dataKey="name" stroke="#64748b" width={80} tick={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2d3748', fontFamily: 'JetBrains Mono' }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {getScoreBreakdown(result).map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>detailed_risk_analysis</h3>
            <div className="analysis-grid">
              <div className="analysis-card">
                <div className="analysis-header">
                  <span className="analysis-icon">TRAD</span>
                  <span className="analysis-title">traditional_risk</span>
                </div>
                <div className="analysis-score" style={{ color: getScoreColor(result.risk_analysis.traditional_risk.risk_score) }}>
                  {result.risk_analysis.traditional_risk.risk_score.toFixed(1)}
                </div>
                <div className="analysis-details">
                  <div className="detail-row"><span>revenue</span><span className={`badge ${result.risk_analysis.traditional_risk.revenue_assessment}`}>{result.risk_analysis.traditional_risk.revenue_assessment}</span></div>
                  <div className="detail-row"><span>profitability</span><span className={`badge ${result.risk_analysis.traditional_risk.profitability_assessment}`}>{result.risk_analysis.traditional_risk.profitability_assessment}</span></div>
                  <div className="detail-row"><span>leverage</span><span className={`badge ${result.risk_analysis.traditional_risk.leverage_assessment}`}>{result.risk_analysis.traditional_risk.leverage_assessment}</span></div>
                  <div className="detail-row"><span>default_history</span><span className={`badge ${result.risk_analysis.traditional_risk.default_history === 'clean' ? 'strong' : 'concerning'}`}>{result.risk_analysis.traditional_risk.default_history}</span></div>
                </div>
              </div>

              <div className="analysis-card">
                <div className="analysis-header">
                  <span className="analysis-icon">CO2</span>
                  <span className="analysis-title">carbon_risk</span>
                </div>
                <div className="analysis-score" style={{ color: getScoreColor(result.risk_analysis.carbon_risk.carbon_risk_score) }}>
                  {result.risk_analysis.carbon_risk.carbon_risk_score}
                </div>
                <div className="analysis-details">
                  <div className="detail-row"><span>emission_intensity</span><span className={`badge ${result.risk_analysis.carbon_risk.emission_intensity === 'moderate' ? 'moderate' : 'concerning'}`}>{result.risk_analysis.carbon_risk.emission_intensity}</span></div>
                  <div className="detail-row"><span>trend</span><span className={`badge ${result.risk_analysis.carbon_risk.trend_direction === 'improving' ? 'strong' : 'concerning'}`}>{result.risk_analysis.carbon_risk.trend_direction}</span></div>
                  <div className="detail-row"><span>transition_readiness</span><span className={`badge ${result.risk_analysis.carbon_risk.transition_readiness === 'strong' ? 'strong' : 'moderate'}`}>{result.risk_analysis.carbon_risk.transition_readiness}</span></div>
                  <div className="detail-row"><span>regulatory_risk</span><span className={`badge ${result.risk_analysis.carbon_risk.regulatory_risk}`}>{result.risk_analysis.carbon_risk.regulatory_risk}</span></div>
                </div>
              </div>

              <div className="analysis-card">
                <div className="analysis-header">
                  <span className="analysis-icon">ESG</span>
                  <span className="analysis-title">esg_score</span>
                </div>
                <div className="analysis-score" style={{ color: getScoreColor(result.risk_analysis.esg_risk.esg_risk_score) }}>
                  {result.risk_analysis.esg_risk.esg_risk_score}
                </div>
                <div className="analysis-details">
                  <div className="detail-row"><span>environmental</span><span className={`badge ${result.risk_analysis.esg_risk.environmental_rating}`}>{result.risk_analysis.esg_risk.environmental_rating}</span></div>
                  <div className="detail-row"><span>social</span><span className={`badge ${result.risk_analysis.esg_risk.social_rating}`}>{result.risk_analysis.esg_risk.social_rating}</span></div>
                  <div className="detail-row"><span>governance</span><span className={`badge ${result.risk_analysis.esg_risk.governance_rating}`}>{result.risk_analysis.esg_risk.governance_rating}</span></div>
                  <div className="detail-row"><span>sdg_aligned</span><span className="badge strong">{result.risk_analysis.esg_risk.sdg_aligned_count} goals</span></div>
                </div>
              </div>
            </div>
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="card">
              <h3>recommendations</h3>
              <div className="recommendations-list">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <span className="rec-number">{index + 1}</span>
                    <span className="rec-text">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CreditAssessment;
