import { useMutation, useQuery } from '@tanstack/react-query'
import * as authApi from '../api'
import { deleteCookie } from 'cookies-next/client'
import { useRouter } from 'nextjs-toploader/app'

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile
  })
}

export function useLogout() {
  const router = useRouter()

  const logout = () => {
    deleteCookie('user')
    deleteCookie('access_token')
    deleteCookie('refresh_token')
    router.push('/signin')
    router.refresh()
  }

  return { logout }
}
