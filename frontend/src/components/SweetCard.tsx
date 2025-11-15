import React, { useState } from 'react';
import type { Sweet } from '../types/index';
import './SweetCard.css';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, quantity: number) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    if (quantity > sweet.quantity) {
      alert('Not enough quantity in stock');
      return;
    }

    setIsProcessing(true);
    try {
      await onPurchase(sweet._id, quantity);
      setQuantity(1);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="sweet-card">
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
          onClick={handlePurchase}
          disabled={sweet.quantity === 0 || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Purchase'}
        </button>
      </div>
    </div>
  );
};

export default SweetCard;
