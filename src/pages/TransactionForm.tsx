import React, { useState } from 'react';
import type { Transaction } from '../types';
import { useTransactions, useCategories } from '../hooks/useData';
import { FormField, FormSelect, FormActions } from '../components/FormComponents';
import { Modal } from '../components/Modal';
import { db } from '../db';
import './TransactionForm.css';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string | null;
  editTransaction?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  accountId,
  editTransaction,
}) => {
  const { addTransaction, updateTransaction } = useTransactions(accountId);
  const { categories } = useCategories(accountId);

  const [type, setType] = useState<Transaction['type']>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string | number>('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  // Get most-used category for this transaction type
  const getDefaultCategory = async (accountId: string, transactionType: Transaction['type']) => {
    try {
      const transactions = await db.getTransactionsByAccount(accountId);
      const freq = new Map<string, number>();
      transactions
        .filter((t: Transaction) => t.type === transactionType && t.categoryId)
        .forEach((t: Transaction) => {
          freq.set(t.categoryId!, (freq.get(t.categoryId!) || 0) + 1);
        });
      let best = '', max = 0;
      freq.forEach((count, id) => { if (count > max) { max = count; best = id; } });
      return best;
    } catch {
      return '';
    }
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setType(editTransaction.type);
        setTitle(editTransaction.title);
        setAmount(Math.abs(editTransaction.amount));
        setCategoryId(editTransaction.categoryId || '');
        const dateVal = editTransaction.date instanceof Date
          ? editTransaction.date.toISOString().split('T')[0]
          : new Date(editTransaction.date).toISOString().split('T')[0];
        setDate(dateVal);
        setNotes(editTransaction.notes || '');
        setTitleSuggestions([]);
      } else {
        setType('expense');
        setTitle('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setNotes('');
        setCategoryId('');
        setTitleSuggestions([]);
        if (accountId) {
          getDefaultCategory(accountId, 'expense').then(id => { if (id) setCategoryId(id); });
        }
      }
      setErrors({});
    }
  }, [editTransaction, isOpen, accountId]);

  // Update default category when type changes (new transactions only)
  React.useEffect(() => {
    if (isOpen && !editTransaction && accountId) {
      getDefaultCategory(accountId, type).then(id => { if (id) setCategoryId(id); });
    }
  }, [type, isOpen, editTransaction, accountId]);

  // Title autocomplete with debounce
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setTitleSuggestions([]);
    if (debounceTimer) clearTimeout(debounceTimer);
    if (value.trim().length >= 2 && accountId && !editTransaction) {
      const timer = window.setTimeout(async () => {
        try {
          const transactions = await db.getTransactionsByAccount(accountId);
          const unique = new Set<string>();
          transactions
            .filter((t: Transaction) => t.title.toLowerCase().includes(value.toLowerCase()))
            .forEach((t: Transaction) => unique.add(t.title));
          setTitleSuggestions(Array.from(unique).slice(0, 5));
        } catch { /* ignore */ }
      }, 300);
      setDebounceTimer(timer);
    }
  };

  React.useEffect(() => {
    return () => { if (debounceTimer) clearTimeout(debounceTimer); };
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!amount || parseFloat(amount.toString()) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (type !== 'transfer' && !categoryId) newErrors.categoryId = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !accountId) return;
    setLoading(true);
    setErrors({});

    const transactionData: Omit<Transaction, 'id' | 'createdAt'> = {
      accountId,
      type,
      title,
      amount: type === 'expense' ? -Math.abs(parseFloat(amount.toString())) : parseFloat(amount.toString()),
      date: new Date(date),
      categoryId: type !== 'transfer' ? categoryId : undefined,
      notes: notes || undefined,
    };

    try {
      if (editTransaction) {
        await updateTransaction(editTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setErrors({ submit: 'Failed to save transaction' });
      setLoading(false);
      return;
    }

    setLoading(false);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    setTitleSuggestions([]);
    if (debounceTimer) { clearTimeout(debounceTimer); setDebounceTimer(null); }
    onClose();
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <Modal
      title={editTransaction ? 'Edit Transaction' : 'New Transaction'}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="transaction-form">
        {errors.submit && <div className="error-alert">{errors.submit}</div>}

        <FormSelect
          label="Type"
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
          value={type}
          onChange={(value) => setType(value as Transaction['type'])}
          required
        />

        <FormField
          label="Title"
          placeholder="e.g., Grocery shopping"
          value={title}
          onChange={handleTitleChange}
          error={errors.title}
          required
        />
        {titleSuggestions.length > 0 && (
          <div className="title-suggestions">
            {titleSuggestions.map((s, i) => (
              <button key={i} type="button" className="suggestion-item"
                onClick={() => { setTitle(s); setTitleSuggestions([]); }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <FormField
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={setAmount}
          error={errors.amount}
          required
        />

        {type !== 'transfer' && (
          <FormSelect
            label="Category"
            options={(type === 'income' ? incomeCategories : expenseCategories).map(c => ({
              value: c.id,
              label: c.name,
            }))}
            value={categoryId}
            onChange={setCategoryId}
            error={errors.categoryId}
            required
          />
        )}

        <FormField
          label="Date"
          type="date"
          value={date}
          onChange={setDate}
        />

        <FormField
          label="Notes (optional)"
          placeholder="Add notes about this transaction"
          value={notes}
          onChange={setNotes}
        />

        <FormActions
          onSubmit={handleSubmit}
          onCancel={handleClose}
          submitLabel={editTransaction ? 'Update' : 'Add'}
          isLoading={loading}
        />
      </div>
    </Modal>
  );
};
