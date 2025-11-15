import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
} from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Update item quantity in cart
router.put('/update/:sweetId', updateCartItem);

// Remove item from cart
router.delete('/remove/:sweetId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

// Checkout - process all items in cart
router.post('/checkout', checkout);

export default router;
