/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PUBLIC_API_URL,
  CHECKOUT,
} from '@/constants/api'
import apiHeader from './api.header';

class CheckoutService {

  static async checkout(): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + CHECKOUT,
        {
          method: 'POST',
          headers: apiHeader(),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add order')
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

export default CheckoutService
