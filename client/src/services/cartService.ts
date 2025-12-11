import api from './authService';
import { Cart } from '../types';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data.cart;
  },

  addToCart: async (productId: string, quantity: number, variant?: { name: string; option: string }): Promise<Cart> => {
    const response = await api.post('/cart/add', { productId, quantity, variant });
    return response.data.cart;
  },

  updateCartItem: async (productId: string, quantity: number, variant?: { name: string; option: string }): Promise<Cart> => {
    const response = await api.put('/cart/update', { productId, quantity, variant });
    return response.data.cart;
  },

  removeFromCart: async (productId: string, variant?: { name: string; option: string }): Promise<Cart> => {
    const response = await api.delete('/cart/remove', { data: { productId, variant } });
    return response.data.cart;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart/clear');
  },

  getCartSummary: async () => {
    const response = await api.get('/cart/summary');
    return response.data.summary;
  },
};
