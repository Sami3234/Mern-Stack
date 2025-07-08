import React from 'react';
import './Logo.css';

function Logo({ size = 'medium', animated = true }) {
  return (
    <div className={`findify-logo ${size} ${animated ? 'animated' : ''}`}>
      <div className="logo-container">
        <div className="logo-icon">
          <div className="search-box">
            <div className="search-circle"></div>
            <div className="search-handle"></div>
          </div>
          <div className="numbers">
            <span className="num">1</span>
            <span className="num">2</span>
            <span className="num">3</span>
          </div>
        </div>
        <div className="logo-text">
          <span className="find">Find</span>
          <span className="ify">ify</span>
        </div>
      </div>
    </div>
  );
}

export default Logo; 