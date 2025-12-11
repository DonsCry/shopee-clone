import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '../types';
import { cartService } from '../services/cartService';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number, variant?: { name: string; option: string }) => Promise<void>;
  updateCartItem: (productId: string, quantity: number, variant?: { name: string; option: string }) => Promise<void>;
  removeFromCart: (productId: string, variant?: { name: string; option: string }) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_CART':
      return { ...state, cart: null, isLoading: false, error: null };
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const refreshCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load cart' });
    }
  };

  const addToCart = async (productId: string, quantity = 1, variant?: { name: string; option: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartService.addToCart(productId, quantity, variant);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to add to cart' });
      throw error;
    }
  };

  const updateCartItem = async (productId: string, quantity: number, variant?: { name: string; option: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartService.updateCartItem(productId, quantity, variant);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update cart' });
      throw error;
    }
  };

  const removeFromCart = async (productId: string, variant?: { name: string; option: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartService.removeFromCart(productId, variant);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove from cart' });
      throw error;
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to clear cart' });
      throw error;
    }
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
