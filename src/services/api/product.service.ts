/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PUBLIC_API_URL,
  PRODUCTS,
} from '@/constants/api'
import apiHeader from './api.header'
import { ProductFormData, FilterParams } from '@/types'



class ProductService {
  static async getAllProducts(params: FilterParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();

      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.minRating) queryParams.append('minRating', params.minRating);
      if (params.search) queryParams.append('search', params.search);
      queryParams.append('page', params.page.toString());

      const response = await fetch(
        PUBLIC_API_URL + PRODUCTS + `?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: apiHeader(),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No products found')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async getProductDetails(id: number): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + PRODUCTS + `/${id}`,
        {
          method: 'GET',
          headers: apiHeader(),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No products found')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async createProduct(formData: ProductFormData): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + PRODUCTS,
        {
          method: 'POST',
          headers: apiHeader(),
          body: JSON.stringify(formData),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Product creation failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async updateProduct(id: number, formData: ProductFormData): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + PRODUCTS + `/${id}`,
        {
          method: 'PUT',
          headers: apiHeader(),
          body: JSON.stringify(formData),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Product update failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async deleteProduct(id: number): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + PRODUCTS + `/${id}`,
        {
          method: 'DELETE',
          headers: apiHeader(),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Product deletion failed')
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

export default ProductService;
