import api from './authService';
import { Product, PaginatedResponse } from '../types';

export const productService = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    condition?: string;
    brand?: string;
    freeShipping?: boolean;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get('/products', { params });
    return {
      success: response.data.success,
      data: response.data.products,
      pagination: response.data.pagination,
    };
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/featured/all');
    return response.data.products;
  },

  getProductsBySeller: async (sellerId: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get(`/products/seller/${sellerId}`, { params });
    return {
      success: response.data.success,
      data: response.data.products,
      pagination: response.data.pagination,
    };
  },

  createProduct: async (formData: FormData) => {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id: string, formData: FormData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
