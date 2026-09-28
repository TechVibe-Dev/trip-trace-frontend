export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'https://trip-trace-api.onrender.com'

export class ApiError extends Error {
  status: number
  // Seconds to wait before retrying — only set on a 429 from the API's rate
  // limiter (see parseRetryAfterSeconds), null for every other error.
  retryAfterSeconds: number | null

  constructor(message: string, status: number, retryAfterSeconds: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

// The API's 429 body looks like {"detail": "...", "retry_after_seconds": 60}
// (trip-trace-api#67). Read from the body on purpose, not from the standard
// Retry-After header: from a browser, a cross-origin fetch can't see
// response headers outside the CORS-safelisted set unless the server lists
// them in Access-Control-Expose-Headers, and Retry-After isn't safelisted —
// response.headers.get('Retry-After') would just come back null here.
export function parseRetryAfterSeconds(body: string): number | null {
  try {
    const parsed: unknown = JSON.parse(body)
    if (typeof parsed === 'object' && parsed !== null) {
      const value = (parsed as Record<string, unknown>).retry_after_seconds
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        return value
      }
    }
  } catch {
    // Body wasn't JSON (a proxy's plain-text error page, say) — nothing to extract.
  }
  return null
}

// Builds the ApiError for a non-ok response. Shared by apiFetch and by
// requests that don't go through it (login sends form-urlencoded, not JSON).
export async function errorFromResponse(response: Response): Promise<ApiError> {
  const detail = await response.text()
  const retryAfterSeconds = response.status === 429 ? parseRetryAfterSeconds(detail) : null
  return new ApiError(detail || response.statusText, response.status, retryAfterSeconds)
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw await errorFromResponse(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
