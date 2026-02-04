# Expense Tracker PWA

A personal finance management app built as a Progressive Web App (PWA) optimized for iPhone 15 Pro. Track accounts, wallets, categories, and transactions with full offline support.

## Features

### Core Functionality
- **Accounts** - Create logical money containers (Salary, Savings, Expenses)
- **Wallets** - Physical/virtual money holders within accounts (Cash, Bank, Card)
- **Categories** - Transaction classification (Food, Rent, Travel, etc.)
- **Transactions** - Income, expenses, and wallet transfers with full history
- **Account Transfers** - Move money between accounts with linked transactions

### Technical Features
- **100% Offline** - All data stored locally in IndexedDB, no server required
- **Progressive Web App** - Install on iPhone home screen
- **Dark Theme** - Optimized for dark mode with high contrast
- **Mobile-First** - One-hand usage on iPhone 15 Pro
- **Responsive Design** - Adapts to all screen sizes with safe area support

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development
- Dev server runs at `http://localhost:5173`
- Hot reload enabled for instant feedback
- TypeScript with strict type checking

### Build for Production
```bash
npm run build
npm run preview  # Preview production build locally
```

## Project Structure

```
src/
├── components/        # Reusable UI components (BottomNav, AccountCard, Modal, Forms)
├── db/               # IndexedDB layer for persistent storage
├── hooks/            # React hooks for data management (useAccounts, useWallets, etc.)
├── pages/            # Page/view components (Dashboard, AccountForm, TransactionForm)
├── types/            # TypeScript type definitions (Account, Wallet, Category, Transaction)
├── utils/            # Helper functions (formatting, calculations, colors)
├── App.tsx           # Main app component
├── index.css         # Global styles with iPhone safe area support
└── main.tsx          # App entry point

public/
├── manifest.json     # PWA manifest for app installation
└── sw.ts            # Service worker for offline support
```

## Core Data Model

### Account
```typescript
{
  id: string
  name: string
  description?: string
  color?: string
  balance: number (derived from wallets)
  createdAt: Date
}
```

### Wallet
```typescript
{
  id: string
  accountId: string
  name: string
  type: 'cash' | 'bank' | 'card' | 'custom'
  balance: number (derived from transactions)
  createdAt: Date
}
```

### Category (Account-specific)
```typescript
{
  id: string
  accountId: string
  name: string
  type: 'income' | 'expense' | 'neutral'
  color?: string
  icon?: string
  createdAt: Date
}
```

### Transaction
```typescript
{
  id: string
  accountId: string
  walletId: string
  type: 'income' | 'expense' | 'transfer'
  title: string
  amount: number
  date: Date
  categoryId?: string
  notes?: string
  receipt?: Blob (optional image)
  transferId?: string (links paired transfers)
  createdAt: Date
}
```

## Key Hooks

### useAccounts()
Manage all accounts in the app
```typescript
const { accounts, loading, error, addAccount, updateAccount, deleteAccount } = useAccounts();
```

### useWallets(accountId)
Manage wallets within a specific account
```typescript
const { wallets, addWallet, updateWallet, deleteWallet } = useWallets(accountId);
```

### useCategories(accountId)
Manage categories for a specific account
```typescript
const { categories, addCategory, updateCategory, deleteCategory } = useCategories(accountId);
```

### useTransactions(accountId)
Manage transactions within a specific account
```typescript
const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions(accountId);
```

## Database Layer (IndexedDB)

All data persists locally with these object stores:
- `accounts` - Account records
- `wallets` - Wallet records (indexed by accountId)
- `categories` - Category records (indexed by accountId)
- `transactions` - Transaction records (indexed by accountId, walletId, date, transferId)
- `transfers` - Transfer records (indexed by sourceAccountId)

### Database API
```typescript
import { db } from './db';

// Initialize (done automatically in App)
await db.initialize();

// Account operations
await db.addAccount(account);
await db.updateAccount(account);
await db.deleteAccount(accountId);
const account = await db.getAccount(accountId);
const accounts = await db.getAllAccounts();

// Wallet operations
await db.addWallet(wallet);
await db.getWalletsByAccount(accountId);

// Transaction operations
await db.addTransaction(transaction);
await db.getTransactionsByAccount(accountId);
await db.getTransactionsByDate(startDate, endDate);

// Clear all data (for testing)
await db.clearAll();
```

## PWA Features

### Installation on iPhone
1. Open in Safari on iPhone
2. Tap Share → Add to Home Screen
3. App installs as standalone PWA with icon
4. Full-screen, no browser UI
5. Works offline with cached data

