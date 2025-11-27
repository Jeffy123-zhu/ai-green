import React, { useState } from 'react';
import { apiService } from '../services/api';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Legend, LineChart, Line, CartesianGrid 
} from 'recharts';

const COLORS = ['#00ff88', '#00d4ff', '#a855f7', '#fbbf24', '#ef4444', '#38b2ac'];

function PortfolioOptimizer() {
  const [capital, setCapital] = useState('100000');
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [targetReturn, setTargetReturn] = useState('0.08');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('comparison');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiService.optimizePortfolio(parseFloat(capital), riskTolerance, parseFloat(targetReturn));
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'optimization_failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  const getComparisonData = () => {
    if (!result) return [];
    return [
      { metric: 'return', traditional: (result.traditional_portfolio.expected_return * 100).toFixed(2), green: (result.green_portfolio.expected_return * 100).toFixed(2) },
      { metric: 'volatility', traditional: (result.traditional_portfolio.volatility * 100).toFixed(2), green: (result.green_portfolio.volatility * 100).toFixed(2) },
      { metric: 'sharpe', traditional: result.traditional_portfolio.sharpe_ratio.toFixed(2), green: result.green_portfolio.sharpe_ratio.toFixed(2) },
      { metric: 'co2_tons', traditional: result.traditional_portfolio.annual_carbon_footprint.toFixed(0), green: result.green_portfolio.annual_carbon_footprint.toFixed(0) }
    ];
  };

  const getCarbonProjection = () => {
    if (!result) return [];
    const years = [];
    let trad = result.carbon_comparison.traditional_emissions_tons;
    let green = result.carbon_comparison.green_emissions_tons;
    for (let i = 0; i <= 10; i++) {
      years.push({ year: `Y${i}`, traditional: Math.round(trad), green: Math.round(green), net_zero: 0 });
      trad *= 0.95;
      green *= 0.85;
    }
    return years;
  };

  const renderPortfolio = (portfolio, title, isGreen = false) => {
    const pieData = portfolio.assets.map(a => ({ name: a.name, value: a.allocation * 100, amount: a.value }));
    return (
      <div className="portfolio-section">
        <div className="portfolio-header">
          <h4 style={{ fontFamily: 'JetBrains Mono' }}>{isGreen ? '[GREEN]' : '[TRAD]'} {title}</h4>
          <div className="portfolio-badges">
            <span className="badge-metric">return: {(portfolio.expected_return * 100).toFixed(2)}%</span>
            <span className="badge-metric">risk: {(portfolio.volatility * 100).toFixed(2)}%</span>
            <span className={`badge-metric ${isGreen ? 'green' : ''}`}>co2: {portfolio.annual_carbon_footprint.toFixed(0)}t</span>
          </div>
        </div>
        <div className="portfolio-content">
          <div className="portfolio-chart">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#1a1f2e" strokeWidth={2} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2d3748', fontFamily: 'JetBrains Mono' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="portfolio-assets">
            {portfolio.assets.map((asset, i) => (
              <div key={i} className="asset-row">
                <div className="asset-color" style={{ background: COLORS[i % COLORS.length] }}></div>
                <div className="asset-info">
                  <div className="asset-name">{asset.name.toLowerCase().replace(/ /g, '_')}{asset.esg_rating && <span className="esg-badge">{asset.esg_rating}</span>}</div>
                  <div className="asset-details">{(asset.allocation * 100).toFixed(1)}% | {formatCurrency(asset.value)}</div>
                </div>
                <div className="asset-metrics"><span className="metric-small">+{(asset.expected_return * 100).toFixed(1)}%</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="portfolio-optimizer">
      <div className="card">
        <h2>portfolio_optimization</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>// generate optimized portfolios with carbon neutrality pathways</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row three-col">
            <div className="form-group">
              <label>investment_capital</label>
              <input type="number" value={capital} onChange={(e) => setCapital(e.target.value)} min="1000" step="1000" required />
            </div>
            <div className="form-group">
              <label>risk_tolerance</label>
              <select value={riskTolerance} onChange={(e) => setRiskTolerance(e.target.value)}>
                <option value="conservative">conservative</option>
                <option value="moderate">moderate</option>
                <option value="aggressive">aggressive</option>
              </select>
            </div>
            <div className="form-group">
              <label>target_return: {(parseFloat(targetReturn) * 100).toFixed(0)}%</label>
              <input type="range" value={targetReturn} onChange={(e) => setTargetReturn(e.target.value)} min="0.03" max="0.20" step="0.01" />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'optimizing...' : 'generate_portfolios'}</button>
        </form>
        {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
      </div>

      {result && result.status === 'success' && (
        <>
          <div className="card impact-hero">
            <h3>carbon_impact_analysis</h3>
            <div className="impact-grid">
              <div className="impact-stat">
                <div className="impact-icon">[REDUCTION]</div>
                <div className="impact-value" style={{ color: '#00ff88' }}>{result.carbon_comparison.reduction_tons.toFixed(0)}</div>
                <div className="impact-label">tons_co2_reduced</div>
              </div>
              <div className="impact-stat">
                <div className="impact-icon">[PERCENT]</div>
                <div className="impact-value" style={{ color: '#00d4ff' }}>{result.carbon_comparison.reduction_percentage.toFixed(1)}%</div>
                <div className="impact-label">emission_reduction</div>
              </div>
              <div className="impact-stat">
                <div className="impact-icon">[TIMELINE]</div>
                <div className="impact-value" style={{ color: '#a855f7' }}>{result.carbon_comparison.net_zero_timeline_years}</div>
                <div className="impact-label">years_to_net_zero</div>
              </div>
            </div>
            <div className="impact-recommendation">{result.recommendations}</div>
          </div>

          <div className="card">
            <div className="tab-nav">
              <button className={activeTab === 'comparison' ? 'active' : ''} onClick={() => setActiveTab('comparison')}>comparison</button>
              <button className={activeTab === 'traditional' ? 'active' : ''} onClick={() => setActiveTab('traditional')}>traditional</button>
              <button className={activeTab === 'green' ? 'active' : ''} onClick={() => setActiveTab('green')}>green</button>
              <button className={activeTab === 'projection' ? 'active' : ''} onClick={() => setActiveTab('projection')}>projection</button>
            </div>

            {activeTab === 'comparison' && (
              <div className="comparison-view">
                <h4 style={{ fontFamily: 'JetBrains Mono', marginBottom: '1rem' }}>portfolio_comparison</h4>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer>
                    <BarChart data={getComparisonData()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                      <XAxis type="number" stroke="#64748b" tick={{ fontFamily: 'JetBrains Mono' }} />
                      <YAxis type="category" dataKey="metric" stroke="#64748b" width={80} tick={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2d3748', fontFamily: 'JetBrains Mono' }} />
                      <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono' }} />
                      <Bar dataKey="traditional" name="traditional" fill="#64748b" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="green" name="green" fill="#00ff88" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {activeTab === 'traditional' && renderPortfolio(result.traditional_portfolio, 'traditional_portfolio')}
            {activeTab === 'green' && renderPortfolio(result.green_portfolio, 'green_portfolio', true)}
            {activeTab === 'projection' && (
              <div className="projection-view">
                <h4 style={{ fontFamily: 'JetBrains Mono', marginBottom: '1rem' }}>10_year_carbon_projection</h4>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer>
                    <LineChart data={getCarbonProjection()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                      <XAxis dataKey="year" stroke="#64748b" tick={{ fontFamily: 'JetBrains Mono' }} />
                      <YAxis stroke="#64748b" tick={{ fontFamily: 'JetBrains Mono' }} />
                      <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2d3748', fontFamily: 'JetBrains Mono' }} />
                      <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono' }} />
                      <Line type="monotone" dataKey="traditional" stroke="#64748b" strokeWidth={2} name="traditional" />
                      <Line type="monotone" dataKey="green" stroke="#00ff88" strokeWidth={2} name="green" />
                      <Line type="monotone" dataKey="net_zero" stroke="#ef4444" strokeDasharray="5 5" name="net_zero_target" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PortfolioOptimizer;
