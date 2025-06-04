import { getRecommendations } from '@/services/productService'
import { useQuery } from '@tanstack/react-query'

export const useProducts = {
  getRecommendations() {
    return useQuery({
      queryKey: ['recommendations'],
      queryFn: getRecommendations
    })
  }
}
