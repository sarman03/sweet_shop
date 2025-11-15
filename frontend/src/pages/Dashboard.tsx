import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { sweetsAPI } from '../services/api';
import type { Sweet } from '../types/index';
import SweetCard from '../components/SweetCard';
import SearchBar from '../components/SearchBar';
import AdminPanel from '../components/AdminPanel';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const loadSweets = async () => {
    try {
      setIsLoading(true);
      const data = await sweetsAPI.getAll();
      setSweets(data);
      setFilteredSweets(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load sweets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadSweets();
  }, [user, navigate]);

  const handleSearch = async (searchParams: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) => {
    try {
      setIsLoading(true);
      if (Object.values(searchParams).every(v => !v && v !== 0)) {
        await loadSweets();
      } else {
        const data = await sweetsAPI.search(searchParams);
        setFilteredSweets(data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Sweet Shop</h1>
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <span>Welcome, {user?.name} {user?.role === 'admin' && '(Admin)'}</span>
          </div>
          <button className="btn-cart" onClick={() => navigate('/cart')}>
            🛒 {getTotalItems()}
          </button>
          {user?.role === 'admin' && (
            <button
              className="btn-admin"
              onClick={() => setShowAdminPanel(!showAdminPanel)}
            >
              {showAdminPanel ? 'View Shop' : 'Admin Panel'}
            </button>
          )}
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showAdminPanel && user?.role === 'admin' ? (
        <AdminPanel onClose={() => setShowAdminPanel(false)} onUpdate={loadSweets} />
      ) : (
        <>
          <SearchBar onSearch={handleSearch} />

          {isLoading ? (
            <div className="loading">Loading sweets...</div>
          ) : filteredSweets.length === 0 ? (
            <div className="no-results">No sweets found</div>
          ) : (
            <div className="sweets-grid">
              {filteredSweets.map((sweet) => (
                <SweetCard
                  key={sweet._id}
                  sweet={sweet}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
