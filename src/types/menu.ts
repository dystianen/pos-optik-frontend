import { GeneralResponse } from './general'

export type SubmenuItem = {
  label: string
  href: string
}

export type HeaderItem = {
  id: number
  label: string
  href: string
  submenu?: SubmenuItem[]
}

export interface TMenu {
  category_id: string
  category_name: string
  category_description: string
  created_at: Date
  updated_at: Date
  deleted_at: null
}

export type TResMenu = GeneralResponse<TMenu[]>
