import queryClient from '@/lib/reactQueryClient'
import productService from '@/services/productService'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useProducts = {
  getSearchProduct({ q }: { q: string }) {
    return useQuery({
      queryKey: ['search-product', q],
      queryFn: () => productService.getSearchProduct({ q })
    })
  },
  getProduct({
    limit,
    search,
    category
  }: {
    limit?: number
    search?: string
    category: string | null
  }) {
    return useQuery({
      queryKey: ['products', category, limit, search],
      queryFn: () => productService.getProduct({ category, limit, search })
    })
  },
  getProductDetail(id: string | null) {
    return useQuery({
      queryKey: ['product-detail', id],
      queryFn: () => productService.getProductDetail({ id }),
      enabled: !!id
    })
  },
  getRecommendations({
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
  },
  getNewEyeWear({ limit, search }: { limit?: number; search?: string }) {
    return useQuery({
      queryKey: ['new-eyewear', limit, search],
      queryFn: () => productService.getNewEyeWear({ limit, search })
    })
  },
  getBestSeller({ limit, search }: { limit?: number; search?: string }) {
    return useQuery({
      queryKey: ['best-seller', limit, search],
      queryFn: () => productService.getBestSeller({ limit, search })
    })
  },
  getProductCategory() {
    return useQuery({
      queryKey: ['categories'],
      queryFn: productService.getProductCategory
    })
  },
  getProductAttribute(id: string) {
    return useQuery({
      queryKey: ['attributes'],
      queryFn: () => productService.getProductAttribute(id)
    })
  },
  getListWishlist({ search }: { search?: string }) {
    return useQuery({
      queryKey: ['wishlist', search],
      queryFn: () => productService.getListWishlist({ search })
    })
  },
  toggleWishlist() {
    return useMutation({
      mutationFn: (product_id: string) => productService.toggleWishlist(product_id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['best-seller'] })
        queryClient.invalidateQueries({ queryKey: ['new-eyewear'] })
        queryClient.invalidateQueries({ queryKey: ['count-wishlist'] })
      }
    })
  },
  getTotalWishlist() {
    return useQuery({
      queryKey: ['count-wishlist'],
      queryFn: () => productService.getTotalWishlist()
    })
  }
}
