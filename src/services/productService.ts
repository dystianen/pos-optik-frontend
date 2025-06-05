import apiClient from '@/lib/apiClient'
import type { TResCategories, TResProducts } from '@/types/product'

const productService = {
  async getRecommendations({ limit }: { limit: number }) {
    const response = await apiClient.get<TResProducts>(`/products/recommendations?limit=${limit}`)
    return response.data.data
  },
  async getNewEyeWear() {
    const response = await apiClient.get<TResProducts>('/products/new-eyewear')
    return response.data.data
  },
  async getProductCategory() {
    const response = await apiClient.get<TResCategories>('/products/category')
    return response.data.data
  }
}

export default productService
