import { apiFetch } from './client'
import type { Trip } from '../types/trip'

export function listTrips(token: string, statusFilter?: string): Promise<Trip[]> {
  const query = statusFilter ? `?status_filter=${statusFilter}` : ''
  return apiFetch<Trip[]>(`/api/v1/trips${query}`, {}, token)
}
