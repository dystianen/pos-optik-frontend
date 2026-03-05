import { login, register } from '@/services/authService'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
  return useMutation({
    mutationFn: login
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: register
  })
}
