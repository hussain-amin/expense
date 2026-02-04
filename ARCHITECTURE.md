# Architecture & Flow Diagrams

## 1. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│              EXPENSE TRACKER PWA                         │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│             React Components (UI Layer)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Dashboard  │  │ AccountForm  │  │TransactionForm│  │
│  └─────────────┘  └──────────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────┘
           ↓ (useState, useEffect)
┌──────────────────────────────────────────────────────────┐
│        Custom Hooks (State Management)                   │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ useAccounts()  │  │ useWallets() │  │useTransactions││
│  └────────────────┘  └──────────────┘  └─────────────┘ │
└──────────────────────────────────────────────────────────┘
           ↓ (async operations)
┌──────────────────────────────────────────────────────────┐
│         Database Layer (IndexedDB API)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │   add    │ │  update  │ │  delete  │ │  query   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└──────────────────────────────────────────────────────────┘
           ↓ (IDBObjectStore operations)
┌──────────────────────────────────────────────────────────┐
│            Browser Local Storage                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │accounts │ │ wallets  │ │categories│ │transactions│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└──────────────────────────────────────────────────────────┘

Data persists across:
✓ Browser refresh
✓ App close and reopen
✓ Offline (no internet)
✓ iPhone app restart
```

## 2. Component Hierarchy

```
App (Main Component)
│
├── Main Content (Route)
│   ├── Dashboard Page
│   │   ├── Dashboard Header
│   │   ├── AccountCard (list)
│   │   │   ├── Account Info
│   │   │   ├── Edit Button
│   │   │   └── Delete Button
│   │   ├── Selected Account Details
│   │   │   ├── Wallets Section
│   │   │   │   └── WalletCard (list)
│   │   │   ├── Statistics
│   │   │   │   ├── Income Stats
│   │   │   │   └── Expense Stats
│   │   │   └── Recent Transactions
│   │   │       └── TransactionItem (list)
│   │   │           ├── Category Icon
│   │   │           ├── Amount
│   │   │           └── Edit/Delete Buttons
│   │   └── Floating Action Button (+ Add Transaction)
│   │
│   ├── Transactions Page (placeholder)
│   ├── Wallets Page (placeholder)
│   └── Settings Page (placeholder)
│
├── Modals (Overlays)
│   ├── AccountForm Modal
│   │   ├── FormField (Name)
│   │   ├── FormField (Description)
│   │   ├── ColorPicker
│   │   └── FormActions (Cancel/Save)
│   │
│   └── TransactionForm Modal
│       ├── FormSelect (Type)
│       ├── FormField (Title)
│       ├── FormField (Amount)
│       ├── FormSelect (Wallet)
│       ├── FormSelect (Category)
│       ├── FormField (Date)
│       ├── FormField (Notes)
│       └── FormActions (Cancel/Save)
│
└── Bottom Navigation
    ├── Dashboard Tab
    ├── Transactions Tab
    ├── Wallets Tab
    └── Settings Tab
```

## 3. Data Model Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    ACCOUNT                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ id, name, description, color, balance, createdAt  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
            │
            ├──────────────────────────────────┬─────────────┐
            ↓                                  ↓             ↓
   ┌──────────────────┐  ┌──────────────────┐ ┌──────────────────┐
   │   WALLETS        │  │  CATEGORIES      │ │ TRANSACTIONS     │
   │ (1+ per Account) │  │ (1+ per Account) │ │ (1+ per Account) │
   │  ┌────────────┐  │  │  ┌────────────┐  │ │ ┌────────────┐  │
   │  │ id         │  │  │  │ id         │  │ │ │ id         │  │
   │  │ accountId◄─┼──┼──┤  │ accountId◄─┼──┼─┼─│ accountId◄─┼──┼┐
   │  │ name       │  │  │  │ name       │  │ │ │ walletId◄──┼──┼┼─┐
   │  │ type       │  │  │  │ type       │  │ │ │ categoryId◄┼──┼┼┬┴─┐
   │  │ balance    │  │  │  │ color      │  │ │ │ amount     │  │ │  │
   │  │ createdAt  │  │  │  │ createdAt  │  │ │ │ type       │  │ │  │
   │  └────────────┘  │  │  └────────────┘  │ │ │ date       │  │ │  │
   │                  │  │                  │ │ │ title      │  │ │  │
   └──────────────────┘  └──────────────────┘ │ │ notes      │  │ │  │
                                              │ │ transferId │  │ │  │
                                              │ │ createdAt  │  │ │  │
                                              │ └────────────┘  │ │  │
                                              └──────────────────┘ │  │
                                                      ▲ ────────────┘  │
                                                      │  1:1 Link      │
                                                      │  (if transfer) │
                                                      └────────────────┘

Relationships:
- One Account → Many Wallets
- One Account → Many Categories
- One Account → Many Transactions
- One Wallet → Many Transactions
- One Category → Many Transactions
- Two Transactions → One Transfer (via transferId)
```

