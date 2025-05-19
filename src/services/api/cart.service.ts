/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PUBLIC_API_URL,
  CART,
} from '@/constants/api'
import apiHeader from './api.header';

class CartService {
  static async getCart(): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + CART,
        {
          method: 'GET',
          headers: apiHeader(),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No cart items found')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async addToCart(cartData: {
    productId: number;
    quantity: number;
  }): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + CART + '/add',
        {
          method: 'POST',
          headers: apiHeader(),
          body: JSON.stringify(cartData),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }


  static async clearCart(): Promise<any> {
    try {
      const response = await fetch(
        `${PUBLIC_API_URL}${CART}/clear`,
        {
          method: 'DELETE',
          headers: apiHeader(),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear cart')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

}

export default CartService
