import React, { useState } from 'react';
import { apiService } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function GreenwashingDetector() {
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiService.checkGreenwashing(companyId);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'analysis_failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = { high: '#ef4444', moderate: '#fbbf24', low: '#00ff88' };
    return colors[level] || '#00ff88';
  };

  const getRiskGaugeData = (riskIndex) => [
    { name: 'risk', value: riskIndex },
    { name: 'safe', value: 100 - riskIndex }
  ];

  const getAnomalyChartData = (anomalies) => {
    const severityCount = { high: 0, medium: 0, low: 0 };
    anomalies.forEach(a => { severityCount[a.severity] = (severityCount[a.severity] || 0) + 1; });
    return [
      { name: 'HIGH', count: severityCount.high, fill: '#ef4444' },
      { name: 'MED', count: severityCount.medium, fill: '#fbbf24' },
      { name: 'LOW', count: severityCount.low, fill: '#00ff88' }
    ];
  };

  return (
    <div className="greenwashing-detector">
      <div className="card">
        <h2>greenwashing_detection</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
          // verify corporate sustainability claims against actual carbon performance
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyId">company_id</label>
            <input type="text" id="companyId" value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="enter_company_identifier" required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'analyzing...' : 'run_detection'}</button>
        </form>
        {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
      </div>

      {result && result.status === 'success' && (
        <>
          <div className="card">
            <h3>risk_assessment</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ width: '200px', height: '200px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={getRiskGaugeData(result.greenwashing_risk_index)} cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={180} endAngle={0} dataKey="value">
                      <Cell fill={getRiskColor(result.risk_level)} />
                      <Cell fill="#2d3748" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ textAlign: 'center', marginTop: '-60px', fontFamily: 'JetBrains Mono' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getRiskColor(result.risk_level), textShadow: `0 0 20px ${getRiskColor(result.risk_level)}` }}>
                    {result.greenwashing_risk_index}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>risk_index</div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ padding: '1.25rem', background: `${getRiskColor(result.risk_level)}15`, border: `1px solid ${getRiskColor(result.risk_level)}`, borderRadius: '4px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.25rem', fontWeight: 'bold', color: getRiskColor(result.risk_level), textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    [{result.risk_level}_RISK]
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
                    {result.risk_level === 'high' ? 'significant discrepancies detected between claims and actual data' :
                     result.risk_level === 'moderate' ? 'some inconsistencies found that warrant investigation' :
                     'claims appear consistent with actual performance data'}
                  </p>
                </div>

                <div className="metric-grid" style={{ marginTop: '1rem' }}>
                  <div className="metric-card">
                    <div className="metric-icon">[ANOMALIES]</div>
                    <div className="metric-value">{result.anomaly_count}</div>
                    <div className="metric-label">detected</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">[CONFIDENCE]</div>
                    <div className="metric-value">{(result.confidence * 100).toFixed(0)}%</div>
                    <div className="metric-label">accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {result.anomalies && result.anomalies.length > 0 && (
            <div className="card">
              <h3>detected_anomalies</h3>
              <div style={{ height: '180px', marginBottom: '1.5rem' }}>
                <ResponsiveContainer>
                  <BarChart data={getAnomalyChartData(result.anomalies)}>
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
                    <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontFamily: 'JetBrains Mono' }} />
                    <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2d3748', fontFamily: 'JetBrains Mono' }} />
                    <Bar dataKey="count" name="count">
                      {getAnomalyChartData(result.anomalies).map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.anomalies.map((anomaly, index) => (
                  <div key={index} style={{ padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: `3px solid ${anomaly.severity === 'high' ? '#ef4444' : anomaly.severity === 'medium' ? '#fbbf24' : '#00ff88'}`, borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'JetBrains Mono' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{anomaly.type}</strong>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '2px', fontSize: '0.7rem', fontWeight: '600', background: `${anomaly.severity === 'high' ? '#ef4444' : anomaly.severity === 'medium' ? '#fbbf24' : '#00ff88'}20`, color: anomaly.severity === 'high' ? '#ef4444' : anomaly.severity === 'medium' ? '#fbbf24' : '#00ff88', border: `1px solid ${anomaly.severity === 'high' ? '#ef4444' : anomaly.severity === 'medium' ? '#fbbf24' : '#00ff88'}` }}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0, fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>{anomaly.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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

export default GreenwashingDetector;