## 4. User Interaction Flow

```
START: User Opens App
    ↓
    ├─→ [App Initializes]
    │   ├─→ Initialize IndexedDB
    │   ├─→ Register Service Worker
    │   └─→ Load all Accounts
    │
    └─→ Dashboard Screen Shown
            ↓
        [User Views Accounts]
            ↓
        ┌───────────────────────────────┐
        │  Select Account               │
        │  ├─→ View Account Details     │
        │  ├─→ View Wallets             │
        │  ├─→ View Transactions        │
        │  ├─→ View Stats               │
        │  └─→ View Categories          │
        └───────────────────────────────┘
            ↓
        ┌───────────────────────────────┐
        │  Add Transaction (FAB)        │
        │  ├─→ Select Type              │
        │  ├─→ Enter Amount             │
        │  ├─→ Choose Category          │
        │  ├─→ Set Date                 │
        │  └─→ Save                     │
        └───────────────────────────────┘
            ↓
        ┌───────────────────────────────┐
        │  Transaction Saved            │
        │  ├─→ Added to IndexedDB       │
        │  ├─→ Balance Updated          │
        │  ├─→ UI Refreshed             │
        │  └─→ History Updated          │
        └───────────────────────────────┘
            ↓
        [User Can Continue]
        ├─→ Add More Transactions
        ├─→ Edit Transactions
        ├─→ Delete Transactions
        ├─→ Switch Accounts
        ├─→ Create New Account
        ├─→ Use Offline (if needed)
        └─→ Close App (data persists)
```

## 5. Transaction Recording Flow

```
User Taps "Add Transaction"
    ↓
Modal Opens: TransactionForm
    ↓
┌─────────────────────────────┐
│ User Fills Form             │
│ ├─ Type: Income/Expense     │
│ ├─ Title: Description       │
│ ├─ Amount: Number           │
│ ├─ Wallet: Select           │
│ ├─ Category: Select         │
│ ├─ Date: Pick Date          │
│ └─ Notes: Optional          │
└─────────────────────────────┘
    ↓
User Taps "Add"
    ↓
┌─────────────────────────────┐
│ Validation                  │
│ ├─ Title required? ✓        │
│ ├─ Amount > 0? ✓            │
│ ├─ Wallet selected? ✓       │
│ ├─ Category selected? ✓     │
│ └─ All valid? YES           │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ Create Transaction Object   │
│ {                           │
│   id: unique_id,            │
│   accountId: selected,      │
│   walletId: selected,       │
│   type: "income"|"expense", │
│   amount: -50 or +100,      │
│   date: new Date(),         │
│   categoryId: selected,     │
│   notes: "...",             │
│   createdAt: now            │
│ }                           │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ Save to IndexedDB           │
│ db.addTransaction(tx)       │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ Update Component State      │
│ setTransactions([...])      │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ UI Updates                  │
│ ├─ Modal closes             │
│ ├─ History refreshed        │
│ ├─ Balance recalculated     │
│ └─ Stats updated            │
└─────────────────────────────┘
    ↓
Complete - User Sees Changes
```

## 6. Offline Support Flow

```
User Opens App
    ↓
┌─────────────────────────────────────┐
│ Service Worker Initialization       │
│ ├─ Install: Cache app files        │
│ ├─ Activate: Clean old caches      │
│ └─ Ready: Serve from cache         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Network Request                     │
│ ├─ Try: Fetch from Network         │
│ ├─ Success: Return & Cache         │
│ └─ Fail: Return from Cache         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ User Operations (Offline)           │
│ ├─ All UI works                    │
│ ├─ IndexedDB fully available        │
│ ├─ Add transactions                 │
│ ├─ Edit records                     │
│ ├─ Delete items                     │
│ └─ Everything works same             │
└─────────────────────────────────────┘
    ↓
Network Resumes
    ↓
┌─────────────────────────────────────┐
│ Data Already Saved Locally          │
│ ├─ No sync needed (local-first)    │
│ ├─ No data loss                    │
│ ├─ No conflicts                     │
│ └─ Future: Could sync to cloud      │
└─────────────────────────────────────┘
```

