import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { listTrips } from '../api/trips'
import type { Trip } from '../types/trip'
import { Layout } from '../components/Layout'

export function HistoryPage() {
  const { token } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    listTrips(token, 'COMPLETED')
      .then(setTrips)
      .catch(() => setError('No se pudieron cargar los viajes.'))
      .finally(() => setIsLoading(false))
  }, [token])

  return (
    <Layout>
      <h1 className="mb-6 text-xl font-medium">Historial</h1>

      {isLoading && <p className="text-on-surface-variant">Cargando...</p>}
      {error && <p className="text-error">{error}</p>}

      {!isLoading && !error && trips.length === 0 && (
        <p className="text-on-surface-variant">Todavia no hay viajes completados.</p>
      )}

      <div className="flex flex-col gap-2">
        {trips.map((trip) => {
          const isExpanded = expandedId === trip.id
          return (
            <button
              key={trip.id}
              onClick={() => setExpandedId(isExpanded ? null : trip.id)}
              className="rounded-lg bg-surface px-4 py-3 text-left"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {trip.origin_name} → {trip.destination_name}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {trip.distance_km != null ? `${trip.distance_km.toFixed(1)} km` : '—'}
                </p>
              </div>

              {isExpanded && (
                <div className="mt-3 grid grid-cols-3 gap-3 border-t border-surface-variant pt-3">
                  <div>
                    <p className="text-xs text-on-surface-variant">Vel. maxima</p>
                    <p className="font-medium">
                      {trip.max_speed != null ? `${trip.max_speed.toFixed(1)} km/h` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Vel. minima</p>
                    <p className="font-medium">
                      {trip.min_speed != null ? `${trip.min_speed.toFixed(1)} km/h` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Vel. promedio</p>
                    <p className="font-medium">
                      {trip.avg_speed != null ? `${trip.avg_speed.toFixed(1)} km/h` : '—'}
                    </p>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Layout>
  )
}
