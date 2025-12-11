export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: {
    _id: string;
    name: string;
  };
  subcategory?: string;
  brand?: string;
  images: string[];
  thumbnail: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  stock: number;
  sold: number;
  rating: {
    average: number;
    count: number;
  };
  seller: {
    _id: string;
    username: string;
  };
  shipping: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
  };
  variants?: {
    name: string;
    options: string[];
    price: number;
    stock: number;
  }[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: {
    name: string;
    option: string;
  };
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface Order {
  _id: string;
  user: User;
  orderNumber: string;
  items: {
    product: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant?: {
      name: string;
      option: string;
    };
    seller: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery' | 'bank_transfer';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  level: number;
  isActive: boolean;
  sortOrder: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  pagination?: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  message?: string;
}
