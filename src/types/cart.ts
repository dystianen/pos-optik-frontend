import { GeneralResponse } from './general'

export type TReqAddToCart = {
  product_id: number
  quantity: number
  price: string
}

export type TTotalCart = {
  order_id: string
  total_items: number
}

export type TResTotalCart = GeneralResponse<TTotalCart>

export type TItem = {
  order_item_id: string
  order_id: string
  product_id: string
  quantity: string
  price: string
  category_id: string
  product_name: string
  product_price: string
  product_stock: string
  product_brand: string
  product_image_url: string
  model: string
  duration: string
  material: string
  base_curve: string
  diameter: string
  power_range: string
  water_content: string
  uv_protection: string
  color: string
  coating: string
  created_at: string
  updated_at: string
}

export type TCart = {
  order_id: string
  total_price: string
  items: TItem[]
}

export type TResCart = GeneralResponse<TCart>
