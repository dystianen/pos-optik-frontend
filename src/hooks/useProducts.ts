import productService from '@/services/productService'
import { useQuery } from '@tanstack/react-query'

export const useProducts = {
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
  getRecommendations({ limit, search }: { limit?: number; search?: string }) {
    return useQuery({
      queryKey: ['recommendations', limit, search],
      queryFn: () => productService.getRecommendations({ limit, search })
    })
  },
  getNewEyeWear({ limit, search }: { limit?: number; search?: string }) {
    return useQuery({
      queryKey: ['new-eyewear', limit, search],
      queryFn: () => productService.getNewEyeWear({ limit, search })
    })
  },
  getProductCategory() {
    return useQuery({
      queryKey: ['categories'],
      queryFn: productService.getProductCategory
    })
  }
}
