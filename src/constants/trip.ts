import type { Trip, TripSegment } from '../types/trip'

export const STATUS_LABELS: Record<Trip['status'], string> = {
  PLANNED: 'Planeado',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}

export const SEGMENT_LABELS: Record<TripSegment['segment_type'], string> = {
  SLOW: 'Lento',
  NORMAL: 'Normal',
  FAST: 'Rapido',
}

export const SEGMENT_COLORS: Record<TripSegment['segment_type'], string> = {
  SLOW: 'bg-secondary/20 text-secondary',
  NORMAL: 'bg-surface-variant text-on-surface-variant',
  FAST: 'bg-tertiary/20 text-tertiary',
}

// Actual hex values (not Tailwind classes) for coloring each segment's
// stretch of the route on the map — Leaflet's Polyline color prop needs a
// real CSS color, not a class name. Matches the app's own palette:
// secondary (amber) for slow, primary (blue) for normal, tertiary (green)
// for fast.
export const SEGMENT_MAP_COLORS: Record<TripSegment['segment_type'], string> = {
  SLOW: '#EF9F27',
  NORMAL: '#378ADD',
  FAST: '#1D9E75',
}
