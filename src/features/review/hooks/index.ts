import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createReview, getProductReviews } from '../api'
import type { TCreateReviewPayload } from '../types'

export const useProductReviews = (
  productId: string,
  params?: { page?: number; per_page?: number; rating?: number | string | null }
) => {
  return useQuery({
    queryKey: ['product_reviews', productId, params],
    queryFn: () => getProductReviews(productId, params as any),
    enabled: !!productId
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ payload }: { payload: TCreateReviewPayload; productId: string }) => createReview(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product_reviews', variables.productId] })
    }
  })
}
