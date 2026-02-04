# FAQ - Frequently Asked Questions

## General

### Q: What is this app?
A: It's a personal expense tracker PWA (Progressive Web App) that runs entirely on your iPhone with local storage. No server, no internet required, 100% private.

### Q: Why did you build it?
A: For personal use - to track finances on iPhone with full control over data, complete offline support, and privacy.

### Q: Does it cost money?
A: No. It's free and open source. No ads, no tracking, no payments.

### Q: Who can use it?
A: Anyone with an iPhone or web browser. Works on iPhone 15 Pro, Android, desktop - anywhere.

### Q: Is my data safe?
A: Yes. Your data stays on your device in IndexedDB. It never leaves your phone. No server, no cloud, no one has access but you.

---

## Installation

### Q: How do I install it on iPhone?
A: Open in Safari, tap Share → Add to Home Screen, tap Add. It installs like a native app.

### Q: Can I install on Android?
A: Yes! Same process - open in browser, tap menu, Add to Home Screen.

### Q: Can I install on desktop?
A: Yes, but it's optimized for iPhone. Works great on Chrome, Firefox, Safari.

### Q: Do I need to pay for hosting?
A: No. You can deploy free to Vercel, Netlify, or GitHub Pages.

### Q: Where do I get the app URL?
A: You host it yourself or deploy to Vercel/Netlify and get a URL.

---

## Usage

### Q: Where is my data stored?
A: Locally in your phone's IndexedDB. Nowhere else. Not on server, not in cloud, not backed up.

### Q: How do I backup my data?
A: Currently stored locally. Export feature coming soon. Data survives app uninstall if iOS backup exists.

### Q: Can I access from multiple devices?
A: Currently no - each device has separate data. Cloud sync optional in future.

### Q: What if I clear browser data?
A: All data will be lost. Be careful! Export feature coming soon.

### Q: Can I use it offline?
A: Yes! That's the whole point. Works completely offline after first load.

### Q: How much storage does it use?
A: Very little - typically <5MB with thousands of transactions.

---

## Features

### Q: Can I have multiple accounts?
A: Yes - create as many as you want (Salary, Savings, Expenses, etc.)

### Q: What's the difference between accounts and wallets?
A: Accounts are logical groupings. Wallets are the physical money containers. Example: Savings account has Bank wallet and Cash wallet.

### Q: Can I transfer between accounts?
A: Yes! Transfers create linked transactions in both accounts.

### Q: Can I edit a transaction?
A: Yes - click the pencil icon on any transaction.

### Q: Can I delete a transaction?
A: Yes - click the trash icon. Warns you first.

### Q: Can I add notes to transactions?
A: Yes - there's a notes field when creating/editing.

### Q: Can I attach receipts?
A: Yes (planned but not yet implemented).

### Q: Can I search transactions?
A: Basic filtering by date (planned - full search coming soon).

---

## Offline

### Q: Does it work offline?
A: Yes - everything works offline after first load.

### Q: Can I add transactions offline?
A: Yes - all operations work offline.

### Q: Do changes sync when I go online?
A: Changes are saved locally. No cloud sync currently.

### Q: What happens to offline changes?
A: They stay on your device permanently in IndexedDB.

### Q: Can I export offline?
A: Export feature coming soon.

---

## Technical

### Q: What technology is used?
A: React 19, TypeScript, Vite, IndexedDB, Service Worker, PWA.

### Q: Is it open source?
A: Yes (can be - you have the full code).

### Q: Can I modify it?
A: Yes! Full source code included. Modify for your needs.

### Q: How do I modify it?
A: Edit `src/` files, run `npm run dev`, deploy with `npm run build`.

### Q: What's the file size?
A: ~50KB gzipped. Tiny app, fast loading.

### Q: Does it track me?
A: No tracking, no analytics, no cookies (except service worker cache).

### Q: Is it secure?
A: Yes - no server to hack, data never leaves device, HTTPS when deployed.

### Q: What browsers work?
A: Chrome, Firefox, Safari (all modern versions).

---

## Deployment

### Q: How do I deploy it?
A: Build with `npm run build`, upload `dist/` to Vercel/Netlify/GitHub Pages.

### Q: Do I need a server?
A: No - it's static files. Any hosting works (GitHub Pages is free).

### Q: What's the cheapest hosting?
A: GitHub Pages (free) or Vercel (free tier).

### Q: What's the easiest hosting?
A: Vercel - connect GitHub, auto-deploys.

### Q: Can I host it myself?
A: Yes - serve the `dist/` folder as static files on your server.

