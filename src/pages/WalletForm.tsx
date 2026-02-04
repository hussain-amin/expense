import { useState, useEffect } from 'react';
import type { Wallet } from '../types';
import { useWallets } from '../hooks/useData';
import { Modal } from '../components/Modal';
import { FormField, FormSelect, FormActions } from '../components/FormComponents';
import './WalletForm.css';

interface WalletFormProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string | null;
  editWallet?: Wallet | null;
}

const WALLET_TYPES: { value: Wallet['type']; label: string }[] = [
  { value: 'cash', label: '💵 Cash' },
  { value: 'bank', label: '🏦 Bank Account' },
  { value: 'card', label: '💳 Credit/Debit Card' },
  { value: 'custom', label: '👛 Custom' },
];

export function WalletForm({ isOpen, onClose, accountId, editWallet }: WalletFormProps) {
  const { addWallet, updateWallet } = useWallets(accountId);
  
  const [name, setName] = useState('');
  const [type, setType] = useState<Wallet['type']>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editWallet;

  useEffect(() => {
    if (editWallet) {
      setName(editWallet.name);
      setType(editWallet.type);
    } else {
      setName('');
      setType('cash');
    }
    setError(null);
  }, [editWallet, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Wallet name is required');
      return;
    }

    if (!accountId) {
      setError('No account selected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing && editWallet) {
        await updateWallet(editWallet.id, { name: name.trim(), type });
      } else {
        await addWallet(name.trim(), type);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Wallet' : 'New Wallet'}
    >
      <form onSubmit={handleSubmit} className="wallet-form">
        {error && <div className="form-error">{error}</div>}
        
        <FormField
          label="Wallet Name"
          value={name}
          onChange={setName}
          placeholder="e.g., Main Bank, Cash, Savings..."
          required
        />

        <FormSelect
          label="Wallet Type"
          value={type}
          onChange={(v) => setType(v as Wallet['type'])}
          options={WALLET_TYPES}
        />

        <FormActions
          onCancel={onClose}
          submitLabel={isEditing ? 'Update' : 'Create'}
          loading={loading}
        />
      </form>
    </Modal>
  );
}
