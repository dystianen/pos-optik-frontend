import productService from '@/services/productService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useGetSearchProduct({ q }: { q: string }) {
  return useQuery({
    queryKey: ['search-product', q],
    queryFn: () => productService.getSearchProduct({ q })
  })
}

export function useGetProduct({
  limit,
  search,
  category,
  enabled
}: {
  limit?: number
  search?: string
  category: string | null
  enabled?: boolean
}) {
  return useQuery({
    queryKey: ['products', category, limit, search],
    queryFn: () => productService.getProduct({ category, limit, search }),
    enabled
  })
}

export function useGetProductDetail(id: string | null) {
  return useQuery({
    queryKey: ['product-detail', id],
    queryFn: () => productService.getProductDetail({ id }),
    enabled: !!id
  })
}

export function useGetRecommendations({
  productId,
  limit,
  search
}: {
  productId: string
  limit?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['recommendations', productId, limit, search],
    queryFn: () => productService.getRecommendations({ productId, limit, search })
  })
}

export function useGetNewEyeWear({ limit, search }: { limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['new-eyewear', limit, search],
    queryFn: () => productService.getNewEyeWear({ limit, search })
  })
}

export function useGetBestSeller({ limit, search }: { limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['best-seller', limit, search],
    queryFn: () => productService.getBestSeller({ limit, search })
  })
}

export function useGetProductCategory() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productService.getProductCategory
  })
}

export function useGetProductAttribute(id: string) {
  return useQuery({
    queryKey: ['attributes', id],
    queryFn: () => productService.getProductAttribute(id),
    enabled: !!id
  })
}

export function useGetListWishlist({ search }: { search?: string }) {
  return useQuery({
    queryKey: ['wishlist', search],
    queryFn: () => productService.getListWishlist({ search })
  })
}

export function useToggleWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (product_id: string) => productService.toggleWishlist(product_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['best-seller'] })
      queryClient.invalidateQueries({ queryKey: ['new-eyewear'] })
      queryClient.invalidateQueries({ queryKey: ['count-wishlist'] })
    }
  })
}

export function useGetTotalWishlist() {
  return useQuery({
    queryKey: ['count-wishlist'],
    queryFn: () => productService.getTotalWishlist()
  })
}
