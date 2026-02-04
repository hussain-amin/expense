# Expense Tracker PWA - Documentation Index

Welcome to your personal expense tracker PWA! Here's how to navigate the documentation.

## 📍 Start Here

### First Time?
👉 **[SETUP.md](SETUP.md)** - Installation and first-time setup guide

### Want to Understand the Project?
👉 **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Overview of what was built

### Ready to Deploy?
👉 **[DEPLOYMENT.md](DEPLOYMENT.md)** - How to deploy to production

### Developing the App?
👉 **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Technical reference for developers

## 📚 Full Documentation

### User Guides
| Document | Purpose |
|----------|---------|
| [SETUP.md](SETUP.md) | Installation, first-time setup, daily usage |
| [README.md](README.md) | Complete project documentation |
| [FAQ.md](FAQ.md) | Answers to common questions |

### Developer Guides
| Document | Purpose |
|----------|---------|
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Command reference, architecture, debugging |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Build, test, and deploy to production |

### Project Info
| Document | Purpose |
|----------|---------|
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | What was built, features, tech stack |

## 🚀 Quick Start

### Development
```bash
npm run dev                    # Start dev server
# Open http://localhost:5173
```

### Production
```bash
npm run build                  # Build for production
npm run preview               # Preview production locally
# Deploy dist/ folder to hosting
```

## 📖 Document Quick Links

### How to...

