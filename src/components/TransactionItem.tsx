import React from 'react';
import type { Transaction, Category, Wallet } from '../types';
import { formatCurrency, formatTransactionDate } from '../utils/helpers';
import './TransactionItem.css';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  wallet?: Wallet;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  category,
  onEdit,
  onDelete,
}) => {
  const isIncome = transaction.type === 'income' || (transaction.type === 'transfer' && transaction.amount > 0);
  const isExpense = transaction.type === 'expense' || (transaction.type === 'transfer' && transaction.amount < 0);

  return (
    <div className="transaction-item">
      <div className="tx-main">
        <div className="tx-category" style={{ color: category?.color || '#6366f1' }}>
          {category?.icon || '📝'}
        </div>
        <div className="tx-info">
          <div className="tx-title">{transaction.title}</div>
          {transaction.notes && <div className="tx-notes">{transaction.notes}</div>}
          <div className="tx-date">{formatTransactionDate(transaction.date)}</div>
        </div>
      </div>
      
      <div className="tx-amount-actions">
        <span className={`tx-amount ${isIncome ? 'income' : isExpense ? 'expense' : ''}`}>
          {isIncome && '+'}{isExpense && '-'}{formatCurrency(Math.abs(transaction.amount))}
        </span>
        <div className="tx-actions">
          {onEdit && (
            <button className="action-btn" onClick={onEdit}>✏️</button>
          )}
          {onDelete && (
            <button className="action-btn" onClick={onDelete}>🗑️</button>
          )}
        </div>
      </div>
    </div>
  );
};
