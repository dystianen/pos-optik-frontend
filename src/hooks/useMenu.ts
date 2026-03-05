import menuService from '@/services/menuService'
import { useQuery } from '@tanstack/react-query'

export function useMenu() {
  return useQuery({
    queryKey: ['MENU'],
    queryFn: menuService.listMenu
  })
}
