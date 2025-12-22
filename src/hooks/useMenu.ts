import menuService from '@/services/menuService'
import { useQuery } from '@tanstack/react-query'

export const useMenu = {
  menu() {
    return useQuery({
      queryKey: ['MENU'],
      queryFn: menuService.listMenu
    })
  }
}
