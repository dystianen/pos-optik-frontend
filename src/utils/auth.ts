'use server'

import { cookies } from 'next/headers'

const setCookieToken = async (accessToken: string) => {
  const cookieStore = await cookies()
  cookieStore.set('accessToken', accessToken)
}

const getCookieToken = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')
  return accessToken
}

const removeCookieToken = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
}

const setUser = async (data: string) => {
  const cookieStore = await cookies()
  cookieStore.set('user', data)
}

const removeUser = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('user')
}

export { getCookieToken, removeCookieToken, removeUser, setCookieToken, setUser }
