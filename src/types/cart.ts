import { GeneralResponse } from './general'

export type TReqAddToCart = {
  product_id: string
  variant_id: string | null
  quantity: number
}

export type TTotalCart = {
  order_id: string
  total_items: number
}

export type TResTotalCart = GeneralResponse<TTotalCart>

export type TCartItem = {
  cart_item_id: string
  product_id: string
  variant_id: string | null
  product_name: string
  variant_name: string | null
  image: string | null
  price: string
  quantity: number
  subtotal: string
}

export type TCart = {
  items: TCartItem[]
  summary: {
    total_qty: number
    total_price: string
  }
}

export type TResCart = GeneralResponse<TCart>
