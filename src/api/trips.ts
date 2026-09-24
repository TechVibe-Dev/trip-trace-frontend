import { API_BASE_URL, apiFetch } from './client'
import type { Trip, TripSegment, GpsPoint } from '../types/trip'

export function listTrips(token: string, statusFilter?: string): Promise<Trip[]> {
  const query = statusFilter ? `?status_filter=${statusFilter}` : ''
  return apiFetch<Trip[]>(`/api/v1/trips${query}`, {}, token)
}

export function getTrip(token: string, tripId: string): Promise<Trip> {
  return apiFetch<Trip>(`/api/v1/trips/${tripId}`, {}, token)
}

export function getTripSegments(token: string, tripId: string): Promise<TripSegment[]> {
  return apiFetch<TripSegment[]>(`/api/v1/trips/${tripId}/segments`, {}, token)
}

// The trip's actually recorded path — see GpsPoint for why this is
// different from trip.planned_route_polyline.
export function getTripGpsPoints(token: string, tripId: string): Promise<GpsPoint[]> {
  return apiFetch<GpsPoint[]>(`/api/v1/trips/${tripId}/gps-points`, {}, token)
}

// Re-exported so pages that only need trips.ts don't also have to import
// from client.ts directly.
export { API_BASE_URL }
