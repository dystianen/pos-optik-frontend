export type TPayloadLogin = {
  customer_email: string
  customer_password: string
}

export type TPayloadRegister = {
  customer_name: string
  customer_email: string
  customer_password: string
  customer_phone: string
  customer_dob: Date
  customer_gender: string
  customer_occupation: string
  customer_eye_history: string
  customer_preferences: string
}

export type TResLogin = {
  success: boolean
  message: string
  data: {
    access_token: string
    refresh_token: string
    user: TUser
  }
}

export type TResRegister = {
  success: boolean
  message: string
  data: any
}

export type TUser = {
  id: string
  name: string
  email: string
}
