'use server'

import { TUser } from '@/types/auth'
import { cookies } from 'next/headers'

const setAccessToken = async (accessToken: string) => {
  const cookieStore = await cookies()
  cookieStore.set('accessToken', accessToken)
}

const getAccessToken = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')
  return accessToken
}

const setRefreshToken = async (token: string) => {
  const cookieStore = await cookies()
  cookieStore.set('refreshToken', token)
}

const getRefreshToken = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('refreshToken')
  return accessToken
}

const removeTokens = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  cookieStore.delete('user')
}

const setUser = async (data: string) => {
  const cookieStore = await cookies()
  cookieStore.set('user', data)
}

const getUser = async (): Promise<TUser | null> => {
  const cookieStore = await cookies()
  const data = cookieStore.get('user')

  if (!data?.value) return null

  try {
    return JSON.parse(data.value) as TUser
  } catch (error) {
    console.error('Invalid user cookie', error)
    return null
  }
}

const removeUser = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('user')
}

export {
  getAccessToken,
  getRefreshToken,
  getUser,
  removeTokens,
  removeUser,
  setAccessToken,
  setRefreshToken,
  setUser
}
