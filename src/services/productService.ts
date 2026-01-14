import apiClient from '@/lib/apiClient'
import type {
  TResAttribute,
  TResCategories,
  TResDetailProduct,
  TResProducts
} from '@/types/product'

const productService = {
  async getSearchProduct({ q }: { q: string }) {
    const { data } = await apiClient.get('/products/search', {
      params: { q }
    })
    return data.data
  },
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
    const response = await apiClient.get<TResDetailProduct>(`/products/${id}`)
    return response.data.data
  },
  async getRecommendations({
    productId,
    limit,
    search
  }: {
    productId: string
    limit?: number
    search?: string
  }) {
    const params = new URLSearchParams()
    if (productId) params.append('productId', productId.toString())
    if (limit) params.append('limit', limit.toString())
    if (search) params.append('search', search)

    const response = await apiClient.get<TResProducts>(
      `/products/recommendations/${productId}?${params.toString()}`
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
  async getBestSeller({ limit, search }: { limit?: number; search?: string }) {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (search) params.append('search', search)

    const response = await apiClient.get<TResProducts>(`/products/best-seller?${params.toString()}`)
    return response.data.data
  },
  async getProductCategory() {
    const response = await apiClient.get<TResCategories>('/products/category')
    return response.data.data
  },
  async getProductAttribute(id: string) {
    const response = await apiClient.get<TResAttribute>(`/products/${id}/attributes`)
    return response.data.data
  },
  async getListWishlist({ search }: { search?: string }) {
    const params = new URLSearchParams()
    if (search) params.append('search', search)

    const response = await apiClient.get<TResProducts>(`/wishlist?${params.toString()}`)
    return response.data.data
  },
  async toggleWishlist(product_id: string) {
    const response = await apiClient.post(`/wishlist/toggle`, { product_id })
    return response.data
  },
  async getTotalWishlist() {
    const response = await apiClient.get(`/wishlist/count`)
    return response.data.data
  }
}

export default productService
