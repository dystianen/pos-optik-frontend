export type TReqLogin = {
  customer_email: string
  customer_password: string
}

export type TReqRegister = {
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
