import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Cart from '../models/Cart';
import Sweet from '../models/Sweet';
import mongoose from 'mongoose';

// Get user's cart
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    let cart = await Cart.findOne({ user: userId }).populate('items.sweet');

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = await Cart.create({ user: userId, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
};

// Add item to cart
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { sweetId, quantity } = req.body;

    if (!sweetId || !quantity || quantity < 1) {
      res.status(400).json({ error: 'Sweet ID and valid quantity are required' });
      return;
    }

    // Verify sweet exists and has enough stock
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.sweet.toString() === sweetId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (newQuantity > sweet.quantity) {
        res.status(400).json({
          error: `Only ${sweet.quantity} items available in stock`
        });
        return;
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      if (quantity > sweet.quantity) {
        res.status(400).json({
          error: `Only ${sweet.quantity} items available in stock`
        });
        return;
      }

      cart.items.push({
        sweet: new mongoose.Types.ObjectId(sweetId),
        quantity,
      });
    }

    await cart.save();
    await cart.populate('items.sweet');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { sweetId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({ error: 'Valid quantity is required' });
      return;
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    // Verify sweet exists and has enough stock
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    if (quantity > sweet.quantity) {
      res.status(400).json({
        error: `Only ${sweet.quantity} items available in stock`
      });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.sweet.toString() === sweetId
    );

    if (itemIndex === -1) {
      res.status(404).json({ error: 'Item not found in cart' });
      return;
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.sweet');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { sweetId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(
      (item) => item.sweet.toString() !== sweetId
    );

    await cart.save();
    await cart.populate('items.sweet');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear entire cart
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    cart.items = [];
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

// Checkout - process all items in cart
export const checkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const cart = await Cart.findOne({ user: userId }).populate('items.sweet');
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    // Validate all items and check stock
    for (const item of cart.items) {
      const sweet = await Sweet.findById(item.sweet._id);

      if (!sweet) {
        res.status(404).json({
          error: `Sweet "${(item.sweet as any).name}" no longer exists`
        });
        return;
      }

      if (sweet.quantity < item.quantity) {
        res.status(400).json({
          error: `Not enough stock for "${sweet.name}". Only ${sweet.quantity} available.`
        });
        return;
      }
    }

    // Process all purchases
    for (const item of cart.items) {
      await Sweet.findByIdAndUpdate(
        item.sweet._id,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    }

    // Clear cart after successful checkout
    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: 'Checkout successful',
      cart
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
};
