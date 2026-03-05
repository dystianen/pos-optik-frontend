import * as cartApi from '../api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart
  })
}

export function useUpdateCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartApi.updateCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['total_cart'] })
    }
  })
}

export function useDeleteCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartApi.deleteCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['total_cart'] })
    }
  })
}

export function useAddCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartApi.addCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['total_cart'] })
    }
  })
}

export function useTotalCart() {
  return useQuery({
    queryKey: ['total_cart'],
    queryFn: cartApi.getTotalCart
  })
}
