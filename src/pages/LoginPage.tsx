import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { token, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (token) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('No se pudo iniciar sesion. Revisa tu email y contrasena.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-surface p-8">
        <h1 className="mb-1 text-center text-2xl font-medium text-primary">TripTrace</h1>
        <p className="mb-6 text-center text-sm text-on-surface-variant">Iniciar sesion</p>

        <label className="mb-1 block text-sm text-on-surface-variant" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          className="mb-4 w-full rounded-md border border-surface-variant bg-background px-3 py-2 text-on-surface outline-none focus:border-primary"
          required
        />

        <label className="mb-1 block text-sm text-on-surface-variant" htmlFor="password">
          Contrasena
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          className="mb-4 w-full rounded-md border border-surface-variant bg-background px-3 py-2 text-on-surface outline-none focus:border-primary"
          required
        />

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary py-2 font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Ingresando...' : 'Iniciar sesion'}
        </button>
      </form>
    </div>
  )
}
