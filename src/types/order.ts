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

export interface OrderItem {
  order_item_id: string
  product_id: string
  product_name: string
  variant_name: string | null
  image: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  order_id: string
  order_date: string
  status: string
  items: OrderItem[]
  summary: {
    grand_total: number
    shipping_cost: number
    total_items: number
  }
  shipping: {
    method: string | null
    rate: number
    courier: string | null
    tracking_number: string | null
    estimated_days: string | null
    address: {
      recipient_name: string
      phone: string
      address: string
      city: string
      province: string
      postal_code: string
    }
  }
  payment: {
    method: string | null
    date: string | null
  }
}

export type TResOrder = GeneralResponse<Order[]>
export type TResOrderDetail = GeneralResponse<Order>

export interface RefundAccount {
  user_refund_account_id: string
  customer_id: string
  account_name: string
  bank_name: string
  account_number: string
  is_default: string
  created_at: Date
  updated_at: Date
  deleted_at: null
}
export type TResRefundAccount = GeneralResponse<RefundAccount>
