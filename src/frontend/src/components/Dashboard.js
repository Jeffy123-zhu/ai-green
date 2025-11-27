import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  AreaChart, Area, PieChart, Pie, Cell, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const generateCarbonTrendData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    emissions: Math.max(100, 500 - i * 30 + Math.random() * 50),
    target: 500 - i * 35,
    offset: 50 + i * 10 + Math.random() * 20
  }));
};

const generateSectorData = () => [
  { name: 'renewable_energy', value: 35, color: '#00ff88' },
  { name: 'green_bonds', value: 25, color: '#00d4ff' },
  { name: 'sustainable_tech', value: 20, color: '#a855f7' },
  { name: 'esg_funds', value: 15, color: '#fbbf24' },
  { name: 'carbon_credits', value: 5, color: '#ef4444' }
];

const generateRecentActivities = () => [
  { id: 1, type: 'credit', entity: 'GreenTech_Corp', score: 85, time: '00:02:14' },
  { id: 2, type: 'loan', entity: 'Rural_Farm_Coop', amount: 15000, time: '00:05:32' },
  { id: 3, type: 'alert', entity: 'OilCo_Industries', risk: 'HIGH', time: '00:12:08' },
  { id: 4, type: 'portfolio', entity: 'investor_4521', return: 8.5, time: '00:18:45' },
  { id: 5, type: 'credit', entity: 'Solar_Solutions', score: 92, time: '00:25:11' }
];

