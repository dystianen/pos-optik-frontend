export const tokenStorage = {
  setAccessToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  },

  getAccessToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  },

  setRefreshToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token)
    }
  },

  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token')
    }
    return null
  },

  removeTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  },

  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  }
}
