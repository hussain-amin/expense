import { useEffect, useState } from 'react';
import { db } from './db';
import { Dashboard } from './pages/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { WalletsPage } from './pages/WalletsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AccountForm } from './pages/AccountForm';
import { BottomNav, type NavItem } from './components/BottomNav';
import './App.css';

function App() {
  const [dbReady, setDbReady] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'transactions' | 'wallets' | 'settings'>('dashboard');
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Initialize database and service worker
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await db.initialize();
        setDbReady(true);

        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
          // Use relative path for GitHub Pages compatibility
          const swPath = import.meta.env.BASE_URL + 'sw.js';
          navigator.serviceWorker.register(swPath)
            .then(reg => console.log('Service Worker registered:', reg.scope))
            .catch(err => console.warn('Service Worker registration failed:', err));
        }
      } catch (err) {
        console.error('Failed to initialize app:', err);
      }
    };

    initializeApp();
  }, []);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', active: currentPage === 'dashboard' },
    { id: 'transactions', label: 'Transactions', icon: '💸', active: currentPage === 'transactions' },
    { id: 'wallets', label: 'Wallets', icon: '👛', active: currentPage === 'wallets' },
    { id: 'settings', label: 'Settings', icon: '⚙️', active: currentPage === 'settings' },
  ];

  const handleNavSelect = (pageId: string) => {
    setCurrentPage(pageId as typeof currentPage);
  };

  if (!dbReady) {
    return (
      <div className="app loading-screen">
        <div className="loading-content">
          <div className="loading-icon">💰</div>
          <p>Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <Dashboard 
            onCreateAccount={() => setShowAccountForm(true)}
            selectedAccountId={selectedAccountId}
            onSelectAccount={setSelectedAccountId}
          />
        )}
        {currentPage === 'transactions' && (
          <TransactionsPage
            selectedAccountId={selectedAccountId}
            onSelectAccount={setSelectedAccountId}
          />
        )}
        {currentPage === 'wallets' && (
          <WalletsPage
            selectedAccountId={selectedAccountId}
            onSelectAccount={setSelectedAccountId}
          />
        )}
        {currentPage === 'settings' && (
          <SettingsPage
            selectedAccountId={selectedAccountId}
            onSelectAccount={setSelectedAccountId}
          />
        )}
      </main>

      <BottomNav items={navItems} onSelect={handleNavSelect} />

      {/* Account Form Modal */}
      <AccountForm
        isOpen={showAccountForm}
        onClose={() => setShowAccountForm(false)}
      />
    </div>
  );
}

export default App;