function Dashboard() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carbonData, setCarbonData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalAssessments: 12847,
    carbonReduced: 523000,
    greenInvestments: 2100000000,
    loansApproved: 8934
  });

  useEffect(() => {
    fetchSystemStatus();
    setCarbonData(generateCarbonTrendData());
    setSectorData(generateSectorData());
    setActivities(generateRecentActivities());
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalAssessments: prev.totalAssessments + Math.floor(Math.random() * 3),
        carbonReduced: prev.carbonReduced + Math.floor(Math.random() * 100)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const data = await apiService.getSystemStatus();
      setSystemStatus(data);
    } catch (error) {
      setSystemStatus({
        status: 'operational',
        timestamp: new Date().toISOString(),
        agents: {
          data_collection: 'active',
          risk_assessment: 'active',
          portfolio_optimization: 'active',
          inclusion: 'active'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getActivityIcon = (type) => {
    const icons = { credit: 'CRDT', loan: 'LOAN', alert: 'ALRT', portfolio: 'PTFL' };
    return icons[type] || 'DATA';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>initializing_system...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="card hero-card">
        <h2>system_overview</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
          real-time carbon footprint analysis // intelligent financial services
        </p>

        <div className="metric-grid">
          <div className="metric-card highlight">
            <div className="metric-icon">[ASSESSMENTS]</div>
            <div className="metric-value">{formatNumber(stats.totalAssessments)}</div>
            <div className="metric-label">credit_assessments</div>
            <div className="metric-trend positive">+12% this_month</div>
          </div>
          <div className="metric-card highlight">
            <div className="metric-icon">[CO2_REDUCED]</div>
            <div className="metric-value">{formatNumber(stats.carbonReduced)}</div>
            <div className="metric-label">tons_co2_reduced</div>
            <div className="metric-trend positive">+8% this_month</div>
          </div>
          <div className="metric-card highlight">
            <div className="metric-icon">[INVESTMENTS]</div>
            <div className="metric-value">${formatNumber(stats.greenInvestments)}</div>
            <div className="metric-label">green_investments</div>
            <div className="metric-trend positive">+15% this_month</div>
          </div>
          <div className="metric-card highlight">
            <div className="metric-icon">[LOANS]</div>
            <div className="metric-value">{formatNumber(stats.loansApproved)}</div>
            <div className="metric-label">micro_loans_approved</div>
            <div className="metric-trend positive">+23% this_month</div>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card">
          <h3>carbon_emission_trends</h3>
          <div style={{ height: '300px', marginTop: '1rem' }}>
            <ResponsiveContainer>
              <AreaChart data={carbonData}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748b" tick={{ fontFamily: 'JetBrains Mono' }} />
                <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '4px', fontFamily: 'JetBrains Mono' }} />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }} />
                <Area type="monotone" dataKey="emissions" stroke="#ef4444" fillOpacity={1} fill="url(#colorEmissions)" name="emissions_tons" />
                <Line type="monotone" dataKey="target" stroke="#00d4ff" strokeDasharray="5 5" name="target" dot={false} />
                <Area type="monotone" dataKey="offset" stroke="#00ff88" fillOpacity={1} fill="url(#colorOffset)" name="carbon_offset" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <h3>investment_allocation</h3>
          <div style={{ height: '300px', marginTop: '1rem' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1a1f2e" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '4px', fontFamily: 'JetBrains Mono' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
            {sectorData.map((sector, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', background: sector.color }}></div>
                <span style={{ color: 'var(--text-muted)' }}>{sector.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card">
          <h3>system_status</h3>
          {systemStatus && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontFamily: 'JetBrains Mono' }}>
                <div style={{ width: '8px', height: '8px', background: '#00ff88', boxShadow: '0 0 10px #00ff88' }}></div>
                <span style={{ color: '#00ff88', fontSize: '0.85rem' }}>STATUS: OPERATIONAL</span>
              </div>
              <div className="agent-grid">
                {Object.entries(systemStatus.agents || {}).map(([agent, status]) => (
                  <div key={agent} className="agent-card">
                    <div className="agent-icon">[{agent.split('_')[0].toUpperCase().slice(0,4)}]</div>
                    <div className="agent-name">{agent}</div>
                    <div className={`agent-status ${status}`}>{status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3>activity_log</h3>
          <div className="activity-list">
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">[{getActivityIcon(activity.type)}]</div>
                <div className="activity-content">
                  <div className="activity-title">
                    {activity.type === 'credit' && `credit_assessment: ${activity.entity}`}
                    {activity.type === 'loan' && `loan_approved: ${activity.entity}`}
                    {activity.type === 'alert' && `greenwashing_alert: ${activity.entity}`}
                    {activity.type === 'portfolio' && `portfolio_optimized: ${activity.entity}`}
                  </div>
                  <div className="activity-detail">
                    {activity.type === 'credit' && `score: ${activity.score}/100`}
                    {activity.type === 'loan' && `amount: $${activity.amount.toLocaleString()}`}
                    {activity.type === 'alert' && <span style={{ color: '#ef4444' }}>risk_level: {activity.risk}</span>}
                    {activity.type === 'portfolio' && `return: ${activity.return}%`}
                  </div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>sdg_alignment</h3>
        <div className="sdg-grid">
          <div className="sdg-card sdg-7">
            <div className="sdg-number">7</div>
            <div className="sdg-title">affordable_clean_energy</div>
            <div className="sdg-progress"><div className="sdg-progress-bar" style={{ width: '78%' }}></div></div>
            <div className="sdg-stat">alignment: 78%</div>
          </div>
          <div className="sdg-card sdg-8">
            <div className="sdg-number">8</div>
            <div className="sdg-title">decent_work_economic_growth</div>
            <div className="sdg-progress"><div className="sdg-progress-bar" style={{ width: '85%' }}></div></div>
            <div className="sdg-stat">alignment: 85%</div>
          </div>
          <div className="sdg-card sdg-13">
            <div className="sdg-number">13</div>
            <div className="sdg-title">climate_action</div>
            <div className="sdg-progress"><div className="sdg-progress-bar" style={{ width: '92%' }}></div></div>
            <div className="sdg-stat">alignment: 92%</div>
          </div>
          <div className="sdg-card sdg-17">
            <div className="sdg-number">17</div>
            <div className="sdg-title">partnerships_for_goals</div>
            <div className="sdg-progress"><div className="sdg-progress-bar" style={{ width: '71%' }}></div></div>
            <div className="sdg-stat">alignment: 71%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
