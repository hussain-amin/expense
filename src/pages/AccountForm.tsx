import React, { useState } from 'react';
import type { Account } from '../types';
import { useAccounts } from '../hooks/useData';
import { FormField, ColorPicker, FormActions } from '../components/FormComponents';
import { Modal } from '../components/Modal';
import './AccountForm.css';

interface AccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingAccount?: Account;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  isOpen,
  onClose,
  editingAccount,
}) => {
  const { addAccount, updateAccount } = useAccounts();
  const [name, setName] = useState(editingAccount?.name || '');
  const [description, setDescription] = useState(editingAccount?.description || '');
  const [color, setColor] = useState(editingAccount?.color || '#6366f1');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Account name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      if (editingAccount) {
        await updateAccount(editingAccount.id, { name, description, color });
      } else {
        await addAccount(name, description, color);
      }
      handleClose();
    } catch (err) {
      console.error('Failed to save account:', err);
      setErrors({ submit: 'Failed to save account' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName(editingAccount?.name || '');
    setDescription(editingAccount?.description || '');
    setColor(editingAccount?.color || '#6366f1');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      title={editingAccount ? 'Edit Account' : 'New Account'}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="account-form">
        {errors.submit && <div className="error-alert">{errors.submit}</div>}

        <FormField
          label="Account Name"
          placeholder="e.g., Salary, Savings"
          value={name}
          onChange={setName}
          error={errors.name}
          required
        />

        <FormField
          label="Description (optional)"
          placeholder="e.g., My main paycheck account"
          value={description}
          onChange={setDescription}
        />

        <ColorPicker
          label="Color"
          value={color}
          onChange={setColor}
        />

        <FormActions
          onSubmit={handleSubmit}
          onCancel={handleClose}
          submitLabel={editingAccount ? 'Update' : 'Create'}
          isLoading={loading}
        />
      </div>
    </Modal>
  );
};
