import React from 'react';
import './BottomNav.css';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

interface BottomNavProps {
  items: NavItem[];
  onSelect: (id: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ items, onSelect }) => {
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`nav-item ${item.active ? 'active' : ''}`}
          onClick={() => onSelect(item.id)}
          aria-label={item.label}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
