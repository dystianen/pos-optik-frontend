import apiClient from '@/lib/apiClient'
import { API_ROUTES } from '@/constants/api-routes'
import type {
  TResAttribute,
  TResCategories,
  TResDetailProduct,
  TResProducts
} from '../types'

export const getSearchProduct = async ({ q }: { q: string }) => {
  const { data } = await apiClient.get(API_ROUTES.PRODUCTS.SEARCH, {
    params: { q }
  })
  return data.data
}

export const getProduct = async ({
  limit,
  search,
  category
}: {
  limit?: number
  search?: string
  category: string | null
}) => {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())
  if (search) params.append('search', search)
  if (category) params.append('category', category)

  const response = await apiClient.get<TResProducts>(`${API_ROUTES.PRODUCTS.BASE}?${params.toString()}`)
  return response.data.data
}

export const getProductDetail = async ({ id }: { id: string | null }) => {
  if (!id) throw new Error('Product ID is required')
  const response = await apiClient.get<TResDetailProduct>(`${API_ROUTES.PRODUCTS.BASE}/${id}`)
  return response.data.data
}

export const getRecommendations = async ({
  productId,
  limit,
  search
}: {
  productId: string
  limit?: number
  search?: string
}) => {
  const params = new URLSearchParams()
  if (productId) params.append('productId', productId.toString())
  if (limit) params.append('limit', limit.toString())
  if (search) params.append('search', search)

  const response = await apiClient.get<TResProducts>(
    `${API_ROUTES.PRODUCTS.RECOMMENDATIONS(productId)}?${params.toString()}`
  )
  return response.data.data
}

export const getMyRecommendations = async ({ limit }: { limit?: number }) => {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())

  const response = await apiClient.get<TResProducts>(
    `${API_ROUTES.PRODUCTS.MY_RECOMMENDATIONS}?${params.toString()}`
  )
  return response.data.data
}

export const getNewEyeWear = async ({ limit, search }: { limit?: number; search?: string }) => {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())
  if (search) params.append('search', search)

  const response = await apiClient.get<TResProducts>(`${API_ROUTES.PRODUCTS.NEW_EYEWEAR}?${params.toString()}`)
  return response.data.data
}

export const getBestSeller = async ({ limit, search }: { limit?: number; search?: string }) => {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())
  if (search) params.append('search', search)

  const response = await apiClient.get<TResProducts>(`${API_ROUTES.PRODUCTS.BEST_SELLER}?${params.toString()}`)
  return response.data.data
}

export const getProductCategory = async () => {
  const response = await apiClient.get<TResCategories>(API_ROUTES.PRODUCTS.CATEGORY)
  return response.data.data
}

export const getProductAttribute = async (id: string) => {
  const response = await apiClient.get<TResAttribute>(API_ROUTES.PRODUCTS.ATTRIBUTES(id))
  return response.data.data
}

export const getListWishlist = async ({ search }: { search?: string }) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)

  const response = await apiClient.get<TResProducts>(`${API_ROUTES.WISHLIST.BASE}?${params.toString()}`)
  return response.data.data
}

export const toggleWishlist = async (product_id: string) => {
  const response = await apiClient.post(API_ROUTES.WISHLIST.TOGGLE, { product_id })
  return response.data
}

export const getTotalWishlist = async () => {
  const response = await apiClient.get(API_ROUTES.WISHLIST.COUNT)
  return response.data.data
}
