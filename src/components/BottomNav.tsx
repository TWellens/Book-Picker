import React from 'react';

export type Tab = 'home' | 'list' | 'settings';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',     label: 'Historie',      icon: '◈' },
  { id: 'list',     label: 'Buchliste',     icon: '≡' },
  { id: 'settings', label: 'Einstellungen', icon: '⚙' },
];

export const BottomNav: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <nav className="bottom-nav">
    <div className="bottom-nav__inner">
      {TABS.map(({ id, label, icon }) => (
        <button
          key={id}
          className={`bottom-nav__item${activeTab === id ? ' bottom-nav__item--active' : ''}`}
          onClick={() => onTabChange(id)}
        >
          <span className="bottom-nav__icon">{icon}</span>
          <span className="bottom-nav__label">{label}</span>
        </button>
      ))}
    </div>
  </nav>
);
