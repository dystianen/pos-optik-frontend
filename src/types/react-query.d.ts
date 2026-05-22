import { ApiError } from '@/lib/axiosErrorHelper'

/**
 * Global default error type for ALL React Query hooks (useQuery, useMutation, etc.)
 * Declared once here — no need to specify TError generic anywhere in the app.
 * @see https://tanstack.com/query/latest/docs/framework/react/typescript#registering-a-global-error
 */
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}