## 7. PWA Installation & Launch

```
User in Safari on iPhone
    ↓
Opens App URL
    ↓
Service Worker Registers
    ↓
    ├─→ App Appears in Share Menu
    │
User Taps Share → "Add to Home Screen"
    ↓
┌─────────────────────────────┐
│ iOS Prompts                 │
│ ├─ Rename if desired        │
│ └─ Tap Add                  │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ App Installed on Home Screen│
│ ├─ Icon from manifest.json  │
│ ├─ Name from manifest       │
│ └─ Color from manifest      │
└─────────────────────────────┘
    ↓
User Taps Home Screen Icon
    ↓
┌─────────────────────────────┐
│ App Launches in Fullscreen  │
│ ├─ No Safari UI             │
│ ├─ No Address Bar           │
│ ├─ Looks like Native App    │
│ ├─ Safe Area Respected      │
│ │   ├─ Dynamic Island Space │
│ │   └─ Home Indicator Space │
│ └─ All Features Available   │
└─────────────────────────────┘
    ↓
App Ready to Use!
    ├─ Works Offline
    ├─ Data Persists
    ├─ Fast Load
    └─ Native-like Experience
```

## 8. State Management Flow

```
React Component (Dashboard)
    │
    ├─→ useAccounts() Hook
    │   ├─ State: accounts []
    │   ├─ State: loading false
    │   ├─ State: error null
    │   └─ Functions:
    │       ├─ addAccount(name, desc, color)
    │       ├─ updateAccount(id, updates)
    │       ├─ deleteAccount(id)
    │       └─ reloadAccounts()
    │
    ├─→ useWallets(accountId) Hook
    │   ├─ State: wallets []
    │   ├─ State: loading false
    │   └─ Functions: (similar to accounts)
    │
    ├─→ useCategories(accountId) Hook
    │   ├─ State: categories []
    │   └─ Functions: (similar)
    │
    └─→ useTransactions(accountId) Hook
        ├─ State: transactions []
        └─ Functions: (similar)

All hooks:
1. Initialize state with useState()
2. Load data on mount with useEffect()
3. Provide functions to modify data
4. Call IndexedDB layer methods
5. Update state with new data
6. Component re-renders automatically
7. UI reflects data changes
```

## 9. Database Query Indexes

```
IndexedDB Schema
│
├─ Store: accounts
│   └─ keyPath: id
│       ├─ [fast] Lookup: db.getAccount(id)
│       └─ [fast] List: db.getAllAccounts()
│
├─ Store: wallets
│   ├─ keyPath: id
│   └─ index: accountId
│       └─ [fast] Query: db.getWalletsByAccount(accountId)
│
├─ Store: categories
│   ├─ keyPath: id
│   └─ index: accountId
│       └─ [fast] Query: db.getCategoriesByAccount(accountId)
│
├─ Store: transactions
│   ├─ keyPath: id
│   ├─ index: accountId
│   │   └─ [fast] Query: db.getTransactionsByAccount(accountId)
│   ├─ index: walletId
│   │   └─ [fast] Query: db.getTransactionsByWallet(walletId)
│   ├─ index: date
│   │   └─ [fast] Query: db.getTransactionsByDate(start, end)
│   └─ index: transferId
│       └─ [fast] Query: Find linked transfers
│
└─ Store: transfers
    ├─ keyPath: id
    └─ index: sourceAccountId
        └─ [fast] Query: db.getTransfersByAccount(accountId)

Performance:
- Index lookups: O(log n) - very fast
- Range queries: O(k log n) - efficient
- Handles 10,000+ records easily
```

---

**Visual Legend**:
- `→` = Flow/Direction
- `├→` = Branch
- `└→` = End of branch
- `│` = Continuation
- `─` = Connection
- `[ ]` = Processing/Action
- `{ }` = Data Object
