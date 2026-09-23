import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { listTrips } from '../api/trips'
import type { Trip } from '../types/trip'
import { Layout } from '../components/Layout'
import { StatCard } from '../components/StatCard'

export function DashboardPage() {
  const { token } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    listTrips(token, 'COMPLETED')
      .then(setTrips)
      .catch(() => setError('No se pudieron cargar los viajes.'))
      .finally(() => setIsLoading(false))
  }, [token])

  const totalTrips = trips.length
  const totalDistance = trips.reduce((sum, trip) => sum + (trip.distance_km ?? 0), 0)
  const avgSpeed =
    trips.length > 0
      ? trips.reduce((sum, trip) => sum + (trip.avg_speed ?? 0), 0) / trips.length
      : 0

  return (
    <Layout>
      <h1 className="mb-6 text-xl font-medium">Dashboard</h1>

      {isLoading && <p className="text-on-surface-variant">Cargando...</p>}
      {error && <p className="text-error">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Viajes completados" value={String(totalTrips)} />
            <StatCard label="Distancia total" value={`${totalDistance.toFixed(1)} km`} />
            <StatCard label="Velocidad promedio" value={`${avgSpeed.toFixed(1)} km/h`} />
          </div>

          <h2 className="mb-3 text-sm font-medium text-on-surface-variant">Ultimos viajes</h2>
          {trips.length === 0 ? (
            <p className="text-on-surface-variant">Todavia no hay viajes completados.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {trips.slice(0, 5).map((trip) => (
                <div key={trip.id} className="rounded-lg bg-surface px-4 py-3">
                  <p className="font-medium">
                    {trip.origin_name} → {trip.destination_name}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {trip.distance_km != null ? `${trip.distance_km.toFixed(1)} km` : 'Sin datos'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
