import apiClient from '@/lib/apiClient'
import type { TResCategories, TResProduct, TResProducts } from '@/types/product'

const productService = {
  async getProduct({ category }: { category: string | null }) {
    const response = await apiClient.get<TResProducts>(`/products?category=${category}`)
    return response.data.data
  },
  async getProductDetail({ id }: { id: string | null }) {
    const response = await apiClient.get<TResProduct>(`/products/${id}`)
    return response.data.data
  },
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
