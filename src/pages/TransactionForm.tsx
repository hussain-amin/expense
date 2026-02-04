import React, { useState } from 'react';
import type { Transaction } from '../types';
import { useTransactions, useWallets, useCategories } from '../hooks/useData';
import { FormField, FormSelect, FormActions } from '../components/FormComponents';
import { Modal } from '../components/Modal';
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
  const { wallets } = useWallets(accountId);
  const { categories } = useCategories(accountId);

  const [type, setType] = useState<Transaction['type']>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string | number>('');
  const [walletId, setWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Reset form when editTransaction changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setType(editTransaction.type);
        setTitle(editTransaction.title);
        setAmount(Math.abs(editTransaction.amount));
        setWalletId(editTransaction.walletId);
        setCategoryId(editTransaction.categoryId || '');
        const dateVal = editTransaction.date instanceof Date 
          ? editTransaction.date.toISOString().split('T')[0]
          : new Date(editTransaction.date).toISOString().split('T')[0];
        setDate(dateVal);
        setNotes(editTransaction.notes || '');
      } else {
        setType('expense');
        setTitle('');
        setAmount('');
        setWalletId(wallets[0]?.id || '');
        setCategoryId('');
        setDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
      setErrors({});
    }
  }, [editTransaction, isOpen, wallets]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!amount || parseFloat(amount.toString()) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!walletId) newErrors.walletId = 'Wallet is required';
    if (type !== 'transfer' && !categoryId) newErrors.categoryId = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !accountId) return;

    try {
      setLoading(true);
      const transactionData: Omit<Transaction, 'id' | 'createdAt'> = {
        accountId,
        walletId,
        type,
        title,
        amount: type === 'expense' ? -Math.abs(parseFloat(amount.toString())) : parseFloat(amount.toString()),
        date: new Date(date),
        categoryId: type !== 'transfer' ? categoryId : undefined,
        notes: notes || undefined,
      };

      if (editTransaction) {
        await updateTransaction(editTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      handleClose();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setErrors({ submit: 'Failed to save transaction' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
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
            { value: 'transfer', label: 'Transfer' },
          ]}
          value={type}
          onChange={(value) => setType(value as Transaction['type'])}
          required
        />

        <FormField
          label="Title"
          placeholder="e.g., Grocery shopping"
          value={title}
          onChange={setTitle}
          error={errors.title}
          required
        />

        <FormField
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={setAmount}
          error={errors.amount}
          required
        />

        <FormSelect
          label="Wallet"
          options={wallets.map(w => ({ value: w.id, label: w.name }))}
          value={walletId}
          onChange={setWalletId}
          error={errors.walletId}
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
