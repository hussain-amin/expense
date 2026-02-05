import type { Account, Wallet, Category, Transaction, Transfer } from '../types';

const DB_NAME = 'ExpenseTrackerDB';
const DB_VERSION = 1;

class Database {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('accounts')) {
          db.createObjectStore('accounts', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('wallets')) {
          const walletStore = db.createObjectStore('wallets', { keyPath: 'id' });
          walletStore.createIndex('accountId', 'accountId', { unique: false });
        }

        if (!db.objectStoreNames.contains('categories')) {
          const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
          categoryStore.createIndex('accountId', 'accountId', { unique: false });
        }

        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txStore.createIndex('accountId', 'accountId', { unique: false });
          txStore.createIndex('walletId', 'walletId', { unique: false });
          txStore.createIndex('date', 'date', { unique: false });
          txStore.createIndex('transferId', 'transferId', { unique: false });
        }

        if (!db.objectStoreNames.contains('transfers')) {
          const transferStore = db.createObjectStore('transfers', { keyPath: 'id' });
          transferStore.createIndex('sourceAccountId', 'sourceAccountId', { unique: false });
          transferStore.createIndex('date', 'date', { unique: false });
        }
      };
    });
  }

  private ensureDb(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  // Account operations
  async addAccount(account: Account): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('accounts', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('accounts').add(account);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateAccount(account: Account): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('accounts', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('accounts').put(account);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAccount(accountId: string): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('accounts', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('accounts').delete(accountId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAccount(accountId: string): Promise<Account | null> {
    const db = this.ensureDb();
    const tx = db.transaction('accounts', 'readonly');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('accounts').get(accountId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllAccounts(): Promise<Account[]> {
    const db = this.ensureDb();
    const tx = db.transaction(['accounts', 'wallets'], 'readonly');
    
    return new Promise(async (resolve, reject) => {
      try {
        const accountsRequest = tx.objectStore('accounts').getAll();
        
        accountsRequest.onsuccess = async () => {
          const accounts: Account[] = accountsRequest.result;
          
          // Calculate balance for each account from its wallets
          for (const account of accounts) {
            const wallets = await this.getWalletsByAccount(account.id);
            account.balance = wallets.reduce((sum, w) => sum + w.balance, 0);
          }
          
          resolve(accounts);
        };
        
        accountsRequest.onerror = () => reject(accountsRequest.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Wallet operations
  async addWallet(wallet: Wallet): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('wallets', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('wallets').add(wallet);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateWallet(wallet: Wallet): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('wallets', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('wallets').put(wallet);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteWallet(walletId: string): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('wallets', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('wallets').delete(walletId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getWallet(walletId: string): Promise<Wallet | null> {
    const db = this.ensureDb();
    const tx = db.transaction('wallets', 'readonly');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('wallets').get(walletId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getWalletsByAccount(accountId: string): Promise<Wallet[]> {
    const db = this.ensureDb();
    const tx = db.transaction('wallets', 'readonly');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('wallets').index('accountId').getAll(accountId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Category operations
  async addCategory(category: Category): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('categories', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('categories').add(category);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateCategory(category: Category): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('categories', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('categories').put(category);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('categories', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('categories').delete(categoryId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCategoriesByAccount(accountId: string): Promise<Category[]> {
    const db = this.ensureDb();
    const tx = db.transaction('categories', 'readonly');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('categories').index('accountId').getAll(accountId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Transaction operations
  async addTransaction(transaction: Transaction): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction(['transactions', 'wallets'], 'readwrite');
    
    return new Promise((resolve, reject) => {
      // Add transaction
      const addRequest = tx.objectStore('transactions').add(transaction);
      
      addRequest.onsuccess = () => {
        // Update wallet balance synchronously within the same transaction
        const walletStore = tx.objectStore('wallets');
        const getWalletRequest = walletStore.get(transaction.walletId);
        
        getWalletRequest.onsuccess = () => {
          const wallet = getWalletRequest.result;
          if (wallet) {
            wallet.balance += transaction.amount;
            const updateRequest = walletStore.put(wallet);
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject(updateRequest.error);
          } else {
            resolve();
          }
        };
        
        getWalletRequest.onerror = () => reject(getWalletRequest.error);
      };
      
      addRequest.onerror = () => reject(addRequest.error);
    });
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    const db = this.ensureDb();
    
    // First get the old transaction outside of the write transaction
    const oldTx = await this.getTransaction(transaction.id);
    
    // Now perform all updates in one transaction
    const tx = db.transaction(['transactions', 'wallets'], 'readwrite');
    
    return new Promise((resolve, reject) => {
      const transactionStore = tx.objectStore('transactions');
      const walletStore = tx.objectStore('wallets');
      
      // Update the transaction first
      const updateRequest = transactionStore.put(transaction);
      
      updateRequest.onsuccess = () => {
        if (!oldTx) {
          resolve();
          return;
        }
        
        if (oldTx.walletId === transaction.walletId) {
          // Same wallet, adjust balance by difference
          const getWalletRequest = walletStore.get(transaction.walletId);
          
          getWalletRequest.onsuccess = () => {
            const wallet = getWalletRequest.result;
            if (wallet) {
              wallet.balance = wallet.balance - oldTx.amount + transaction.amount;
              const putRequest = walletStore.put(wallet);
              putRequest.onsuccess = () => resolve();
              putRequest.onerror = () => reject(putRequest.error);
            } else {
              resolve();
            }
          };
          
          getWalletRequest.onerror = () => reject(getWalletRequest.error);
        } else {
          // Different wallets - update both
          const getOldWalletRequest = walletStore.get(oldTx.walletId);
          
          getOldWalletRequest.onsuccess = () => {
            const oldWallet = getOldWalletRequest.result;
            if (oldWallet) {
              oldWallet.balance -= oldTx.amount;
              walletStore.put(oldWallet);
            }
            
            // Now get and update new wallet
            const getNewWalletRequest = walletStore.get(transaction.walletId);
            
            getNewWalletRequest.onsuccess = () => {
              const newWallet = getNewWalletRequest.result;
              if (newWallet) {
                newWallet.balance += transaction.amount;
                const putRequest = walletStore.put(newWallet);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
              } else {
                resolve();
              }
            };
            
            getNewWalletRequest.onerror = () => reject(getNewWalletRequest.error);
          };
          
          getOldWalletRequest.onerror = () => reject(getOldWalletRequest.error);
        }
      };
      
      updateRequest.onerror = () => reject(updateRequest.error);
    });
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    const db = this.ensureDb();
    
    // First get the transaction outside of the write transaction
    const transaction = await this.getTransaction(transactionId);
    
    // Now perform all updates in one transaction
    const tx = db.transaction(['transactions', 'wallets'], 'readwrite');
    
    return new Promise((resolve, reject) => {
      const transactionStore = tx.objectStore('transactions');
      const walletStore = tx.objectStore('wallets');
      
      // Delete the transaction first
      const deleteRequest = transactionStore.delete(transactionId);
      
      deleteRequest.onsuccess = () => {
        if (!transaction) {
          resolve();
          return;
        }
        
        // Update wallet balance
        const getWalletRequest = walletStore.get(transaction.walletId);
        
        getWalletRequest.onsuccess = () => {
          const wallet = getWalletRequest.result;
          if (wallet) {
            wallet.balance -= transaction.amount;
            const putRequest = walletStore.put(wallet);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
          } else {
            resolve();
          }
        };
        
        getWalletRequest.onerror = () => reject(getWalletRequest.error);
      };
      
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const db = this.ensureDb();
    const tx = db.transaction('transactions', 'readonly');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('transactions').get(transactionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    const db = this.ensureDb();
    const tx = db.transaction('transactions', 'readonly');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('transactions').index('walletId').getAll(walletId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    const db = this.ensureDb();
    const tx = db.transaction('transactions', 'readonly');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('transactions').index('accountId').getAll(accountId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getTransactionsByDate(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const db = this.ensureDb();
    const tx = db.transaction('transactions', 'readonly');
    const range = IDBKeyRange.bound(startDate, endDate);
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('transactions').index('date').getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Transfer operations
  async addTransfer(transfer: Transfer): Promise<void> {
    const db = this.ensureDb();
    const tx = db.transaction('transfers', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('transfers').add(transfer);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getTransfersByAccount(accountId: string): Promise<Transfer[]> {
    const db = this.ensureDb();
    const tx = db.transaction('transfers', 'readonly');
    return new Promise((resolve, reject) => {
      const request = tx.objectStore('transfers').index('sourceAccountId').getAll(accountId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Utility to clear all data (for testing)
  async clearAll(): Promise<void> {
    const db = this.ensureDb();
    const stores = ['accounts', 'wallets', 'categories', 'transactions', 'transfers'];
    const tx = db.transaction(stores, 'readwrite');
    
    return new Promise((resolve, reject) => {
      let completed = 0;
      stores.forEach(storeName => {
        const request = tx.objectStore(storeName).clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          completed++;
          if (completed === stores.length) resolve();
        };
      });
    });
  }
}

export const db = new Database();
