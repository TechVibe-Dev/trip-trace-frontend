import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { listTrips } from '../api/trips'
import type { Trip } from '../types/trip'
import { Layout } from '../components/Layout'
import { StatCard } from '../components/StatCard'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

export function DashboardPage() {
  const { token } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    listTrips(token)
      .then(setTrips)
      .catch(() => setError('No se pudieron cargar los viajes.'))
      .finally(() => setIsLoading(false))
  }, [token])

  const completedTrips = useMemo(
    () => trips.filter((trip) => trip.status === 'COMPLETED'),
    [trips],
  )

  const totalDistance = completedTrips.reduce((sum, trip) => sum + (trip.distance_km ?? 0), 0)
  const avgSpeed =
    completedTrips.length > 0
      ? completedTrips.reduce((sum, trip) => sum + (trip.avg_speed ?? 0), 0) / completedTrips.length
      : 0

  const chartData = useMemo(
    () =>
      [...completedTrips]
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .slice(-10)
        .map((trip) => ({
          name: new Date(trip.created_at).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: '2-digit',
          }),
          km: trip.distance_km ?? 0,
        })),
    [completedTrips],
  )

  return (
    <Layout>
      <h1 className="mb-6 text-xl font-medium">Dashboard</h1>

      {isLoading && <p className="text-on-surface-variant">Cargando...</p>}
      {error && <p className="text-error">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Viajes totales" value={String(trips.length)} />
            <StatCard label="Completados" value={String(completedTrips.length)} />
            <StatCard label="Distancia total" value={`${totalDistance.toFixed(1)} km`} />
            <StatCard label="Velocidad promedio" value={`${avgSpeed.toFixed(1)} km/h`} />
          </div>

          {chartData.length > 0 && (
            <div className="mb-8 rounded-lg bg-surface p-4">
              <h2 className="mb-4 text-sm font-medium text-on-surface-variant">
                Distancia por viaje (ultimos {chartData.length})
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData}>
                  <CartesianGrid stroke="#232833" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#9AA3B2" fontSize={12} />
                  <YAxis stroke="#9AA3B2" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A2030', border: 'none', borderRadius: 8 }}
                    labelStyle={{ color: '#E8EAED' }}
                  />
                  <Bar dataKey="km" fill="#378ADD" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <h2 className="mb-3 text-sm font-medium text-on-surface-variant">Ultimos viajes</h2>
          {completedTrips.length === 0 ? (
            <p className="text-on-surface-variant">Todavia no hay viajes completados.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {completedTrips.slice(0, 5).map((trip) => (
                <Link
                  key={trip.id}
                  to={`/viajes/${trip.id}`}
                  className="rounded-lg bg-surface px-4 py-3 hover:bg-surface-variant"
                >
                  <p className="font-medium">
                    {trip.origin_name} → {trip.destination_name}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {trip.distance_km != null ? `${trip.distance_km.toFixed(1)} km` : 'Sin datos'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
