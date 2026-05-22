import axios from 'axios'

/**
 * Normalized API error thrown by the global axios interceptor.
 * All `onError` handlers receive this instead of raw AxiosError / Error,
 * so callers never need to cast or access `err.response` manually.
 */
export class ApiError extends Error {
  statusCode: number
  errors: Record<string, string> | null

  constructor(message: string, statusCode = 0, errors: Record<string, string> | null = null) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }
}

/**
 * Convert any unknown thrown value into an `ApiError`.
 * Used inside the axios response interceptor so every rejection
 * is a consistent, typed `ApiError`.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string> }
      | undefined
    const message = data?.message ?? error.message ?? 'An unexpected error occurred'
    const statusCode = error.response?.status ?? 0
    const errors = data?.errors ?? null
    return new ApiError(message, statusCode, errors)
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError(String(error))
}
