import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { login as loginRequest } from '../api/auth'
import { setUnauthorizedHandler } from './unauthorizedHandler'

const TOKEN_STORAGE_KEY = 'triptrace_token'

interface AuthContextValue {
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_STORAGE_KEY))
    setIsLoading(false)
  }, [])

  async function login(email: string, password: string) {
    const newToken = await loginRequest(email, password)
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
  }

  // Registered once, for the lifetime of the app — apiFetch calls this the
  // moment any authenticated request comes back 401 (token expired, or
  // invalidated server-side by a password change elsewhere, trip-trace-api#60).
  // Clearing the token here is enough on its own: ProtectedRoute already
  // watches token via useAuth() and redirects to /login as soon as it goes
  // null, so no separate navigation call is needed here.
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
