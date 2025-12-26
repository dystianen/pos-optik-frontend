import { PrescriptionPayload } from './cart'
import { GeneralResponse } from './general'

export type TReqCheckout = {
  shipping_address: string
}

export type TReqPayment = {
  proof_of_payment: File
}

export interface TSummaryOrders {
  shipping_address: ShippingAddress
  items: TItemCart[]
  shipping: Shipping
  summary: Summary
}
export type TResSummaryOrders = GeneralResponse<TSummaryOrders>

export interface TItemCart {
  cart_item_id: string
  product_id: string
  variant_id: null | string
  product_name: string
  variant_name: null | string
  image: string
  price: number
  quantity: number
  subtotal: number
  prescription: PrescriptionPayload
}

export interface Shipping {
  service: string
  destination: string
  cost: number
}

export interface ShippingAddress {
  recipient_name: string
  phone: string
  address: string
  city: string
  province: string
  postal_code: string
}

export interface Summary {
  subtotal: number
  shipping_cost: number
  total: number
}
