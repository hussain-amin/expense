# Setup & Usage Guide

## Installation on iPhone 15 Pro

### From Safari
1. Open Safari
2. Navigate to your app URL (when hosted)
3. Tap the Share button (box with arrow)
4. Select "Add to Home Screen"
5. Enter app name (default: "Expenses")
6. Tap "Add"
7. App appears on home screen as standalone PWA

### From Desktop (Development)
```bash
# Terminal 1: Start dev server
npm run dev

# Open http://localhost:5173 in browser
# App will run in browser with hot reload
```

## First Time Setup

### Create Your First Account
1. Tap "Dashboard" (if not already there)
2. Tap "+ New" button
3. Enter account name (e.g., "My Salary")
4. Optional: Add description and choose color
5. Tap "Create"

### Add Wallets to Account
1. Select account from dashboard
2. See "Wallets" section
3. Tap to manage wallets (full wallet management coming soon)

### Create Categories
1. Select account
2. Categories auto-created: Income, Expense defaults
3. Add custom categories as needed

### Record Your First Transaction
1. Select account from dashboard
2. Tap floating "➕" button
3. Fill in details:
   - **Type**: Income, Expense, or Transfer
   - **Title**: What's the transaction for?
   - **Amount**: How much?
   - **Wallet**: Which wallet?
   - **Category**: How to classify?
   - **Date**: When did it happen?
   - **Notes**: Additional details
4. Tap "Add"

## Daily Usage

### Check Balance
- Dashboard shows all accounts and balances at a glance
- Each account displays:
  - Current balance
  - Recent transactions
  - Income/Expense this month
  - Wallets breakdown

### View Transaction History
1. Select account from dashboard
2. Scroll down to "Recent Transactions"
3. Tap any transaction to edit or delete

### Transfer Money Between Wallets
1. Same account: Create "Transfer" type transaction
2. Different accounts: Create outgoing transfer from source, incoming from target

### Edit Existing Transaction
1. Find transaction in history
2. Tap the ✏️ edit button
3. Modify details
4. Tap "Update"

### Delete Transaction
1. Find transaction
2. Tap 🗑️ delete button
3. Confirm deletion

## Understanding the Dashboard

### Accounts Section
- Shows all your accounts
- Tap to select and view details
- Tap ✏️ to edit account
- Tap 🗑️ to delete (with confirmation)

### Selected Account Details
Shows when an account is selected:

**Wallets**: Physical money containers
- Cash, Bank, Credit Card, etc.
- Each has its own balance
- Transfers between wallets

**This Month Statistics**:
- Total income
- Total expenses
- Net change

**Recent Transactions**: Last 5 transactions
- Shows all transaction types
- Color-coded by category
- Shows amounts (+income, -expense)

## Bottom Navigation

- **Dashboard** 📊: Overview of accounts
- **Transactions** 💸: Transaction management (full view)
- **Wallets** 👛: Manage all wallets
- **Settings** ⚙️: App settings

## Data Management

### Viewing All Data
All data stored locally on your device in IndexedDB.
No cloud, no server, no privacy concerns.

### Backup Your Data
Currently: Manual export (feature coming soon)

### Clear All Data
```javascript
// In browser developer console
db.clearAll().then(() => location.reload())
```

### Export Data
Feature coming soon - export to CSV or JSON

## Offline Usage

### How It Works
- App caches on first load
- Service worker provides offline support
- All data in IndexedDB available offline
- Changes sync automatically when back online

### What Works Offline
✅ View all accounts and transactions
✅ Add new transactions
✅ Edit existing data
✅ View history
✅ All calculations and balances

### When You Go Online
- Any changes made offline are preserved
- Ready for future cloud sync (if enabled)

## Tips & Tricks

### One-Hand Usage
- Bottom navigation buttons are thumb-friendly
- Large tap targets (44x44px minimum)
- Floating button for quick actions
- Swipe up for modals

### Organization
- Use descriptive account names
- Create custom categories for better tracking
- Use wallets to separate account types
- Add notes for context on transactions

### Performance
- Instant load even offline
- Smooth animations on iPhone 15 Pro
- Optimized for battery life
- Minimal data usage

### Privacy & Security
- All data stays on your device
- No login required
- No analytics tracking
- No ads
- No external servers

## Troubleshooting

### App Crashes on Load
1. Force close app
2. Try again
3. Clear browser cache if on desktop
4. Check browser console for errors

### Transactions Not Saving
1. Check internet (if syncing to cloud)
2. Check browser storage not full
3. Reload page and try again
4. Check browser console for errors

### Service Worker Not Working
1. Uninstall PWA
2. Clear browser cache
3. Reinstall from home screen

### Math Doesn't Add Up
- Balances are calculated in real-time from transactions
- If wrong, check all transactions are correct
- Transfers should appear in both wallets

## Keyboard Shortcuts (Desktop)

When using in browser:
- `Tab` - Navigate between fields
- `Enter` - Submit forms
- `Esc` - Close modals

## Accessibility

### Screen Reader Support
- All buttons labeled
- Form labels connected
- Color not sole indicator

### Font Size
- Respects system font size
- Large, readable fonts throughout

### Color Contrast
- White text on dark background
- High contrast for visibility

## Getting Help

### Common Issues

**"Can't add transaction"**
- Ensure account is selected
- Ensure wallet exists
- Check if category required (not for transfers)

**"Balance seems wrong"**
- All balances calculated from transactions
- Check recent transactions are correct
- Negative amounts = expense/debit

**"App missing from home screen"**
- Might be cached old version
- Clear app from home screen
- Reinstall from Safari

## Next Steps

1. ✅ Install on home screen
2. ✅ Create first account
3. ✅ Add some wallets
4. ✅ Record a few transactions
5. ✅ Check it works offline

Then explore and enjoy tracking your finances!

---

**Version**: 1.0.0  
**Last Updated**: Feb 4, 2026  
**Requires**: iOS 13+ for PWA support
