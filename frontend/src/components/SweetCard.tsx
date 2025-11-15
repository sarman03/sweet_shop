import React, { useState } from 'react';
import type { Sweet } from '../types/index';
import { useCart } from '../contexts/CartContext';
import './SweetCard.css';

interface SweetCardProps {
  sweet: Sweet;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
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
        </div>
      )}

      <div className="sweet-header">
        <h3>{sweet.name}</h3>
        <span className="sweet-category">{sweet.category}</span>
      </div>

      <div className="sweet-details">
        {sweet.description && <p className="sweet-description">{sweet.description}</p>}

        <div className="sweet-info">
          <div className="price-tag">${sweet.price.toFixed(2)}</div>
          <div className={`stock-info ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
          </div>
        </div>
      </div>

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
          className="btn-purchase"
          onClick={handleAddToCart}
          disabled={sweet.quantity === 0 || isAdding}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default SweetCard;
