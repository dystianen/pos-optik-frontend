import { GeneralResponse } from './general'
import { TItemCart } from './order'

export type PrescriptionPayload = {
  type: 'none' | 'manual'
  right?: {
    sph?: string
    cyl?: string
    axis?: string
    pd?: string
    add?: string
  }
  left?: {
    sph?: string
    cyl?: string
    axis?: string
    pd?: string
    add?: string
  }
}

export type TReqAddToCart = {
  product_id: string
  variant_id: string | null
  quantity: number
  prescription: PrescriptionPayload
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
  price: string | number
  quantity: number
  subtotal: string
  prescription: PrescriptionPayload
}

export type TCart = {
  items: TItemCart[]
  summary: {
    total_qty: number
    total_price: string
  }
}

export type TResCart = GeneralResponse<TCart>