- **Install on iPhone**: See [SETUP.md](SETUP.md#installation-on-iphone-15-pro)
- **Create an account**: See [SETUP.md](SETUP.md#first-time-setup)
- **Add a transaction**: See [SETUP.md](SETUP.md#record-your-first-transaction)
- **Use offline**: See [SETUP.md](SETUP.md#offline-usage)
- **Deploy the app**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Modify the code**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md#development-workflow)
- **Debug issues**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md#debugging-tips)

### Feature Documentation

- **Accounts**: [README.md](README.md#core-data-model) - Create and manage accounts
- **Wallets**: [README.md](README.md#core-data-model) - Create and manage wallets
- **Categories**: [README.md](README.md#core-data-model) - Create and manage categories
- **Transactions**: [README.md](README.md#core-data-model) - Track money movement
- **Transfers**: [README.md](README.md#money-transfer-logic) - Transfer between accounts
- **Offline Support**: [README.md](README.md#offline-support) - How offline works

### API Documentation

- **Hooks**: [README.md](README.md#key-hooks) - React hooks for data management
- **Database**: [README.md](README.md#database-layer-indexeddb) - IndexedDB API
- **Components**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md#component-props) - Component interfaces

## 🎯 Learning Path

### If you want to...

1. **Just use the app**
   - Read: [SETUP.md](SETUP.md)
   - Done!

2. **Deploy it yourself**
   - Read: [DEPLOYMENT.md](DEPLOYMENT.md)
   - Run: `npm run build`
   - Deploy!

3. **Add a new feature**
   - Read: [QUICK_REFERENCE.md](QUICK_REFERENCE.md#development-workflow)
   - Edit: `src/` files
   - Test: `npm run dev`
   - Deploy!

4. **Understand how it works**
   - Read: [README.md](README.md)
   - Read: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
   - Explore: `src/` code

5. **Fix a bug or issue**
   - Check: [QUICK_REFERENCE.md](QUICK_REFERENCE.md#debugging-tips)
   - Look: Browser console
   - Fix: `src/` files
   - Test: `npm run dev`

## 🔍 Find Information

### By Topic

**Installation & Setup**
- iPhone installation → [SETUP.md](SETUP.md#installation-on-iphone-15-pro)
- Development setup → [README.md](README.md#installation)
- First time use → [SETUP.md](SETUP.md#first-time-setup)

**Features**
- All features → [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md#what-was-built)
- Data model → [README.md](README.md#core-data-model)
- Money transfers → [README.md](README.md#money-transfer-logic)

**Development**
- Project structure → [README.md](README.md#project-structure)
- Tech stack → [README.md](README.md#technical-stack)
- Architecture → [QUICK_REFERENCE.md](QUICK_REFERENCE.md#architecture-overview)
- Debugging → [QUICK_REFERENCE.md](QUICK_REFERENCE.md#debugging-tips)

**Deployment**
- Deployment options → [DEPLOYMENT.md](DEPLOYMENT.md#deployment-options)
- Build process → [DEPLOYMENT.md](DEPLOYMENT.md#build-process)
- Launch checklist → [DEPLOYMENT.md](DEPLOYMENT.md#pre-launch-checklist)

**Troubleshooting**
- Common issues → [QUICK_REFERENCE.md](QUICK_REFERENCE.md#common-issues--solutions)
- Deployment issues → [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting-deployment)
- Usage issues → [SETUP.md](SETUP.md#troubleshooting)
- FAQ → [FAQ.md](FAQ.md)

### By Audience

**For Users**
1. Read: [SETUP.md](SETUP.md)
2. Read: [FAQ.md](FAQ.md)
3. Start using!

**For Developers**
1. Read: [README.md](README.md)
2. Read: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
3. Read: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
4. Explore: `src/` code
5. Start coding!

**For DevOps**
1. Read: [DEPLOYMENT.md](DEPLOYMENT.md)
2. Choose hosting
3. Build and deploy!

## 📋 Documentation Map

```
START HERE
    ↓
Choose your path:
├── User Path
│   ├── SETUP.md (installation & usage)
│   ├── FAQ.md (common questions)
│   └── README.md (features)
│
├── Developer Path
│   ├── PROJECT_SUMMARY.md (overview)
│   ├── README.md (full docs)
│   ├── QUICK_REFERENCE.md (technical)
│   └── src/ (code)
│
└── DevOps Path
    ├── DEPLOYMENT.md (how to deploy)
    ├── QUICK_REFERENCE.md (commands)
    └── Build & Deploy
```

## 🎓 Learning Resources

### Understanding the Architecture
- Data model: [README.md#core-data-model](README.md#core-data-model)
- Database layer: [README.md#database-layer-indexeddb](README.md#database-layer-indexeddb)
- React hooks: [README.md#key-hooks](README.md#key-hooks)
- Component structure: [QUICK_REFERENCE.md#component-tree](QUICK_REFERENCE.md#component-tree)

### Code Examples

**Creating an account**
```typescript
import { useAccounts } from './hooks/useData';

const { addAccount } = useAccounts();
await addAccount('My Salary', 'Main income', '#6366f1');
```

**Adding a transaction**
```typescript
import { useTransactions } from './hooks/useData';

const { addTransaction } = useTransactions(accountId);
await addTransaction({
  accountId,
  walletId,
  type: 'expense',
  title: 'Groceries',
  amount: -50,
  date: new Date(),
  categoryId: '...',
});
```

See [README.md#key-hooks](README.md#key-hooks) for more examples.

## ❓ Need Help?

1. **Installation issues?** → [SETUP.md](SETUP.md#troubleshooting)
2. **Feature questions?** → [FAQ.md](FAQ.md)
3. **Development help?** → [QUICK_REFERENCE.md](QUICK_REFERENCE.md#debugging-tips)
4. **Deployment help?** → [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting-deployment)
5. **Want more details?** → [README.md](README.md)

## 🔗 File Structure

```
expense/
├── src/                    # Source code
│   ├── components/        # UI components
│   ├── db/               # IndexedDB layer
│   ├── hooks/            # React hooks
│   ├── pages/            # Page components
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   └── App.tsx           # Main app
├── public/               # Static files
├── docs/                 # Documentation
│   ├── README.md         # Main docs ✓
│   ├── SETUP.md          # Setup guide ✓
│   ├── FAQ.md            # FAQ ✓
│   ├── QUICK_REFERENCE.md # Dev reference ✓
│   ├── DEPLOYMENT.md     # Deployment ✓
│   └── PROJECT_SUMMARY.md # Project overview ✓
└── package.json          # Dependencies
```

## 📱 Next Steps

### Get Started
1. Read [SETUP.md](SETUP.md)
2. Install on iPhone
3. Create first account
4. Add first transaction
5. Enjoy!

### Make it Yours
1. Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md#development-workflow)
2. Modify code in `src/`
3. Run `npm run dev`
4. Test changes
5. Deploy with `npm run build`

### Share It
1. Deploy to production ([DEPLOYMENT.md](DEPLOYMENT.md))
2. Get your app URL
3. Share with friends
4. They install independently
5. Everyone has private data

## ✨ Version Info

- **Version**: 1.0.0
- **Built**: Feb 4, 2026
- **Status**: Production Ready ✅
- **Tested**: All features ✅
- **Documented**: Complete ✅

---

**Happy tracking!** 💰  
Your expense tracker is ready. Pick a document above and get started!
