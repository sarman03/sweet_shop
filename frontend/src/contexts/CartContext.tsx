import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { Sweet, CartItem } from '../types/index';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (sweet: Sweet, quantity: number) => Promise<void>;
  removeFromCart: (sweetId: string) => Promise<void>;
  updateQuantity: (sweetId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalCost: () => number;
  getTotalItems: () => number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from backend when user logs in
  const loadCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const cart = await cartAPI.getCart();
      setCartItems(cart.items);
    } catch (error: any) {
      console.error('Failed to load cart:', error);
      // If cart doesn't exist, it will be created automatically on first add
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (sweet: Sweet, quantity: number) => {
    try {
      setIsLoading(true);
      const cart = await cartAPI.addToCart(sweet._id, quantity);
      setCartItems(cart.items);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (sweetId: string) => {
    try {
      setIsLoading(true);
      const cart = await cartAPI.removeFromCart(sweetId);
      setCartItems(cart.items);
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(sweetId);
      return;
    }

    try {
      setIsLoading(true);
      const cart = await cartAPI.updateQuantity(sweetId, quantity);
      setCartItems(cart.items);
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      const cart = await cartAPI.clearCart();
      setCartItems(cart.items);
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const getTotalCost = () => {
    return cartItems.reduce((total, item) => total + item.sweet.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalCost,
        getTotalItems,
        isLoading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
