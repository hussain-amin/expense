import { useEffect, useState, useCallback } from 'react';
import type { Account, Wallet, Category, Transaction } from '../types';
import { db } from '../db';
import { generateId } from '../utils/helpers';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await db.getAllAccounts();
      setAccounts(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAccount = useCallback(async (name: string, description?: string, color?: string) => {
    try {
      const account: Account = {
        id: generateId(),
        name,
        description,
        color,
        createdAt: new Date(),
        balance: 0,
      };
      await db.addAccount(account);
      setAccounts([account, ...accounts]);
      return account;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add account');
      throw err;
    }
  }, [accounts]);

  const updateAccount = useCallback(async (id: string, updates: Partial<Account>) => {
    try {
      const account = await db.getAccount(id);
      if (!account) throw new Error('Account not found');
      
      const updated = { ...account, ...updates, createdAt: account.createdAt };
      await db.updateAccount(updated);
      setAccounts(accounts.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account');
      throw err;
    }
  }, [accounts]);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      await db.deleteAccount(id);
      setAccounts(accounts.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      throw err;
    }
  }, [accounts]);

  useEffect(() => {
    loadAccounts();
    
    // Listen for balance changes
    const handleBalanceChange = () => loadAccounts();
    window.addEventListener('walletBalanceChanged', handleBalanceChange);
    
    return () => {
      window.removeEventListener('walletBalanceChanged', handleBalanceChange);
    };
  }, [loadAccounts]);

  return { accounts, loading, error, addAccount, updateAccount, deleteAccount, reloadAccounts: loadAccounts };
}

export function useWallets(accountId: string | null) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWallets = useCallback(async () => {
    if (!accountId) {
      setWallets([]);
      return;
    }
    try {
      setLoading(true);
      const data = await db.getWalletsByAccount(accountId);
      setWallets(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallets');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const addWallet = useCallback(async (name: string, type: Wallet['type']) => {
    if (!accountId) throw new Error('No account selected');
    try {
      const wallet: Wallet = {
        id: generateId(),
        accountId,
        name,
        type,
        balance: 0,
        createdAt: new Date(),
      };
      await db.addWallet(wallet);
      setWallets([wallet, ...wallets]);
      return wallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add wallet');
      throw err;
    }
  }, [accountId, wallets]);

  const updateWallet = useCallback(async (id: string, updates: Partial<Wallet>) => {
    try {
      const wallet = wallets.find(w => w.id === id);
      if (!wallet) throw new Error('Wallet not found');
      
      const updated = { ...wallet, ...updates, createdAt: wallet.createdAt };
      await db.updateWallet(updated);
      setWallets(wallets.map(w => w.id === id ? updated : w));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wallet');
      throw err;
    }
  }, [wallets]);

  const deleteWallet = useCallback(async (id: string) => {
    try {
      await db.deleteWallet(id);
      setWallets(wallets.filter(w => w.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete wallet');
      throw err;
    }
  }, [wallets]);

  useEffect(() => {
    loadWallets();
    
    // Listen for balance changes
    const handleBalanceChange = () => loadWallets();
    window.addEventListener('walletBalanceChanged', handleBalanceChange);
    
    return () => {
      window.removeEventListener('walletBalanceChanged', handleBalanceChange);
    };
  }, [loadWallets]);

  return { wallets, loading, error, addWallet, updateWallet, deleteWallet, reloadWallets: loadWallets };
}

export function useCategories(accountId: string | null) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    if (!accountId) {
      setCategories([]);
      return;
    }
    try {
      setLoading(true);
      const data = await db.getCategoriesByAccount(accountId);
      setCategories(data.sort((a, b) => a.name.localeCompare(b.name)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const addCategory = useCallback(async (name: string, type: Category['type'], color?: string) => {
    if (!accountId) throw new Error('No account selected');
    try {
      const category: Category = {
        id: generateId(),
        accountId,
        name,
        type,
        color,
        createdAt: new Date(),
      };
      await db.addCategory(category);
      setCategories([...categories, category].sort((a, b) => a.name.localeCompare(b.name)));
      return category;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
      throw err;
    }
  }, [accountId, categories]);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    try {
      const category = categories.find(c => c.id === id);
      if (!category) throw new Error('Category not found');
      
      const updated = { ...category, ...updates, createdAt: category.createdAt };
      await db.updateCategory(updated);
      setCategories(categories.map(c => c.id === id ? updated : c).sort((a, b) => a.name.localeCompare(b.name)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    }
  }, [categories]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await db.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  }, [categories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, error, addCategory, updateCategory, deleteCategory, reloadCategories: loadCategories };
}

export function useTransactions(accountId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!accountId) {
      setTransactions([]);
      return;
    }
    try {
      setLoading(true);
      const data = await db.getTransactionsByAccount(accountId);
      setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      const newTx: Transaction = {
        ...transaction,
        id: generateId(),
        createdAt: new Date(),
      };
      await db.addTransaction(newTx);
      setTransactions([newTx, ...transactions]);
      
      // Trigger wallet/account reload by dispatching custom event
      window.dispatchEvent(new CustomEvent('walletBalanceChanged'));
      
      return newTx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      throw err;
    }
  }, [transactions]);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    try {
      const tx = transactions.find(t => t.id === id);
      if (!tx) throw new Error('Transaction not found');
      
      const updated = { ...tx, ...updates, createdAt: tx.createdAt };
      await db.updateTransaction(updated);
      setTransactions(transactions.map(t => t.id === id ? updated : t).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      
      // Trigger wallet/account reload
      window.dispatchEvent(new CustomEvent('walletBalanceChanged'));
      
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      throw err;
    }
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await db.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
      
      // Trigger wallet/account reload
      window.dispatchEvent(new CustomEvent('walletBalanceChanged'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      throw err;
    }
  }, [transactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction, reloadTransactions: loadTransactions };
}
