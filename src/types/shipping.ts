import { GeneralResponse } from './general'
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

export type TResCustomerShipping = GeneralResponse<TReqCustomerShipping>
export type TResCustomerShippingAddresses = GeneralResponse<TCustomerShipping[]>
