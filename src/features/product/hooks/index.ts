import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as productApi from '../api'

export function useProduct(payload: {
  limit?: number
  search?: string
  category: string | null
}) {
  return useQuery({
    queryKey: ['products', payload],
    queryFn: () => productApi.getProduct(payload)
  })
}

export function useProductDetail(id: string | null) {
  return useQuery({
    queryKey: ['product_id', id],
    queryFn: () => productApi.getProductDetail({ id }),
    enabled: !!id
  })
}

export function useSearchProduct(q: string) {
  return useQuery({
    queryKey: ['SEARCH_PRODUCT', q],
    queryFn: () => productApi.getSearchProduct({ q }),
    enabled: !!q
  })
}

export function useBestSeller({ limit, search }: { limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['BEST_SELLER', limit, search],
    queryFn: () => productApi.getBestSeller({ limit, search })
  })
}

export function useNewEyeWear({ limit, search }: { limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['NEW_EYEWEAR', limit, search],
    queryFn: () => productApi.getNewEyeWear({ limit, search })
  })
}

export function useRecommendations({
  productId,
  limit,
  search
}: {
  productId: string
  limit?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['RECOMMENDATIONS', productId, limit, search],
    queryFn: () => productApi.getRecommendations({ productId, limit, search }),
    enabled: !!productId
  })
}

export function useProductCategory() {
  return useQuery({
    queryKey: ['PRODUCT_CATEGORY'],
    queryFn: productApi.getProductCategory
  })
}

export function useProductAttribute(id: string) {
  return useQuery({
    queryKey: ['PRODUCT_ATTRIBUTE', id],
    queryFn: () => productApi.getProductAttribute(id),
    enabled: !!id
  })
}

export function useWishlist({ search }: { search?: string }) {
  return useQuery({
    queryKey: ['wishlist', search],
    queryFn: () => productApi.getListWishlist({ search })
  })
}

export function useToggleWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: productApi.toggleWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['TOTAL_WISHLIST'] })
    }
  })
}

export function useTotalWishlist() {
  return useQuery({
    queryKey: ['TOTAL_WISHLIST'],
    queryFn: productApi.getTotalWishlist
  })
}
