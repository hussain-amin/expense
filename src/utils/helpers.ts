import type { Transaction, Wallet } from '../types';

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateWalletBalance(transactions: Transaction[]): number {
  return transactions.reduce((balance, tx) => {
    if (tx.type === 'income' || (tx.type === 'transfer' && tx.amount > 0)) {
      return balance + tx.amount;
    } else if (tx.type === 'expense' || (tx.type === 'transfer' && tx.amount < 0)) {
      return balance + tx.amount;
    }
    return balance;
  }, 0);
}

export function calculateAccountBalance(wallets: Wallet[]): number {
  return wallets.reduce((total, wallet) => total + wallet.balance, 0);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date(Date.now() - 86400000);
  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
}

export function formatTransactionDate(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDate(date);
}

export function groupTransactionsByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};
  
  // Sort by date descending
  const sorted = [...transactions].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  sorted.forEach(tx => {
    const txDate = tx.date instanceof Date ? tx.date : new Date(tx.date);
    const dateKey = formatTransactionDate(txDate);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(tx);
  });

  return grouped;
}

// Color utilities
export const PRESET_COLORS = {
  indigo: '#6366f1',
  blue: '#3b82f6',
  green: '#10b981',
  red: '#ef4444',
  amber: '#f59e0b',
  purple: '#a855f7',
  pink: '#ec4899',
  cyan: '#06b6d4',
};

export function getColorName(hex: string): keyof typeof PRESET_COLORS | 'custom' {
  const entry = Object.entries(PRESET_COLORS).find(([_, color]) => color === hex);
  return (entry ? entry[0] : 'custom') as keyof typeof PRESET_COLORS | 'custom';
}
