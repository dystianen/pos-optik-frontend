import apiClient from '@/lib/apiClient'

export const getRecommendations = async () => {
  const response = await apiClient.get('/products/recommendations')
  return response.data
}
