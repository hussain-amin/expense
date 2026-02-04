import { useState } from 'react';
import type { Wallet } from '../types';
import { useAccounts } from '../hooks/useData';
import { useWallets } from '../hooks/useData';
import { WalletForm } from './WalletForm';
import { formatCurrency } from '../utils/helpers';
import './WalletsPage.css';

interface WalletsPageProps {
  selectedAccountId: string | null;
  onSelectAccount: (id: string | null) => void;
}

export function WalletsPage({ selectedAccountId, onSelectAccount }: WalletsPageProps) {
  const { accounts } = useAccounts();
  const { wallets, deleteWallet, reloadWallets } = useWallets(selectedAccountId);
  
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const getWalletIcon = (type: Wallet['type']) => {
    switch (type) {
      case 'cash': return '💵';
      case 'bank': return '🏦';
      case 'card': return '💳';
      default: return '👛';
    }
  };

  const handleEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setShowForm(true);
  };

  const handleDelete = async (wallet: Wallet) => {
    if (confirm(`Delete "${wallet.name}"? All transactions in this wallet will be deleted.`)) {
      await deleteWallet(wallet.id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingWallet(null);
    reloadWallets();
  };

  return (
    <div className="wallets-page">
      <header className="page-header">
        <h1>Wallets</h1>
        {selectedAccountId && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Add
          </button>
        )}
      </header>

      {/* Account Selector */}
      <div className="account-selector">
        <select
          value={selectedAccountId || ''}
          onChange={(e) => onSelectAccount(e.target.value || null)}
        >
          <option value="">Select Account</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
      </div>

      {selectedAccountId && selectedAccount ? (
        <>
          {/* Total Balance */}
          <div className="total-balance-card" style={{ borderColor: selectedAccount.color || '#6366f1' }}>
            <span className="balance-label">Total Balance</span>
            <span className="balance-value">{formatCurrency(totalBalance)}</span>
            <span className="balance-account">{selectedAccount.name}</span>
          </div>

          {/* Wallets List */}
          <div className="wallets-list">
            {wallets.length === 0 ? (
              <div className="empty-state">
                <p>No wallets yet</p>
                <button className="btn-primary" onClick={() => setShowForm(true)}>
                  Create your first wallet
                </button>
              </div>
            ) : (
              wallets.map(wallet => (
                <div key={wallet.id} className="wallet-card">
                  <div className="wallet-main">
                    <span className="wallet-icon">{getWalletIcon(wallet.type)}</span>
                    <div className="wallet-info">
                      <span className="wallet-name">{wallet.name}</span>
                      <span className="wallet-type">{wallet.type}</span>
                    </div>
                    <span className={`wallet-balance ${wallet.balance >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(wallet.balance)}
                    </span>
                  </div>
                  <div className="wallet-actions">
                    <button className="btn-icon" onClick={() => handleEdit(wallet)}>✏️</button>
                    <button className="btn-icon danger" onClick={() => handleDelete(wallet)}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Select an account to manage wallets</p>
        </div>
      )}

      {/* Wallet Form Modal */}
      <WalletForm
        isOpen={showForm}
        onClose={handleFormClose}
        accountId={selectedAccountId}
        editWallet={editingWallet}
      />
    </div>
  );
}
