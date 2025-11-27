import React, { useState } from 'react';
import { apiService } from '../services/api';

function MicroLoan() {
  const [applicantId, setApplicantId] = useState('');
  const [amount, setAmount] = useState('5000');
  const [purpose, setPurpose] = useState('business');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiService.applyMicroLoan(applicantId, parseFloat(amount), purpose, {
        mobile_payment_history: [],
        green_activities: { has_solar_panels: Math.random() > 0.5, organic_farming: Math.random() > 0.6, sustainable_practices: ['water_conservation', 'waste_reduction'] },
        social_data: { community_member: true, business_references: Math.floor(Math.random() * 5), years_in_community: Math.floor(Math.random() * 15) + 1 }
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'loan_processing_failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);

  return (
    <div className="micro-loan">
      <div className="card">
        <h2>micro_loan_application</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
          // financial inclusion through alternative credit assessment
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="applicantId">applicant_id</label>
            <input type="text" id="applicantId" value={applicantId} onChange={(e) => setApplicantId(e.target.value)} placeholder="enter_id_or_phone" required />
          </div>
          <div className="form-group">
            <label htmlFor="amount">loan_amount</label>
            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} min="500" max="50000" step="500" required />
          </div>
          <div className="form-group">
            <label htmlFor="purpose">loan_purpose</label>
            <select id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option value="business">business_expansion</option>
              <option value="agriculture">agricultural_equipment</option>
              <option value="education">education</option>
              <option value="renewable">renewable_energy</option>
              <option value="other">other</option>
            </select>
          </div>
          <div style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid var(--accent-cyan)', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
            [INFO] using alternative data sources: mobile_payment_history, green_activities, community_references
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'processing...' : 'submit_application'}</button>
        </form>
        {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
      </div>

      {result && result.status === 'success' && (
        <>
          <div className="card">
            <h3>application_status</h3>
            {result.approval_status ? (
              <div className="success">[APPROVED] loan application has been approved</div>
            ) : (
              <div className="error">[PENDING] application requires additional review</div>
            )}
          </div>

          {result.approval_status && (
            <>
              <div className="card">
                <h3>alternative_credit_assessment</h3>
                <div className="metric-grid">
                  <div className="metric-card">
                    <div className="metric-icon">[SCORE]</div>
                    <div className="metric-value">{result.assessment.alternative_credit_score.toFixed(0)}</div>
                    <div className="metric-label">credit_score</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">[MOBILE]</div>
                    <div className="metric-value">{result.assessment.mobile_payment_score.toFixed(0)}</div>
                    <div className="metric-label">payment_history</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">[GREEN]</div>
                    <div className="metric-value">{result.assessment.green_activity_score.toFixed(0)}</div>
                    <div className="metric-label">green_activities</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">[SOCIAL]</div>
                    <div className="metric-value">{result.assessment.social_score.toFixed(0)}</div>
                    <div className="metric-label">social_score</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>loan_terms</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {[
                    ['approved_amount', formatCurrency(result.loan_terms.approved_amount)],
                    ['interest_rate', `${(result.loan_terms.interest_rate * 100).toFixed(2)}% APR`],
                    ['loan_term', `${result.loan_terms.loan_term_months} months`],
                    ['monthly_payment', formatCurrency(result.loan_terms.monthly_payment)],
                    ['first_payment', result.loan_terms.first_payment_date]
                  ].map(([label, value], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <strong style={{ color: 'var(--accent-green)' }}>{value}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,255,136,0.1)', border: '1px solid var(--accent-green)', borderRadius: '4px', fontFamily: 'JetBrains Mono' }}>
                  <strong style={{ color: 'var(--accent-green)' }}>total_repayment:</strong>{' '}
                  <span style={{ fontSize: '1.1rem', color: 'var(--accent-green)' }}>{formatCurrency(result.loan_terms.total_repayment)}</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    (includes {formatCurrency(result.loan_terms.total_interest)} interest)
                  </div>
                </div>
              </div>

              {result.loan_terms.special_terms && result.loan_terms.special_terms.length > 0 && (
                <div className="card">
                  <h3>special_terms</h3>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
                    {result.loan_terms.special_terms.map((term, index) => (
                      <div key={index} style={{ padding: '0.5rem 0', borderBottom: '1px dashed var(--border-color)', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>[{index + 1}]</span> {term}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MicroLoan;
