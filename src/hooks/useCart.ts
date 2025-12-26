import queryClient from '@/lib/reactQueryClient'
import cartService from '@/services/cartService'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCart = {
  addToCart() {
    return useMutation({
      mutationFn: cartService.addToCart,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['total_cart'] })
      }
    })
  },
  totalCart() {
    return useQuery({
      queryKey: ['total_cart'],
      queryFn: cartService.totalCart
    })
  },
  cart() {
    return useQuery({
      queryKey: ['cart'],
      queryFn: cartService.cart
    })
  },
  deleteItemCart() {
    return useMutation({
      mutationFn: cartService.deleteItemCart,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        queryClient.invalidateQueries({ queryKey: ['total_cart'] })
      }
    })
  }
}
