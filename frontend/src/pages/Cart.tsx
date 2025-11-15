import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { cartAPI } from '../services/api';
import './Cart.css';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalCost } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleQuantityChange = async (sweetId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(sweetId, newQuantity);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update quantity');
    }
  };

  const handleRemove = async (sweetId: string) => {
    try {
      await removeFromCart(sweetId);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const result = await cartAPI.checkout();
      setSuccess(result.message || 'Purchase successful! Thank you for your order.');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalCost = getTotalCost();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Shop
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.sweet._id} className="cart-item">
                {item.sweet.imageUrl && (
                  <div className="cart-item-image">
                    <img src={item.sweet.imageUrl} alt={item.sweet.name} />
                  </div>
                )}

                <div className="cart-item-info">
                  <h3>{item.sweet.name}</h3>
                  <p className="cart-item-category">{item.sweet.category}</p>
                  {item.sweet.description && (
                    <p className="cart-item-description">{item.sweet.description}</p>
                  )}
                </div>

                <div className="cart-item-price">
                  <span className="price-label">Price:</span>
                  <span className="price-value">${item.sweet.price.toFixed(2)}</span>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.sweet._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.sweet.quantity}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.sweet._id, parseInt(e.target.value) || 1)}
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.sweet._id, item.quantity + 1)}
                    disabled={item.quantity >= item.sweet.quantity}
                  >
                    +
                  </button>
                  <span className="stock-info">
                    (Max: {item.sweet.quantity})
                  </span>
                </div>

                <div className="cart-item-subtotal">
                  <span className="subtotal-label">Subtotal:</span>
                  <span className="subtotal-value">
                    ${(item.sweet.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  className="btn-remove"
                  onClick={() => handleRemove(item.sweet._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span className="summary-label">Total Items:</span>
              <span className="summary-value">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
            <div className="summary-row total">
              <span className="summary-label">Total Cost:</span>
              <span className="summary-value">${totalCost.toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <button
                className="btn-secondary"
                onClick={async () => {
                  try {
                    await clearCart();
                  } catch (err: any) {
                    setError(err.response?.data?.error || 'Failed to clear cart');
                  }
                }}
                disabled={isProcessing}
              >
                Clear Cart
              </button>
              <button
                className="btn-primary btn-checkout"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
