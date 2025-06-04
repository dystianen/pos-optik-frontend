import { login, register } from '@/services/authService'
import { useMutation } from '@tanstack/react-query'

export const useAuth = {
  login() {
    return useMutation({
      mutationFn: login
    })
  },
  register() {
    return useMutation({
      mutationFn: register
    })
  }
}
