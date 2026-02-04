import { useState } from 'react';
import type { Category } from '../types';
import { useAccounts } from '../hooks/useData';
import { useCategories } from '../hooks/useData';
import { CategoryForm } from './CategoryForm';
import './SettingsPage.css';

interface SettingsPageProps {
  selectedAccountId: string | null;
  onSelectAccount: (id: string | null) => void;
}

export function SettingsPage({ selectedAccountId, onSelectAccount }: SettingsPageProps) {
  const { accounts } = useAccounts();
  const { categories, deleteCategory, reloadCategories } = useCategories(selectedAccountId);
  
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'categories' | 'about'>('categories');

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (confirm(`Delete category "${category.name}"?`)) {
      await deleteCategory(category.id);
    }
  };

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    reloadCategories();
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Settings</h1>
      </header>

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>

      {activeTab === 'categories' && (
        <div className="categories-section">
          {/* Account Selector */}
          <div className="account-selector">
            <select
              value={selectedAccountId || ''}
              onChange={(e) => onSelectAccount(e.target.value || null)}
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>

          {selectedAccountId ? (
            <>
              <div className="section-header">
                <h2>Categories</h2>
                <button className="btn-primary" onClick={() => setShowCategoryForm(true)}>
                  + Add
                </button>
              </div>

              {categories.length === 0 ? (
                <div className="empty-state">
                  <p>No categories yet</p>
                  <button className="btn-primary" onClick={() => setShowCategoryForm(true)}>
                    Create your first category
                  </button>
                </div>
              ) : (
                <>
                  {/* Income Categories */}
                  {incomeCategories.length > 0 && (
                    <div className="category-group">
                      <h3 className="group-title income">💰 Income</h3>
                      <div className="categories-list">
                        {incomeCategories.map(category => (
                          <div key={category.id} className="category-item">
                            <span
                              className="category-color"
                              style={{ background: category.color || '#22c55e' }}
                            />
                            <span className="category-name">{category.name}</span>
                            <div className="category-actions">
                              <button onClick={() => handleEditCategory(category)}>✏️</button>
                              <button onClick={() => handleDeleteCategory(category)}>🗑️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expense Categories */}
                  {expenseCategories.length > 0 && (
                    <div className="category-group">
                      <h3 className="group-title expense">💸 Expense</h3>
                      <div className="categories-list">
                        {expenseCategories.map(category => (
                          <div key={category.id} className="category-item">
                            <span
                              className="category-color"
                              style={{ background: category.color || '#ef4444' }}
                            />
                            <span className="category-name">{category.name}</span>
                            <div className="category-actions">
                              <button onClick={() => handleEditCategory(category)}>✏️</button>
                              <button onClick={() => handleDeleteCategory(category)}>🗑️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>Select an account to manage categories</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="about-section">
          <div className="about-card">
            <div className="app-icon">💰</div>
            <h2>Expense Tracker</h2>
            <p className="version">Version 1.0.0</p>
          </div>

          <div className="about-info">
            <div className="info-item">
              <span className="info-label">Storage</span>
              <span className="info-value">Local (IndexedDB)</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data Privacy</span>
              <span className="info-value">100% Local - No Cloud</span>
            </div>
            <div className="info-item">
              <span className="info-label">Offline Support</span>
              <span className="info-value">Full PWA</span>
            </div>
          </div>

          <div className="about-features">
            <h3>Features</h3>
            <ul>
              <li>✅ Multiple accounts</li>
              <li>✅ Multiple wallets per account</li>
              <li>✅ Custom categories</li>
              <li>✅ Income & expense tracking</li>
              <li>✅ Works offline</li>
              <li>✅ Dark theme</li>
              <li>✅ iPhone optimized</li>
            </ul>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showCategoryForm}
        onClose={handleCategoryFormClose}
        accountId={selectedAccountId}
        editCategory={editingCategory}
      />
    </div>
  );
}
