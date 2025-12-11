import api from './authService';
import { Order, PaginatedResponse } from '../types';

export const orderService = {
  createOrder: async (orderData: {
    items: Array<{
      product: string;
      quantity: number;
      variant?: { name: string; option: string };
    }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
    notes?: string;
  }): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data.order;
  },

  getUserOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get('/orders', { params });
    return {
      success: response.data.success,
      data: response.data.orders,
      pagination: response.data.pagination,
    };
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data.order;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data.order;
  },

  getSellerOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get('/orders/seller/all', { params });
    return {
      success: response.data.success,
      data: response.data.orders,
      pagination: response.data.pagination,
    };
  },

  updateOrderStatus: async (id: string, status: string, trackingNumber?: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, {
      orderStatus: status,
      trackingNumber,
    });
    return response.data.order;
  },
};