### Offline Support
- Service worker caches app shell and assets
- All IndexedDB data available offline
- Graceful fallback when network unavailable
- Ready for future sync implementation

### Manifest Configuration
- App name: "Expense Tracker"
- Short name: "Expenses"
- Theme color: Indigo (#6366f1)
- Display: Standalone
- Orientation: Portrait primary
- Safe area support for notch and home indicator

## Styling & Theme

### Colors
- **Primary**: Indigo (#6366f1) - Main brand color
- **Success**: Green (#10b981) - Income, positive values
- **Error**: Red (#ef4444) - Expenses, negative values
- **Background**: #0f0f0f (near-black)
- **Surface**: #1a1a1a (dark surface)
- **Text**: White with opacity variants

### Layout Design
- Mobile-first, optimized for iPhone 15 Pro
- Safe area insets for notch and home indicator
- Bottom navigation for one-hand thumb reach
- Floating action button (FAB) for quick actions
- Bottom sheet modals that slide up
- Large tap targets (min 44x44px)

### Typography
- System font stack: -apple-system, BlinkMacSystemFont, Segoe UI
- Optimized for legibility on small screens
- High contrast dark theme

## Development Workflow

### Add a New Feature
1. Define types in `src/types/index.ts`
2. Add DB methods in `src/db/index.ts`
3. Create custom hook in `src/hooks/useData.ts`
4. Build UI components in `src/components/`
5. Create page/view in `src/pages/`
6. Add route/navigation in `src/App.tsx`

### Local Testing
```bash
# Start dev server
npm run dev

# Test offline (DevTools > Network > Offline)
# Test PWA installation (DevTools > Application > Manifest)

# Clear all stored data (in browser console)
db.clearAll().then(() => location.reload())

# Test on mobile
# Use --host flag: npm run dev -- --host
# Access at: http://[your-ip]:5173
```

### Build & Deploy
```bash
# Build for production
npm run build  # Creates dist/ folder

# Preview production build
npm run preview

# Static hosting (Netlify, Vercel, GitHub Pages, etc.)
# Just deploy the dist/ folder
```

## Browser Support
- ✅ Chrome/Edge (Chromium) - Full support
- ✅ Firefox - Full support
- ✅ Safari iOS - PWA capable
- ✅ Safari macOS - Full support

## Money Transfer Logic

### Wallet → Wallet Transfer (Same Account)
- Debit source wallet
- Credit target wallet
- Single transaction or paired transactions

### Account → Account Transfer
- Debit from source account wallet
- Credit to target account wallet
- Linked by `transferId`
- Two transactions created (one per account)

## Performance Optimizations
- Lazy loading with React.lazy() ready
- IndexedDB queries optimized with indexes
- Minimal bundle size (~50KB gzipped)
- CSS-in-JS approach for runtime performance
- Touch-optimized for mobile
- 60fps animations

## Known Limitations & Future Enhancements

### Future Features
- [ ] Export/import data (CSV, JSON)
- [ ] Recurring/scheduled transactions
- [ ] Budget tracking and alerts
- [ ] Charts and analytics dashboard
- [ ] Cloud sync with authentication
- [ ] Receipt image attachment storage
- [ ] Multi-currency support
- [ ] Advanced search and filters
- [ ] Tags in addition to categories
- [ ] Balance forecasting

### Testing Features (Implemented)
- Full CRUD operations for all entities
- IndexedDB persistence across sessions
- Service worker offline caching
- Type-safe operations with TypeScript

## Technical Stack
- **Framework**: React 19
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: CSS3 with safe area support
- **Database**: IndexedDB
- **PWA**: Service Worker + Web Manifest
- **Linting**: ESLint with TypeScript support

## Tips for iPhone 15 Pro Users
- App optimizes for 390x844 display
- Respects safe area for Dynamic Island
- Adapts to home indicator (bottom margin)
- One-hand navigation with bottom toolbar
- Supports light/dark mode (currently dark theme)
- Full-screen when installed as PWA

## Troubleshooting

### App won't install as PWA
- Verify HTTPS (required for PWA, except localhost)
- Check manifest.json is valid
- Ensure service worker registers successfully
- Check browser console for errors

### IndexedDB not persisting
- Check browser allows storage (not private/incognito)
- Verify browser privacy settings
- Check browser storage quota not exceeded
- Clear browser cache and reload

### Service worker not updating
- Uninstall PWA from home screen
- Clear browser cache
- Reload page and reinstall

## License
MIT - Free for personal use

## Support
Built for personal use on iPhone 15 Pro. Fully self-contained with no external dependencies or server required.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
