import * as shippingApi from '../api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useShipping() {
  return useQuery({
    queryKey: ['shipping'],
    queryFn: shippingApi.getShipping
  })
}

export function useAllShippingAddress() {
  return useQuery({
    queryKey: ['SHIPPING_ADDRESSES'],
    queryFn: shippingApi.getAllShippingAddress
  })
}

export function useGetShippingAddress(id: string) {
  return useQuery({
    queryKey: ['SHIPPING_ADDRESS', id],
    queryFn: () => shippingApi.getShippingAddress(id),
    enabled: !!id
  })
}

export function useSaveCustomerShipping() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: shippingApi.saveCustomerShipping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SHIPPING_ADDRESSES'] })
    }
  })
}

export function useProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: shippingApi.getProvinces,
    staleTime: 1000 * 60 * 60
  })
}

export function useCities(provinceId?: string) {
  return useQuery({
    queryKey: ['cities', provinceId],
    queryFn: () => shippingApi.getCities(provinceId),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60
  })
}

export function useCalculateShippingCost() {
  return useMutation({
    mutationFn: (addressId: string) => shippingApi.calculateShippingCost(addressId)
  })
}

export function useDistricts(cityId?: string) {
  return useQuery({
    queryKey: ['districts', cityId],
    queryFn: () => shippingApi.getDistricts(cityId),
    enabled: !!cityId,
    staleTime: 1000 * 60 * 60
  })
}
