import { useState, useMemo } from 'react';
import { useAccounts, useTransactions, useCategories, useWallets } from '../hooks/useData';
import { formatCurrency } from '../utils/helpers';
import './StatisticsPage.css';

type PeriodMode = 'monthly' | 'yearly' | 'alltime';

const FALLBACK_COLORS = [
  '#6366f1', '#22c55e', '#ef4444', '#f59e0b',
  '#06b6d4', '#a855f7', '#ec4899', '#84cc16',
];

interface DonutSegment { color: string; fraction: number; }

function DonutChart({ segments, total }: { segments: DonutSegment[]; total: number }) {
  const cx = 80, cy = 80, r = 60, sw = 24;
  const circ = 2 * Math.PI * r;
  const gap = segments.length > 1 ? 2 : 0;
  let offset = 0;
  const arcs = segments.map(seg => {
    const dash = Math.max(0, seg.fraction * circ - gap);
    const arc = { color: seg.color, dash, offset };
    offset += seg.fraction * circ;
    return arc;
  });

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#252525" strokeWidth={sw} />
      {arcs.map((arc, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={arc.color} strokeWidth={sw}
          strokeDasharray={`${arc.dash} ${circ}`}
          strokeDashoffset={-arc.offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      <text x={cx} y={cy - 7} textAnchor="middle" fill="#777" fontSize="10.5">Expense</text>
      <text x={cx} y={cx + 11} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">
        -{formatCurrency(total)}
      </text>
    </svg>
  );
}

interface StatisticsPageProps {
  selectedAccountId: string | null;
  onSelectAccount: (id: string | null) => void;
}

export function StatisticsPage({ selectedAccountId, onSelectAccount }: StatisticsPageProps) {
  const { accounts } = useAccounts();
  const { transactions } = useTransactions(selectedAccountId);
  const { categories } = useCategories(selectedAccountId);
  const { wallets } = useWallets(selectedAccountId);

  const [mode, setMode] = useState<PeriodMode>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const filtered = useMemo(() => {
    if (mode === 'alltime') return transactions;
    return transactions.filter(tx => {
      const d = new Date(tx.date);
      if (mode === 'monthly')
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      return d.getFullYear() === currentDate.getFullYear();
    });
  }, [transactions, mode, currentDate]);

  const stats = useMemo(() => {
    const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expense, net: income - expense };
  }, [filtered]);

  const endingBalance = useMemo(() => wallets.reduce((s, w) => s + w.balance, 0), [wallets]);
  const netInPeriod = useMemo(() => filtered.reduce((s, t) => s + t.amount, 0), [filtered]);
  const openingBalance = endingBalance - netInPeriod;

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    filtered.filter(t => t.type === 'expense').forEach(t => {
      const id = t.categoryId || '__none__';
      map.set(id, (map.get(id) || 0) + Math.abs(t.amount));
    });
    if (stats.expense === 0) return [];
    return Array.from(map.entries())
      .map(([catId, amount], i) => {
        const cat = categories.find(c => c.id === catId);
        return {
          name: cat?.name ?? 'Uncategorized',
          color: cat?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
          amount,
          fraction: amount / stats.expense,
          pct: ((amount / stats.expense) * 100).toFixed(1),
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filtered, categories, stats.expense]);

  const goPrev = () => {
    const d = new Date(currentDate);
    mode === 'monthly' ? d.setMonth(d.getMonth() - 1) : d.setFullYear(d.getFullYear() - 1);
    setCurrentDate(d);
  };
  const goNext = () => {
    const d = new Date(currentDate);
    mode === 'monthly' ? d.setMonth(d.getMonth() + 1) : d.setFullYear(d.getFullYear() + 1);
    setCurrentDate(d);
  };

  const periodLabel =
    mode === 'alltime' ? 'All Time'
    : mode === 'yearly' ? String(currentDate.getFullYear())
    : currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="stats-page">
      {/* Row 1: account selector + period mode */}
      <div className="stats-topbar">
        <select
          className="stats-account-select"
          value={selectedAccountId || ''}
          onChange={e => onSelectAccount(e.target.value || null)}
        >
          <option value="">Select account</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <div className="period-pills">
          {(['monthly', 'yearly', 'alltime'] as PeriodMode[]).map(m => (
            <button
              key={m}
              className={`period-pill${mode === m ? ' active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m === 'monthly' ? 'Mo' : m === 'yearly' ? 'Yr' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: period navigation (hidden for alltime) */}
      {mode !== 'alltime' && (
        <div className="period-nav">
          <button className="period-arrow" onClick={goPrev}>‹</button>
          <span className="period-label">{periodLabel}</span>
          <button className="period-arrow" onClick={goNext}>›</button>
        </div>
      )}

      {selectedAccountId ? (
        <div className="stats-scroll">

          {/* Compact summary strip */}
          <div className="summary-strip">
            <div className="summary-cell">
              <span className="summary-val summary-val--income">+{formatCurrency(stats.income)}</span>
              <span className="summary-key">Income</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-cell">
              <span className="summary-val summary-val--expense">-{formatCurrency(stats.expense)}</span>
              <span className="summary-key">Expense</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-cell">
              <span className={`summary-val${stats.net < 0 ? ' summary-val--expense' : ' summary-val--income'}`}>
                {stats.net >= 0 ? '+' : ''}{formatCurrency(stats.net)}
              </span>
              <span className="summary-key">Net</span>
            </div>
          </div>

          {/* Balance row (compact, only for period views) */}
          {mode !== 'alltime' && (
            <div className="balance-strip">
              <span className="balance-strip-item">
                <span className="balance-strip-label">Open </span>
                <span className="balance-strip-val">{formatCurrency(openingBalance)}</span>
              </span>
              <span className="balance-strip-arrow">→</span>
              <span className="balance-strip-item">
                <span className="balance-strip-label">Close </span>
                <span className="balance-strip-val">{formatCurrency(endingBalance)}</span>
              </span>
            </div>
          )}

          {/* Expense structure — main focus */}
          {categoryBreakdown.length > 0 ? (
            <section className="stats-card">
              <h2 className="stats-card-title">Expense Structure</h2>
              <div className="expense-structure">
                <div className="donut-wrapper">
                  <DonutChart
                    segments={categoryBreakdown.map(c => ({ color: c.color, fraction: c.fraction }))}
                    total={stats.expense}
                  />
                </div>
                <div className="legend">
                  {categoryBreakdown.map((cat, i) => (
                    <div key={i} className="legend-row">
                      <span className="legend-dot" style={{ background: cat.color }} />
                      <span className="legend-name">{cat.name}</span>
                      <span className="legend-pct">({cat.pct}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <div className="stats-empty">
              {filtered.length === 0 ? 'No transactions in this period' : 'No expenses in this period'}
            </div>
          )}

        </div>
      ) : (
        <div className="stats-empty">Select an account to view statistics</div>
      )}
    </div>
  );
}
