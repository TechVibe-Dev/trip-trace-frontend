import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../auth/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/historial', label: 'Historial' },
]

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="flex items-center justify-between border-b border-surface-variant bg-surface px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-lg font-medium text-primary">TripTrace</span>
          <nav className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={
                  location.pathname === item.to
                    ? 'text-sm font-medium text-primary'
                    : 'text-sm text-on-surface-variant hover:text-on-surface'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={logout}
          className="text-sm text-on-surface-variant hover:text-on-surface"
        >
          Cerrar sesion
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}
