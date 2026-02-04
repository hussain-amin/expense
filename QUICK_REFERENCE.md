# Quick Reference

## Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production (creates dist/)
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database (in browser console)
db.clearAll()        # Clear all stored data
db.initialize()      # Re-initialize database
```

## Architecture Overview

```
User Interface (React Components)
        ↓
Custom Hooks (useAccounts, useWallets, etc)
        ↓
IndexedDB Layer (db/index.ts)
        ↓
Browser Storage (Local Device)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app, routing, modals |
| `src/db/index.ts` | IndexedDB operations |
| `src/hooks/useData.ts` | React state management |
| `src/types/index.ts` | TypeScript definitions |
| `src/pages/*.tsx` | Page components |
| `src/components/*.tsx` | Reusable UI components |
| `public/manifest.json` | PWA configuration |
| `public/sw.ts` | Service worker |
| `index.html` | HTML entry point |

## Data Flow

1. **User Action** → Click button/input
2. **Component Handler** → Update state
3. **Hook (useAccounts/etc)** → Update data
4. **IndexedDB** → Save to storage
5. **Component Re-render** → Display new state

## Component Tree

```
App
├── Dashboard (page)
│   ├── AccountCard (component)
│   ├── TransactionItem (component)
│   └── Modal (component)
│       ├── AccountForm (page)
│       └── TransactionForm (page)
│           ├── FormField (component)
│           ├── FormSelect (component)
│           └── FormActions (component)
└── BottomNav (component)
```

## Database Schema

### Stores & Indexes

```
accounts
├── keyPath: id
└── [no indexes]

wallets
├── keyPath: id
└── index: accountId

categories
├── keyPath: id
└── index: accountId

transactions
├── keyPath: id
├── index: accountId
├── index: walletId
├── index: date
└── index: transferId

transfers
├── keyPath: id
└── index: sourceAccountId
```

## State Management

### useAccounts()
```typescript
const {
  accounts,          // Account[]
  loading,           // boolean
  error,             // string | null
  addAccount,        // (name, description?, color?) => Account
  updateAccount,     // (id, updates) => Account
  deleteAccount,     // (id) => void
  reloadAccounts,    // () => void
} = useAccounts();
```

### useWallets(accountId)
```typescript
const {
  wallets,           // Wallet[]
  loading,           // boolean
  error,             // string | null
  addWallet,         // (name, type) => Wallet
  updateWallet,      // (id, updates) => Wallet
  deleteWallet,      // (id) => void
  reloadWallets,     // () => void
} = useWallets(accountId);
```

### Similar for useCategories() and useTransactions()

## Component Props

### AccountCard
```typescript
{
  account: Account,
  isSelected?: boolean,
  onClick?: () => void,
  onEdit?: () => void,
  onDelete?: () => void,
}
```

### TransactionItem
```typescript
{
  transaction: Transaction,
  category?: Category,
  onEdit?: () => void,
  onDelete?: () => void,
}
```

### FormField
```typescript
{
  label: string,
  type?: string,
  placeholder?: string,
  value: string | number,
  onChange: (value: string) => void,
  error?: string,
  required?: boolean,
}
```

## Color Palette

```
Primary:     #6366f1 (Indigo)
Success:     #10b981 (Green)
Error:       #ef4444 (Red)
Warning:     #f59e0b (Amber)
Info:        #06b6d4 (Cyan)

Background: #0f0f0f (Black)
Surface:    #1a1a1a (Dark Gray)
Text:       #ffffff (White)
```

## Responsive Design

```
iPhone 15 Pro: 390x844 (target device)
Safe Area Top: 52px (Dynamic Island)
Safe Area Bottom: 34px (Home Indicator)
Safe Area Sides: 0px

Bottom Nav Height: 70px + 34px (safe area)
Main Content: Full width, full height minus nav
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Next field |
| Shift+Tab | Previous field |
| Enter | Submit form |
| Esc | Close modal |

## Touch Targets

- Minimum: 44x44px (iOS standard)
- Recommended: 48x48px or larger
- Spacing: 8px between targets

## Performance Metrics

- Bundle Size: ~50KB (gzipped)
- Initial Load: <1s (with SW cache)
- Time to Interactive: <500ms
- Lighthouse: 95+ (mobile)

## Offline Behavior

✅ **Works Offline**
- View all data
- Add transactions
- Edit data
- Create accounts
- Delete items

❌ **Requires Network** (currently)
- Cloud sync (future feature)
- External data (none currently)

## Testing Scenarios

### Test 1: Basic CRUD
1. Create account
2. Add wallet
3. Add transaction
4. Edit transaction
5. Delete transaction
6. Delete account

### Test 2: Offline
1. Load app
2. Go offline (DevTools > Network > Offline)
3. Perform all actions
4. Go back online
5. Verify data persists

### Test 3: PWA Installation
1. Open in Safari on iPhone
2. Tap Share → Add to Home Screen
3. Open from home screen
4. Verify full screen
5. Test all features

### Test 4: Data Integrity
1. Create multiple accounts
2. Add transactions across accounts
3. Delete account
4. Verify other accounts unaffected
5. Check balances are correct

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| App won't load | Clear cache, restart dev server |
| Data not saving | Check IndexedDB quota, try clearing |
| Offline not working | Check service worker in DevTools |
| Forms not submitting | Check browser console for errors |
| Styles look wrong | Hard refresh (Cmd+Shift+R) |

## Development Workflow

1. **Make changes** → Code in `src/`
2. **Hot reload** → Auto-reload in browser
3. **Test changes** → Interact with app
4. **Check errors** → Look in console
5. **Commit** → Git add, commit, push
6. **Deploy** → Build and deploy dist/

## Debugging Tips

```javascript
// In browser console

// Inspect database
db.getAllAccounts().then(a => console.log(a))

// Clear all data
db.clearAll()

// Check service worker
navigator.serviceWorker.getRegistrations()

// View IndexedDB
// DevTools > Application > IndexedDB

// Simulate offline
// DevTools > Network > Offline

// Check performance
performance.getEntriesByType('navigation')
```

## Deployment Checklist

- [ ] Run `npm run build`
- [ ] Check `dist/` folder created
- [ ] No errors in build output
- [ ] Test build locally: `npm run preview`
- [ ] Deploy `dist/` to hosting
- [ ] Verify HTTPS enabled
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Verify data persists across app close/open

## Hosting Options

- **Vercel**: Best for Next.js, good for React
- **Netlify**: Easy drag-and-drop, automatic deploys
- **GitHub Pages**: Free, static only
- **Firebase Hosting**: Google-backed, reliable
- **AWS S3**: Low cost, requires setup

## Security Considerations

✅ **What's Secure**
- All data stays on device
- No account system needed
- No password to hack
- No external API calls
- No tracking

⚠️ **Device-Level Security**
- Phone passcode protects app
- Biometric auth for phone works
- Restore from backup includes data
- Accessible if phone unlocked

## Future Enhancement Ideas

1. **Export**: CSV/JSON export for backup
2. **Import**: Import from CSV/Excel
3. **Cloud**: Optional cloud sync
4. **Auth**: Optional PIN/Touch ID
5. **Search**: Find transactions by keyword
6. **Reports**: Charts, graphs, summaries
7. **Budget**: Set and track budgets
8. **Recurring**: Set up recurring transactions
9. **Tags**: In addition to categories
10. **Multi-currency**: Support multiple currencies

---

**Last Updated**: Feb 4, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
