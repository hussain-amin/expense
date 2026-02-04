import { useState, useMemo } from 'react';
import type { Transaction, Category, Wallet } from '../types';
import { useAccounts } from '../hooks/useData';
import { useTransactions } from '../hooks/useData';
import { useCategories } from '../hooks/useData';
import { useWallets } from '../hooks/useData';
import { TransactionItem } from '../components/TransactionItem';
import { TransactionForm } from './TransactionForm';
import { formatCurrency, groupTransactionsByDate } from '../utils/helpers';
import './TransactionsPage.css';

interface TransactionsPageProps {
  selectedAccountId: string | null;
  onSelectAccount: (id: string | null) => void;
}

export function TransactionsPage({ selectedAccountId, onSelectAccount }: TransactionsPageProps) {
  const { accounts } = useAccounts();
  const { transactions, deleteTransaction, reloadTransactions } = useTransactions(selectedAccountId);
  const { categories } = useCategories(selectedAccountId);
  const { wallets } = useWallets(selectedAccountId);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [transactions, filterType, searchQuery]);

  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDate(filteredTransactions);
  }, [filteredTransactions]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { income, expense, net: income - expense };
  }, [transactions]);

  const getCategoryById = (id?: string): Category | undefined => {
    return categories.find(c => c.id === id);
  };

  const getWalletById = (id: string): Wallet | undefined => {
    return wallets.find(w => w.id === id);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (transaction: Transaction) => {
    if (confirm(`Delete "${transaction.title}"?`)) {
      await deleteTransaction(transaction.id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
    reloadTransactions();
  };

  return (
    <div className="transactions-page">
      <header className="page-header">
        <h1>Transactions</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add
        </button>
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

      {selectedAccountId ? (
        <>
          {/* Stats Summary */}
          <div className="stats-summary">
            <div className="stat income">
              <span className="stat-label">Income</span>
              <span className="stat-value">{formatCurrency(stats.income)}</span>
            </div>
            <div className="stat expense">
              <span className="stat-label">Expense</span>
              <span className="stat-value">{formatCurrency(stats.expense)}</span>
            </div>
            <div className="stat net">
              <span className="stat-label">Net</span>
              <span className="stat-value">{formatCurrency(stats.net)}</span>
            </div>
          </div>

          {/* Filters */}
          <div className="filters">
            <div className="filter-tabs">
              <button
                className={filterType === 'all' ? 'active' : ''}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button
                className={filterType === 'income' ? 'active' : ''}
                onClick={() => setFilterType('income')}
              >
                Income
              </button>
              <button
                className={filterType === 'expense' ? 'active' : ''}
                onClick={() => setFilterType('expense')}
              >
                Expense
              </button>
            </div>
            <input
              type="search"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Transaction List */}
          <div className="transactions-list">
            {Object.entries(groupedTransactions).length === 0 ? (
              <div className="empty-state">
                <p>No transactions yet</p>
                <button className="btn-primary" onClick={() => setShowForm(true)}>
                  Add your first transaction
                </button>
              </div>
            ) : (
              Object.entries(groupedTransactions).map(([dateKey, txns]) => (
                <div key={dateKey} className="transaction-group">
                  <h3 className="group-date">{dateKey}</h3>
                  {txns.map(transaction => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      category={getCategoryById(transaction.categoryId)}
                      wallet={getWalletById(transaction.walletId)}
                      onEdit={() => handleEdit(transaction)}
                      onDelete={() => handleDelete(transaction)}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Select an account to view transactions</p>
        </div>
      )}

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showForm}
        onClose={handleFormClose}
        accountId={selectedAccountId}
        editTransaction={editingTransaction}
      />
    </div>
  );
}
