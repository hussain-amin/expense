import { useState, useEffect } from 'react';
import type { Category } from '../types';
import { useCategories } from '../hooks/useData';
import { Modal } from '../components/Modal';
import { FormField, FormSelect, ColorPicker, FormActions } from '../components/FormComponents';
import './CategoryForm.css';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string | null;
  editCategory?: Category | null;
}

const CATEGORY_TYPES: { value: Category['type']; label: string }[] = [
  { value: 'income', label: '💰 Income' },
  { value: 'expense', label: '💸 Expense' },
  { value: 'neutral', label: '↔️ Neutral' },
];

export function CategoryForm({ isOpen, onClose, accountId, editCategory }: CategoryFormProps) {
  const { addCategory, updateCategory } = useCategories(accountId);
  
  const [name, setName] = useState('');
  const [type, setType] = useState<Category['type']>('expense');
  const [color, setColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editCategory;

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setType(editCategory.type);
      setColor(editCategory.color || '#6366f1');
    } else {
      setName('');
      setType('expense');
      setColor('#6366f1');
    }
    setError(null);
  }, [editCategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    if (!accountId) {
      setError('No account selected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing && editCategory) {
        await updateCategory(editCategory.id, { name: name.trim(), type, color });
      } else {
        await addCategory(name.trim(), type, color);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'New Category'}
    >
      <form onSubmit={handleSubmit} className="category-form">
        {error && <div className="form-error">{error}</div>}
        
        <FormField
          label="Category Name"
          value={name}
          onChange={setName}
          placeholder="e.g., Groceries, Salary, Transport..."
          required
        />

        <FormSelect
          label="Category Type"
          value={type}
          onChange={(v) => setType(v as Category['type'])}
          options={CATEGORY_TYPES}
        />

        <ColorPicker
          label="Color"
          value={color}
          onChange={setColor}
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
