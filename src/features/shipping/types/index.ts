export interface GeneralResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface TReqCustomerShipping {
  customer_id?: string
  recipient_name: string
  phone: string
  address: string
  city: string
  province: string
  postal_code: string
}

export interface TCustomerShipping extends TReqCustomerShipping {
  csa_id: string
}

export type TResCustomerShipping = GeneralResponse<TCustomerShipping>
export type TResCustomerShippingAddresses = GeneralResponse<TCustomerShipping[]>
export type TResShipping = GeneralResponse<any[]>
