export interface User {
  id: number;
  email: string;
  name: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  categoryId: number;
  category?: Category;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  auth: {
    user: User | null;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CategoryFormData {
  name: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface ProductResponse {
  count: number;
  pages: number;
  currentPage: number;
  products: Product[];
}

export interface FilterParams {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  search?: string;
  page: number;
}

export interface CartItem {
  total: number;
  quantity: number;
  product: Product;
}

export interface CartState {
  items: CartItem[];
  total: number;
}