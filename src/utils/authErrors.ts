import { ApiError } from '../api/client'

// "45 segundos", "1 minuto", "2 minutos", "1 hora" — rounds up, so the
// message never promises a wait shorter than the real one.
export function formatWait(seconds: number): string {
  if (seconds < 60) {
    const rounded = Math.ceil(seconds)
    return `${rounded} ${rounded === 1 ? 'segundo' : 'segundos'}`
  }
  const minutes = Math.ceil(seconds / 60)
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
  }
  const hours = Math.ceil(minutes / 60)
  return `${hours} ${hours === 1 ? 'hora' : 'horas'}`
}

export function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return error.retryAfterSeconds != null
        ? `Demasiados intentos. Probá de nuevo en ${formatWait(error.retryAfterSeconds)}.`
        : 'Demasiados intentos. Probá de nuevo en unos minutos.'
    }
    if (error.status === 400) {
      return 'No se pudo iniciar sesión. Revisá tu email y contraseña.'
    }
    return 'Algo salió mal en el servidor. Probá de nuevo en un rato.'
  }
  // Not an ApiError: fetch() itself rejected, meaning the request never got a
  // response at all (offline, DNS failure, blocked by CORS...).
  return 'No se pudo conectar. Revisá tu conexión y probá de nuevo.'
}
