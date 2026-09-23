import { API_BASE_URL } from './client'

interface LoginResponse {
  access_token: string
  token_type: string
}

// The API's /login endpoint expects OAuth2PasswordRequestForm
// (form-urlencoded), not JSON — "username" is the field name FastAPI uses
// even though we send the email as its value (same as the Android app).
export async function login(email: string, password: string): Promise<string> {
  const body = new URLSearchParams()
  body.set('username', email)
  body.set('password', password)

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    throw new Error('Credenciales invalidas')
  }

  const data: LoginResponse = await response.json()
  return data.access_token
}
