import cartService from '@/services/cartService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['total_cart'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}

export function useTotalCart() {
  return useQuery({
    queryKey: ['total_cart'],
    queryFn: cartService.totalCart
  })
}

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartService.cart
  })
}

export function useDeleteItemCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cartService.deleteItemCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['total_cart'] })
    }
  })
}
