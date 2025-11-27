import axios from 'axios';
import { mockCreditAssessment, mockPortfolioOptimization, mockMicroLoan, mockGreenwashingCheck, mockSystemStatus } from './mockData';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const USE_MOCK = !API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  async getSystemStatus() {
    if (USE_MOCK) {
      await delay(500);
      return mockSystemStatus();
    }
    const response = await api.get('/api/v1/system/status');
    return response.data;
  },

  async assessCredit(entityId, entityType) {
    if (USE_MOCK) {
      await delay(1500);
      return mockCreditAssessment(entityId, entityType);
    }
    const response = await api.post('/api/v1/credit/assess', {
      entity_id: entityId,
      entity_type: entityType
    });
    return response.data;
  },

  async optimizePortfolio(capital, riskTolerance, targetReturn) {
    if (USE_MOCK) {
      await delay(2000);
      return mockPortfolioOptimization(capital, riskTolerance, targetReturn);
    }
    const response = await api.post('/api/v1/portfolio/optimize', {
      capital,
      risk_tolerance: riskTolerance,
      target_return: targetReturn
    });
    return response.data;
  },

  async applyMicroLoan(applicantId, amount, purpose, additionalData = {}) {
    if (USE_MOCK) {
      await delay(1800);
      return mockMicroLoan(applicantId, amount, purpose, additionalData);
    }
    const response = await api.post('/api/v1/loan/apply', {
      applicant_id: applicantId,
      amount,
      purpose,
      ...additionalData
    });
    return response.data;
  },

  async checkGreenwashing(companyId) {
    if (USE_MOCK) {
      await delay(1500);
      return mockGreenwashingCheck(companyId);
    }
    const response = await api.post('/api/v1/greenwashing/check', {
      company_id: companyId
    });
    return response.data;
  }
};

export default apiService;
