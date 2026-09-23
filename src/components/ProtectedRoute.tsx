import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
