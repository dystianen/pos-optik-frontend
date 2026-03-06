import { GeneralResponse } from '@/types/general'

export interface TReview {
  review_id: string
  customer_id: string
  product_id: string
  rating: string | number
  comment: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  customer_name: string
  media?: {
    file_url: string
    file_type: 'image' | 'video'
  }[]
}

export interface TReviewSummary {
  average_rating: number
  total_reviews: number
  rating_distribution: {
    [key: string]: number
  }
}

export interface TPagination {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

export interface TReviewData {
  items: TReview[]
  summary: TReviewSummary
  pagination: TPagination
}

export type TResReviews = GeneralResponse<TReviewData>

export type TCreateReviewPayload = FormData
