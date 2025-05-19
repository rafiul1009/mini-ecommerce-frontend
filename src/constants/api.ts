// API Base Url
export const PUBLIC_API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL

// Auth API Endpoints
export enum ApiEndpoints {
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  LOGOUT = '/auth/logout',
  USER_DETAILS = '/auth/me',
  USER_ORDERS = '/auth/me/orders',
  PRODUCTS = '/products',
  CATEGORIES = '/categories',
  CART = '/cart',
  CHECKOUT = '/checkout'
}

export const LOGIN: string = ApiEndpoints.LOGIN
export const REGISTER: string = ApiEndpoints.REGISTER
export const LOGOUT: string = ApiEndpoints.LOGOUT
export const USER_DETAILS: string = ApiEndpoints.USER_DETAILS
export const USER_ORDERS: string = ApiEndpoints.USER_ORDERS
export const PRODUCTS: string = ApiEndpoints.PRODUCTS
export const CATEGORIES: string = ApiEndpoints.CATEGORIES
export const CART: string = ApiEndpoints.CART
export const CHECKOUT: string = ApiEndpoints.CHECKOUT
