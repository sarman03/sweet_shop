import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Sweet } from '../types/index';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './SweetCard.css';

interface SweetCardProps {
  sweet: Sweet;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (quantity > sweet.quantity) {
      alert('Not enough quantity in stock');
      return;
    }

    try {
      setIsAdding(true);
      await addToCart(sweet, quantity);
      alert(`${quantity} ${sweet.name}(s) added to cart!`);
      setQuantity(1);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="sweet-card">
      {sweet.imageUrl && (
        <div className="sweet-image">
          <img src={sweet.imageUrl} alt={sweet.name} />
          {sweet.quantity > 0 && (
            <span className="stock-badge">In Stock</span>
          )}
        </div>
      )}

      <div className="sweet-content">
        <div className="sweet-header">
          <h3>{sweet.name}</h3>
          <span className="sweet-category">{sweet.category}</span>
        </div>

        {sweet.description && <p className="sweet-description">{sweet.description}</p>}

        <div className="price-tag">${sweet.price.toFixed(2)}</div>

        <div className="sweet-actions">
          <div className="quantity-selector">
            <label htmlFor={`quantity-${sweet._id}`}>Quantity:</label>
            <input
              id={`quantity-${sweet._id}`}
              type="number"
              min="1"
              max={sweet.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={sweet.quantity === 0}
            />
          </div>

          <button
            className="btn-add-to-cart"
            onClick={handleAddToCart}
            disabled={sweet.quantity === 0 || isAdding}
          >
            {isAdding ? 'ADDING...' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
