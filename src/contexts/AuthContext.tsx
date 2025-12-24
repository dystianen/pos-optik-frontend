'use client'

import { tokenStorage } from '@/utils/auth'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (accessToken: string, refreshToken: string, userData: User) => void
  logout: () => void
  updateUser: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user dari localStorage saat pertama kali mount
  useEffect(() => {
    const userData = tokenStorage.getUser()
    setUser(userData)
    setLoading(false)
  }, [])

  // ⭐ Function untuk login (dipanggil dari LoginForm)
  const login = (accessToken: string, refreshToken: string, userData: User) => {
    tokenStorage.setAccessToken(accessToken)
    tokenStorage.setRefreshToken(refreshToken)
    tokenStorage.setUser(userData)
    setUser(userData) // ⭐ Update state langsung!
  }

  // Function untuk logout
  const logout = () => {
    tokenStorage.removeTokens()
    setUser(null)
    window.location.href = '/signin'
  }

  // Function untuk update user (opsional)
  const updateUser = (userData: User) => {
    tokenStorage.setUser(userData)
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook untuk pakai auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
