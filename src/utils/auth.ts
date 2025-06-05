import { deleteCookie, getCookie, setCookie } from 'cookies-next/client'

const setCookieToken = (accessToken: string) => {
  setCookie('accessToken', accessToken)
}

const getCookieToken = () => {
  const accessToken = getCookie('accessToken')
  return accessToken
}

const removeCookieToken = () => {
  deleteCookie('accessToken')
}

const setUser = (data: string) => {
  localStorage.setItem('user', data)
}

const removeUser = () => {
  localStorage.clear()
}

export { getCookieToken, removeCookieToken, removeUser, setCookieToken, setUser }
