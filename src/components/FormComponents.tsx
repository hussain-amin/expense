import React from 'react';
import { PRESET_COLORS } from '../utils/helpers';
import './FormComponents.css';

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
}) => {
  return (
    <div className="form-field">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
};

interface FormSelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  required = false,
}) => {
  return (
    <div className="form-field">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'error' : ''}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
};

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="form-field">
      <label>{label}</label>
      <div className="color-picker">
        {Object.entries(PRESET_COLORS).map(([name, color]) => (
          <button
            key={name}
            className={`color-option ${value === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={name}
          />
        ))}
      </div>
    </div>
  );
};

interface FormActionsProps {
  onSubmit?: () => void;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  loading?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isLoading = false,
  loading = false,
}) => {
  const isDisabled = isLoading || loading;
  return (
    <div className="form-actions">
      <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isDisabled}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" onClick={onSubmit} disabled={isDisabled}>
        {isDisabled ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
};
