import React, { useState } from 'react';
import { useAccounts, useWallets, useTransactions, useCategories } from '../hooks/useData';
import { AccountCard } from '../components/AccountCard';
import { TransactionItem } from '../components/TransactionItem';
import { TransactionForm } from './TransactionForm';
import { Modal } from '../components/Modal';
import { formatCurrency } from '../utils/helpers';
import './Dashboard.css';

interface DashboardProps {
  onCreateAccount: () => void;
  selectedAccountId: string | null;
  onSelectAccount: (id: string | null) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onCreateAccount,
  selectedAccountId,
  onSelectAccount 
}) => {
  const { accounts, loading: accountsLoading, deleteAccount } = useAccounts();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const { wallets, loading: walletsLoading } = useWallets(selectedAccountId);
  const { transactions, loading: txLoading, reloadTransactions } = useTransactions(selectedAccountId);
  const { categories } = useCategories(selectedAccountId);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  
  // Calculate totals
  const income = transactions
    .filter(tx => tx.type === 'income' || (tx.type === 'transfer' && tx.amount > 0))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expense = transactions
    .filter(tx => tx.type === 'expense' || (tx.type === 'transfer' && tx.amount < 0))
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount(id);
      if (selectedAccountId === id) {
        onSelectAccount(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  const handleTransactionFormClose = () => {
    setShowTransactionForm(false);
    reloadTransactions();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Accounts</h1>
        <button className="btn btn-primary" onClick={onCreateAccount}>+ New</button>
      </div>

      {accountsLoading ? (
        <div className="loading">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <p>No accounts yet</p>
          <button className="btn btn-primary" onClick={onCreateAccount}>Create Account</button>
        </div>
      ) : (
        <>
          <div className="accounts-list">
            {accounts.map(account => (
              <AccountCard
                key={account.id}
                account={account}
                isSelected={selectedAccountId === account.id}
                onClick={() => onSelectAccount(account.id)}
                onDelete={() => setDeleteConfirm(account.id)}
              />
            ))}
          </div>

          {selectedAccount && (
            <div className="account-details">
              <h2>{selectedAccount.name}</h2>

              {/* Wallets Section */}
              {walletsLoading ? (
                <div className="loading">Loading wallets...</div>
              ) : wallets.length > 0 && (
                <div className="section">
                  <h3>Wallets</h3>
                  <div className="wallets-grid">
                    {wallets.map(wallet => (
                      <div key={wallet.id} className="wallet-card">
                        <span className="wallet-type">{wallet.type}</span>
                        <span className="wallet-name">{wallet.name}</span>
                        <span className="wallet-balance">{formatCurrency(wallet.balance)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics Section */}
              {transactions.length > 0 && (
                <div className="section">
                  <h3>This Month</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <span className="stat-label">Income</span>
                      <span className="stat-value income">+{formatCurrency(income)}</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-label">Expense</span>
                      <span className="stat-value expense">-{formatCurrency(expense)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions Section */}
              {txLoading ? (
                <div className="loading">Loading transactions...</div>
              ) : transactions.length > 0 && (
                <div className="section">
                  <h3>Recent Transactions</h3>
                  <div className="transactions-list">
                    {transactions.slice(0, 5).map(tx => (
                      <TransactionItem
                        key={tx.id}
                        transaction={tx}
                        category={tx.categoryId ? categoryMap.get(tx.categoryId) : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Account?"
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
      >
        <div className="confirm-dialog">
          <p>This will permanently delete the account and all its data.</p>
          <div className="confirm-actions">
            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button
              className="btn btn-danger"
              onClick={() => deleteConfirm && handleDeleteAccount(deleteConfirm)}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showTransactionForm}
        onClose={handleTransactionFormClose}
        accountId={selectedAccountId}
      />

      {/* Floating Action Button */}
      {selectedAccountId && (
        <button
          className="fab"
          onClick={() => setShowTransactionForm(true)}
          title="Add transaction"
        >
          ➕
        </button>
      )}
    </div>
  );
};
