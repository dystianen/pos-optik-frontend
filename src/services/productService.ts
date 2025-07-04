import apiClient from '@/lib/apiClient'
import type { TResCategories, TResProduct, TResProducts } from '@/types/product'

const productService = {
  async getProduct({
    limit,
    search,
    category
  }: {
    limit?: number
    search?: string
    category: string | null
  }) {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (search) params.append('search', search)
    if (category) params.append('category', category)

    const response = await apiClient.get<TResProducts>(`/products?${params.toString()}`)
    return response.data.data
  },
  async getProductDetail({ id }: { id: string | null }) {
    const response = await apiClient.get<TResProduct>(`/products/${id}`)
    return response.data.data
  },
  async getRecommendations({ limit, search }: { limit?: number; search?: string }) {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (search) params.append('search', search)

    const response = await apiClient.get<TResProducts>(
      `/products/recommendations?${params.toString()}`
    )
    return response.data.data
  },
  async getNewEyeWear({ limit, search }: { limit?: number; search?: string }) {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (search) params.append('search', search)

    const response = await apiClient.get<TResProducts>(`/products/new-eyewear?${params.toString()}`)
    return response.data.data
  },
  async getProductCategory() {
    const response = await apiClient.get<TResCategories>('/products/category')
    return response.data.data
  }
}

export default productService
