// Account entity
export interface Account {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  balance: number; // derived from wallets
}

// Wallet entity (belongs to one account)
export interface Wallet {
  id: string;
  accountId: string;
  name: string;
  type: 'cash' | 'bank' | 'card' | 'custom';
  balance: number; // derived from transactions
  createdAt: Date;
}

// Category entity (account-specific)
export interface Category {
  id: string;
  accountId: string;
  name: string;
  type: 'income' | 'expense' | 'neutral';
  color?: string;
  icon?: string;
  createdAt: Date;
}

// Transaction entity
export interface Transaction {
  id: string;
  accountId: string;
  walletId: string;
  type: 'income' | 'expense' | 'transfer';
  title: string;
  amount: number;
  date: Date;
  categoryId?: string;
  notes?: string;
  receipt?: Blob; // optional image
  transferId?: string; // links to paired transfer transaction
  createdAt: Date;
}

// For transfers between accounts
export interface Transfer {
  id: string;
  sourceAccountId: string;
  sourceWalletId: string;
  targetAccountId: string;
  targetWalletId: string;
  amount: number;
  date: Date;
  sourceTransactionId: string;
  targetTransactionId: string;
  notes?: string;
  createdAt: Date;
}

export interface AppState {
  accounts: Account[];
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  selectedAccountId: string | null;
}
