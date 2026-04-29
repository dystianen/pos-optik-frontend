import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as productApi from '../api'

export function useProduct(payload: { limit?: number; search?: string; category: string | null }) {
  return useQuery({
    queryKey: ['products', payload],
    queryFn: () => productApi.getProduct(payload)
  })
}

export function useProductDetail(id: string | null) {
  return useQuery({
    queryKey: ['product_id', id],
    queryFn: () => productApi.getProductDetail({ id }),
    enabled: !!id
  })
}

export function useSearchProduct(q: string) {
  return useQuery({
    queryKey: ['SEARCH_PRODUCT', q],
    queryFn: () => productApi.getSearchProduct({ q }),
    enabled: !!q
  })
}

export function useBestSeller({ limit, search }: { limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['BEST_SELLER', limit, search],
    queryFn: () => productApi.getBestSeller({ limit, search })
  })
}

export function useNewEyeWear({ limit, search }: { limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['NEW_EYEWEAR', limit, search],
    queryFn: () => productApi.getNewEyeWear({ limit, search })
  })
}

export function useRecommendations({
  productId,
  limit,
  search
}: {
  productId: string
  limit?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['RECOMMENDATIONS', productId, limit, search],
    queryFn: () => productApi.getRecommendations({ productId, limit, search }),
    enabled: !!productId
  })
}

export function useMyRecommendations({ limit }: { limit?: number }) {
  return useQuery({
    queryKey: ['MY_RECOMMENDATIONS', limit],
    queryFn: () => productApi.getMyRecommendations({ limit })
  })
}

export function useProductCategory() {
  return useQuery({
    queryKey: ['PRODUCT_CATEGORY'],
    queryFn: productApi.getProductCategory
  })
}

export function useProductAttribute(id: string) {
  return useQuery({
    queryKey: ['PRODUCT_ATTRIBUTE', id],
    queryFn: () => productApi.getProductAttribute(id),
    enabled: !!id
  })
}

export function useWishlist({ search }: { search?: string }) {
  return useQuery({
    queryKey: ['wishlist', search],
    queryFn: () => productApi.getListWishlist({ search })
  })
}

export function useToggleWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: productApi.toggleWishlist,
    onMutate: async (productId) => {
      // Batalin segala fetches yang sedang berjalan supaya optimisistik update tidak ketimpa
      await queryClient.cancelQueries({ queryKey: ['products'] })
      await queryClient.cancelQueries({ queryKey: ['wishlist'] })
      await queryClient.cancelQueries({ queryKey: ['TOTAL_WISHLIST'] })

      // OPTIMISTIC UPDATE: Ubah is_wishlist nya produk yang di-toggle di mana-mana!
      const updateProductInList = (oldData: any) => {
        if (!oldData || !oldData.data) return oldData
        return {
          ...oldData,
          data: oldData.data.map((item: any) => {
            if (item.product_id === productId) {
              return { ...item, is_wishlist: item.is_wishlist === '1' ? '0' : '1' }
            }
            return item
          })
        }
      }

      // 1. Update list produk (dengan bermacam parameter query yg mungkin dipake)!
      queryClient.setQueriesData({ queryKey: ['products'] }, updateProductInList)
      queryClient.setQueriesData({ queryKey: ['SEARCH_PRODUCT'] }, updateProductInList)
      queryClient.setQueriesData({ queryKey: ['BEST_SELLER'] }, updateProductInList)
      queryClient.setQueriesData({ queryKey: ['NEW_EYEWEAR'] }, updateProductInList)
      queryClient.setQueriesData({ queryKey: ['RECOMMENDATIONS'] }, updateProductInList)
      queryClient.setQueriesData({ queryKey: ['MY_RECOMMENDATIONS'] }, updateProductInList)
      
      // 2. Update halaman detailnya kalau ada yg buka
      queryClient.setQueriesData({ queryKey: ['product_id', productId] }, (oldData: any) => {
        if (!oldData) return oldData
        return { ...oldData, is_wishlist: oldData.is_wishlist === '1' ? '0' : '1' }
      })

      // Karena kita ga tau exact total wishlist nya nambah / berkurang sebelom API balik (mungkin aja wishlist yg sama di-klik berkali2),
      // kita invalidate jumlah totalnya saja nnti di onSuccess.
      return { productId }
    },
    onSuccess: (res, productId) => {
      // Setelah sukses, update total wishlist dan list wishlist
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['TOTAL_WISHLIST'] })
    },
    onError: (err, productId, context) => {
      // Kalo gagal update ke API, invalidate semua yg udah kita ubah optimistically 
      // supaya me-refresh ambil data aslinya lagi.
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['SEARCH_PRODUCT'] })
      queryClient.invalidateQueries({ queryKey: ['BEST_SELLER'] })
      queryClient.invalidateQueries({ queryKey: ['NEW_EYEWEAR'] })
      queryClient.invalidateQueries({ queryKey: ['RECOMMENDATIONS'] })
      queryClient.invalidateQueries({ queryKey: ['MY_RECOMMENDATIONS'] })
      queryClient.invalidateQueries({ queryKey: ['product_id', context?.productId] })
    }
  })
}

export function useTotalWishlist() {
  return useQuery({
    queryKey: ['TOTAL_WISHLIST'],
    queryFn: productApi.getTotalWishlist
  })
}
