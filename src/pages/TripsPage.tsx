import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { listTrips } from '../api/trips'
import type { Trip } from '../types/trip'
import { Layout } from '../components/Layout'
import { STATUS_LABELS } from '../constants/trip'

const FILTERS: { label: string; value: Trip['status'] | 'ALL' }[] = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Planeados', value: 'PLANNED' },
  { label: 'En curso', value: 'IN_PROGRESS' },
  { label: 'Completados', value: 'COMPLETED' },
]

export function TripsPage() {
  const { token } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Trip['status'] | 'ALL'>('ALL')

  useEffect(() => {
    if (!token) return
    // No status_filter here on purpose — we fetch every trip once and
    // filter client-side, so switching tabs doesn't refetch.
    listTrips(token)
      .then(setTrips)
      .catch(() => setError('No se pudieron cargar los viajes.'))
      .finally(() => setIsLoading(false))
  }, [token])

  const filteredTrips = filter === 'ALL' ? trips : trips.filter((trip) => trip.status === filter)

  return (
    <Layout>
      <h1 className="mb-4 text-xl font-medium">Viajes</h1>

      <div className="mb-6 flex gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={
              filter === item.value
                ? 'rounded-full bg-primary px-3 py-1 text-sm text-white'
                : 'rounded-full bg-surface px-3 py-1 text-sm text-on-surface-variant hover:text-on-surface'
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-on-surface-variant">Cargando...</p>}
      {error && <p className="text-error">{error}</p>}

      {!isLoading && !error && filteredTrips.length === 0 && (
        <p className="text-on-surface-variant">No hay viajes para este filtro.</p>
      )}

      <div className="flex flex-col gap-2">
        {filteredTrips.map((trip) => (
          <Link
            key={trip.id}
            to={`/viajes/${trip.id}`}
            className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 hover:bg-surface-variant"
          >
            <div>
              <p className="font-medium">
                {trip.origin_name} → {trip.destination_name}
              </p>
              <p className="text-sm text-on-surface-variant">{STATUS_LABELS[trip.status]}</p>
            </div>
            <p className="text-sm text-on-surface-variant">
              {trip.distance_km != null ? `${trip.distance_km.toFixed(1)} km` : '—'}
            </p>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
