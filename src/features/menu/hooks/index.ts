import * as menuApi from '../api'
import { useQuery } from '@tanstack/react-query'

export function useMenu() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: menuApi.getMenu
  })
}
