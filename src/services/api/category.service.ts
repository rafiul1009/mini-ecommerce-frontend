/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PUBLIC_API_URL,
  CATEGORIES,
} from '@/constants/api'
import apiHeader from './api.header'
import { CategoryFormData } from '@/types'

class CategoryService {
  static async getAllCategories(): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + CATEGORIES,
        {
          method: 'GET',
          headers: apiHeader(),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No categories found')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async createCategory(formData: CategoryFormData): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + CATEGORIES,
        {
          method: 'POST',
          headers: apiHeader(),
          body: JSON.stringify(formData),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Category creation failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async updateCategory(id: number, formData: CategoryFormData): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + CATEGORIES + `/${id}`,
        {
          method: 'PUT',
          headers: apiHeader(),
          body: JSON.stringify(formData),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Category update failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  static async deleteCategory(id: number): Promise<any> {
    try {
      const response = await fetch(
        PUBLIC_API_URL + CATEGORIES + `/${id}`,
        {
          method: 'DELETE',
          headers: apiHeader(),
          credentials: 'include'
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Category deletion failed')
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

export default CategoryService
