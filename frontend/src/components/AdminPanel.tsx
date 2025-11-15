import React, { useState, useEffect } from 'react';
import { sweetsAPI } from '../services/api';
import type { Sweet, SweetFormData } from '../types/index';
import './AdminPanel.css';

interface AdminPanelProps {
  onClose: () => void;
  onUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onUpdate }) => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<SweetFormData>({
    name: '',
    category: '',
    price: 0,
    quantity: 0,
    description: '',
  });

  const loadSweets = async () => {
    try {
      setIsLoading(true);
      const data = await sweetsAPI.getAll();
      setSweets(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load sweets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', category: '', price: 0, quantity: 0, description: '' });
    setEditingSweet(null);
    setShowForm(false);
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingSweet) {
        await sweetsAPI.update(editingSweet._id, formData);
      } else {
        await sweetsAPI.create(formData);
      }
      await loadSweets();
      onUpdate();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await sweetsAPI.delete(id);
      await loadSweets();
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleRestock = async (id: string) => {
    const quantity = prompt('Enter quantity to add:');
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    try {
      await sweetsAPI.restock(id, Number(quantity));
      await loadSweets();
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Restock failed');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button className="btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        className="btn-primary"
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
      >
        {showForm ? 'Cancel' : 'Add New Sweet'}
      </button>

      {showForm && (
        <form className="sweet-form" onSubmit={handleSubmit}>
          <h3>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h3>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              id="category"
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingSweet ? 'Update Sweet' : 'Create Sweet'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="admin-sweets-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => (
                <tr key={sweet._id}>
                  <td>{sweet.name}</td>
                  <td>{sweet.category}</td>
                  <td>${sweet.price.toFixed(2)}</td>
                  <td>{sweet.quantity}</td>
                  <td className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(sweet)}>
                      Edit
                    </button>
                    <button className="btn-restock" onClick={() => handleRestock(sweet._id)}>
                      Restock
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(sweet._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
