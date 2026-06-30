import React from 'react';

export const Header: React.FC = () => (
  <header className="app-header">
    <div className="app-header__logo">
      <svg className="app-header__book-icon" width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="1" width="9" height="13" fill="#c49a4a" />
        <rect x="2" y="1" width="2" height="13" fill="#7a5430" />
        <rect x="11" y="1" width="1" height="13" fill="#7a5430" />
        <rect x="4" y="4" width="6" height="1" fill="#0f1d1f" />
        <rect x="4" y="6" width="4" height="1" fill="#0f1d1f" />
      </svg>
      <span className="app-header__logo-text">COSY CRIME</span>
    </div>
    <div className="app-header__menu" aria-hidden="true">
      <span className="app-header__dot" />
      <span className="app-header__dot" />
      <span className="app-header__dot" />
    </div>
  </header>
);
