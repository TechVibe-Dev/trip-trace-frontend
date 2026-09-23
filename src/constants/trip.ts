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
