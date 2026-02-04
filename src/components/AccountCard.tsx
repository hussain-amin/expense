import React from 'react';
import type { Account } from '../types';
import { formatCurrency } from '../utils/helpers';
import './AccountCard.css';

interface AccountCardProps {
  account: Account;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`account-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        borderColor: account.color || '#6366f1',
      }}
    >
      <div className="card-header">
        <div className="card-title">
          <h3>{account.name}</h3>
          {account.description && <p>{account.description}</p>}
        </div>
        <div className="card-actions">
          {onEdit && (
            <button className="action-btn" onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}>✏️</button>
          )}
          {onDelete && (
            <button className="action-btn danger" onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}>🗑️</button>
          )}
        </div>
      </div>
      <div className="card-balance">
        <span className="label">Balance</span>
        <span className="amount">{formatCurrency(account.balance)}</span>
      </div>
    </div>
  );
};
