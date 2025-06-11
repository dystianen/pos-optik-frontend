import cartService from '@/services/cartService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCart = {
  addToCart() {
    const queryClient = useQueryClient()

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
  }
}
