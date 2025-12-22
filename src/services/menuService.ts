import apiClient from '@/lib/apiClient'
import { TResMenu } from '@/types/menu'

const menuService = {
  async listMenu() {
    const response = await apiClient.get<TResMenu>('/products/categories')
    return response.data.data
  }
}

export default menuService
