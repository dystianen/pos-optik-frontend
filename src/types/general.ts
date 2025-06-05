export interface GeneralResponse<T = unknown> {
  status: number
  message: string
  data: T
}
