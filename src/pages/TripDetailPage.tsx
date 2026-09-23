import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { getTrip, getTripSegments } from '../api/trips'
import type { Trip, TripSegment } from '../types/trip'
import { Layout } from '../components/Layout'
import { TripMap } from '../components/TripMap'
import { STATUS_LABELS, SEGMENT_LABELS, SEGMENT_COLORS } from '../constants/trip'

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { token } = useAuth()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [segments, setSegments] = useState<TripSegment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || !tripId) return
    setIsLoading(true)
    setError(null)

    getTrip(token, tripId)
      .then((loadedTrip) => {
        setTrip(loadedTrip)
        if (loadedTrip.status === 'COMPLETED') {
          return getTripSegments(token, tripId).then(setSegments)
        }
        return undefined
      })
      .catch(() => setError('No se pudo cargar el viaje.'))
      .finally(() => setIsLoading(false))
  }, [token, tripId])

  return (
    <Layout>
      <Link
        to="/viajes"
        className="mb-4 inline-block text-sm text-on-surface-variant hover:text-on-surface"
      >
        ← Volver a viajes
      </Link>

      {isLoading && <p className="text-on-surface-variant">Cargando...</p>}
      {error && <p className="text-error">{error}</p>}

      {trip && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-medium">
              {trip.origin_name} → {trip.destination_name}
            </h1>
            <span className="rounded-full bg-surface-variant px-3 py-1 text-xs text-on-surface-variant">
              {STATUS_LABELS[trip.status]}
            </span>
          </div>

          <div className="mb-6">
            <TripMap trip={trip} />
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatBlock
              label="Distancia"
              value={trip.distance_km != null ? `${trip.distance_km.toFixed(1)} km` : '—'}
            />
            <StatBlock
              label="Vel. maxima"
              value={trip.max_speed != null ? `${trip.max_speed.toFixed(1)} km/h` : '—'}
            />
            <StatBlock
              label="Vel. minima"
              value={trip.min_speed != null ? `${trip.min_speed.toFixed(1)} km/h` : '—'}
            />
            <StatBlock
              label="Vel. promedio"
              value={trip.avg_speed != null ? `${trip.avg_speed.toFixed(1)} km/h` : '—'}
            />
          </div>

          {segments.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-medium text-on-surface-variant">Tramos</h2>
              <div className="flex flex-col gap-2">
                {segments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-surface px-4 py-2"
                  >
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${SEGMENT_COLORS[segment.segment_type]}`}
                    >
                      {SEGMENT_LABELS[segment.segment_type]}
                    </span>
                    <span className="text-sm text-on-surface-variant">
                      {segment.avg_speed.toFixed(1)} km/h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3">
      <p className="text-xs text-on-surface-variant">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  )
}
