import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { decodePolyline } from '../utils/polyline'
import type { Trip } from '../types/trip'

// Leaflet's default marker icons reference relative image paths that don't
// resolve correctly through a bundler (well-known Leaflet + Vite/webpack
// issue) — this re-points them at the actual bundled asset URLs.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [32, 32] })
    }
  }, [map, positions])

  return null
}

export function TripMap({ trip }: { trip: Trip }) {
  const routePoints = useMemo(
    () => (trip.planned_route_polyline ? decodePolyline(trip.planned_route_polyline) : []),
    [trip.planned_route_polyline],
  )

  const origin: [number, number] = [trip.origin_lat, trip.origin_lng]
  const destination: [number, number] = [trip.destination_lat, trip.destination_lng]
  const boundsPoints = routePoints.length > 0 ? routePoints : [origin, destination]

  return (
    <div className="h-80 overflow-hidden rounded-lg">
      <MapContainer center={origin} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={origin} />
        <Marker position={destination} />
        {routePoints.length > 0 && <Polyline positions={routePoints} color="#378ADD" />}
        <FitBounds positions={boundsPoints} />
      </MapContainer>
    </div>
  )
}
