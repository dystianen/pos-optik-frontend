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

export type TProfile = {
  personal_info: {
    customer_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_dob: string
    customer_gender: string
    customer_occupation?: string
    created_at: string
    updated_at: string
  }
  preferences_history: {
    eye_history: {
      last_check: string
      diagnosis: string
      left_eye: {
        sph: number
        cyl: number
        axs: number
      }
      right_eye: {
        sph: number
        cyl: number
        axs: number
      }
    } | null
  }
}

export type TResProfile = {
  success: boolean
  message: string
  data: TProfile
}
