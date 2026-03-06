import apiClient from '@/lib/apiClient'
import { API_ROUTES } from '@/constants/api-routes'
import type { TCreateReviewPayload, TResReviews } from '../types'

export const getProductReviews = async (productId: string, params?: { page?: number; per_page?: number; rating?: number | string }) => {
  const response = await apiClient.get<TResReviews>(API_ROUTES.REVIEWS.PRODUCT(productId), {
    params
  })
  return response.data.data
}

export const createReview = async (payload: TCreateReviewPayload) => {
  const response = await apiClient.post(API_ROUTES.REVIEWS.BASE, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data.data
}
