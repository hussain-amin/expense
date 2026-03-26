import { useState, useMemo } from 'react';
import { useAccounts, useTransactions, useCategories, useWallets } from '../hooks/useData';
import { formatCurrency } from '../utils/helpers';
import './StatisticsPage.css';

type PeriodMode = 'monthly' | 'yearly' | 'alltime';

const FALLBACK_COLORS = [
  '#6366f1', '#22c55e', '#ef4444', '#f59e0b',
  '#06b6d4', '#a855f7', '#ec4899', '#84cc16',
];

interface DonutSegment {
  color: string;
  fraction: number;
}

function DonutChart({ segments, total }: { segments: DonutSegment[]; total: number }) {
  const cx = 75, cy = 75, r = 54, strokeWidth = 22;
  const circumference = 2 * Math.PI * r;
  const gap = segments.length > 1 ? 2 : 0;

  let offset = 0;
  const arcs = segments.map(seg => {
    const dash = Math.max(0, seg.fraction * circumference - gap);
    const arc = { color: seg.color, dash, gap, offset };
    offset += seg.fraction * circumference;
    return arc;
  });

  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#222" strokeWidth={strokeWidth} />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arc.dash} ${circumference}`}
          strokeDashoffset={-arc.offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#888" fontSize="11">Expense</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
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
      if (mode === 'monthly') {
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      }
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
    if (mode === 'monthly') d.setMonth(d.getMonth() - 1);
    else d.setFullYear(d.getFullYear() - 1);
    setCurrentDate(d);
  };

  const goNext = () => {
    const d = new Date(currentDate);
    if (mode === 'monthly') d.setMonth(d.getMonth() + 1);
    else d.setFullYear(d.getFullYear() + 1);
    setCurrentDate(d);
  };

  const periodLabel =
    mode === 'alltime'
      ? 'All Time'
      : mode === 'yearly'
      ? String(currentDate.getFullYear())
      : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="stats-page">
      {/* Account selector */}
      <header className="stats-header">
        <select
          className="account-select-header"
          value={selectedAccountId || ''}
          onChange={e => onSelectAccount(e.target.value || null)}
        >
          <option value="">Select Account</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </header>

      {/* Period mode tabs */}
      <div className="period-tabs">
        {(['monthly', 'yearly', 'alltime'] as PeriodMode[]).map(m => (
          <button
            key={m}
            className={`period-tab${mode === m ? ' active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'monthly' ? 'Monthly' : m === 'yearly' ? 'Yearly' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Period navigation */}
      <div className="period-nav">
        {mode !== 'alltime' && (
          <button className="period-arrow" onClick={goPrev}>‹</button>
        )}
        <span className="period-label">{periodLabel}</span>
        {mode !== 'alltime' && (
          <button className="period-arrow" onClick={goNext}>›</button>
        )}
      </div>

      {selectedAccountId ? (
        <div className="stats-scroll">
          {/* Balance */}
          {mode !== 'alltime' && (
            <section className="stats-card">
              <h2 className="stats-card-title">Balance</h2>
              <div className="balance-row">
                <div>
                  <div className="balance-label">Opening balance</div>
                  <div className="balance-amount">{formatCurrency(openingBalance)}</div>
                </div>
                <div className="balance-right">
                  <div className="balance-label">Ending balance</div>
                  <div className="balance-amount">{formatCurrency(endingBalance)}</div>
                </div>
              </div>
            </section>
          )}

          {/* Overview */}
          <section className="stats-card">
            <h2 className="stats-card-title">Overview</h2>
            <div className="overview-list">
              <div className="overview-row">
                <span className="overview-label">Income</span>
                <span className="overview-income">+{formatCurrency(stats.income)}</span>
              </div>
              <div className="overview-row">
                <span className="overview-label">Expense</span>
                <span className="overview-expense">-{formatCurrency(stats.expense)}</span>
              </div>
              <div className="overview-divider" />
              <div className="overview-row">
                <span className="overview-label overview-label--bold">Net</span>
                <span className={`overview-net${stats.net < 0 ? ' overview-net--negative' : ''}`}>
                  {stats.net >= 0 ? '+' : ''}{formatCurrency(stats.net)}
                </span>
              </div>
            </div>
          </section>

          {/* Expense structure */}
          {categoryBreakdown.length > 0 && (
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
          )}

          {filtered.length === 0 && (
            <div className="stats-empty">No transactions in this period</div>
          )}
        </div>
      ) : (
        <div className="stats-empty">Select an account to view statistics</div>
      )}
    </div>
  );
}
