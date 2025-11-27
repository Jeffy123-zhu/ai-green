import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import CreditAssessment from './components/CreditAssessment';
import PortfolioOptimizer from './components/PortfolioOptimizer';
import MicroLoan from './components/MicroLoan';
import GreenwashingDetector from './components/GreenwashingDetector';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'credit':
        return <CreditAssessment />;
      case 'portfolio':
        return <PortfolioOptimizer />;
      case 'loan':
        return <MicroLoan />;
      case 'greenwashing':
        return <GreenwashingDetector />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">
          <h1>GreenPulse_AI</h1>
          <p className="tagline">carbon-aware financial intelligence system</p>
        </div>
        <nav className="main-nav">
          <button 
            className={activeView === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveView('dashboard')}
          >
            dashboard
          </button>
          <button 
            className={activeView === 'credit' ? 'active' : ''}
            onClick={() => setActiveView('credit')}
          >
            credit
          </button>
          <button 
            className={activeView === 'portfolio' ? 'active' : ''}
            onClick={() => setActiveView('portfolio')}
          >
            portfolio
          </button>
          <button 
            className={activeView === 'loan' ? 'active' : ''}
            onClick={() => setActiveView('loan')}
          >
            loans
          </button>
          <button 
            className={activeView === 'greenwashing' ? 'active' : ''}
            onClick={() => setActiveView('greenwashing')}
          >
            detector
          </button>
        </nav>
      </header>
      <main className="App-main">
        {renderView()}
      </main>
      <footer className="App-footer">
        <p>// building a sustainable financial future through artificial intelligence</p>
        <p className="sdg-badges">
          <span>SDG_7</span>
          <span>SDG_8</span>
          <span>SDG_13</span>
          <span>SDG_17</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
