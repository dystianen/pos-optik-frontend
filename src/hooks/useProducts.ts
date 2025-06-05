import productService from '@/services/productService'
import { useQuery } from '@tanstack/react-query'

export const useProducts = {
  getRecommendations(limit: number) {
    return useQuery({
      queryKey: ['recommendations'],
      queryFn: () => productService.getRecommendations({ limit })
    })
  },
  getNewEyeWear() {
    return useQuery({
      queryKey: ['new-eyewear'],
      queryFn: productService.getNewEyeWear
    })
  },
  getProductCategory() {
    return useQuery({
      queryKey: ['categories'],
      queryFn: productService.getProductCategory
    })
  }
}