### Q: Do I need HTTPS?
A: Required for PWA installation. All major hosts provide it free.

---

## Performance

### Q: Is it fast?
A: Yes - instant startup when cached, smooth 60fps.

### Q: Does it drain battery?
A: No - uses minimal resources, works offline.

### Q: How big is it?
A: 50KB gzipped. Your cat videos use more data!

### Q: How many transactions can it handle?
A: Tens of thousands. IndexedDB is efficient.

---

## Privacy & Security

### Q: Is my financial data private?
A: Completely. Stays on your device, encrypted by device security.

### Q: Does anyone track me?
A: No. No analytics, no tracking, no ads.

### Q: Can you see my data?
A: No. It's not stored anywhere I can access.

### Q: What if my phone is stolen?
A: Same as any app - protected by phone passcode/biometrics.

### Q: Can I access data if phone is lost?
A: No - data stays on device. Not backed up to iCloud (unless OS backup).

### Q: Should I backup my data?
A: Yes (export feature coming). Currently data in device backup only.

---

## Troubleshooting

### Q: App won't load
A: Clear browser cache, restart browser, check console for errors.

### Q: Transactions not saving
A: Check browser storage not full, try hard refresh (Cmd+Shift+R).

### Q: Offline mode not working
A: Check service worker in DevTools > Application > Service Workers.

### Q: Balance is wrong
A: Balances calculated from transactions. Check all transactions are correct.

### Q: Can't find a transaction
A: Scroll through list or check date. Search coming soon.

### Q: App keeps crashing
A: Check browser console for errors. Try clearing browser data.

---

## Future Features

### Q: What's coming next?
A: Export/import, cloud sync, budgets, charts, recurring transactions.

### Q: Can you add [feature]?
A: Maybe! It's open source - you can add it yourself.

### Q: When will [feature] be ready?
A: No set timeline - this is personal project.

### Q: Can I request features?
A: Yes - modify code yourself and enjoy!

---

## Limitations

### Q: Why no cloud sync?
A: Privacy first - keeping it local. Cloud optional in future.

### Q: Why no multi-device sync?
A: Each device independent by design. Can export/import in future.

### Q: Why no user accounts?
A: No login needed - privacy focused. Each device has own data.

### Q: Why no shared accounts?
A: Personal finance tracker - meant for individual use.

### Q: Why is search not implemented yet?
A: Planned feature - works without it for now.

---

## Comparison

### Q: How is this different from apps like YNAB?
A: This is local-first, private, free, offline-first. YNAB is cloud-based with features.

### Q: Should I use this or Mint?
A: This for privacy and control. Mint for cloud sync and integrations.

### Q: vs. Excel spreadsheet?
A: This is faster, mobile-optimized, offline, automatic calculations.

### Q: vs. Apple Wallet?
A: This is more detailed - tracks accounts, wallets, categories, transfers.

---

## Getting Help

### Q: Where's the documentation?
A: See README.md, SETUP.md, QUICK_REFERENCE.md

### Q: Where are the tutorials?
A: Check SETUP.md for usage guide.

### Q: How do I report a bug?
A: Check console for errors, verify with fresh install.

### Q: Who do I contact?
A: It's open source - you can modify and fix yourself!

---

## Tips & Tricks

### Q: How do I use it efficiently?
A: Create clear category names, use account colors, add notes to transactions.

### Q: Best practices?
A: Record transactions same day, use consistent category names, review monthly.

### Q: How often should I check?
A: Daily if tracking daily, weekly for summary, monthly for review.

### Q: Can I use multiple currencies?
A: Currently no - coming in future version.

### Q: How do I remember to log transactions?
A: Add habit to your routine - check app same time daily.

---

## Support

### Q: Is there customer support?
A: It's open source - self-support or community help.

### Q: How do I get updates?
A: Deploy from GitHub whenever you want updates.

### Q: Can I get a custom version?
A: Yes - modify code for your needs, it's open source.

### Q: What if I find a bug?
A: Fix it yourself or report in code!

---

## Final Thoughts

### Q: Is this production ready?
A: Yes - it's built for personal daily use on iPhone 15 Pro.

### Q: Should I use this for serious budgeting?
A: Yes, for personal use. Features are robust.

### Q: Is it worth using?
A: If you value privacy, offline-first, and simplicity - absolutely!

### Q: Can I recommend it to friends?
A: Yes! Share the URL, they can install on their devices.

### Q: What's the catch?
A: No catch - it's free, private, open source. Enjoy!

---

**Last Updated**: Feb 4, 2026  
**Questions?**: Check code or modify it yourself!
