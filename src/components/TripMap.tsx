import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { Trip, TripSegment, GpsPoint } from '../types/trip'
import { SEGMENT_LABELS, SEGMENT_MAP_COLORS } from '../constants/trip'

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

// Buckets the trip's recorded points into per-segment runs, so each stretch
// of the real route can be drawn in its own color. Segments come from
// GET /trips/{id}/segments (SLOW/NORMAL/FAST, classified server-side
// relative to the trip's own average — see trip_stats_service.py) as
// start/end lat/lng + start/end time; matching each point's recorded_at
// against that time range assigns it to the right segment. ISO 8601
// timestamps compare correctly as plain strings, no Date parsing needed.
//
// Each segment "owns" only its own points (compute_trip_segments doesn't
// share boundary points between consecutive segments) — drawing each
// segment's line from just its own points leaves a visible gap between one
// segment's last point and the next segment's first. Appending the next
// segment's first point to the current segment's line closes that gap: the
// two lines then touch exactly at that shared point instead of stopping
// short of each other.
function groupPointsBySegment(
  points: GpsPoint[],
  segments: TripSegment[],
): { segmentType: TripSegment['segment_type']; positions: [number, number][] }[] {
  const groups: { segmentType: TripSegment['segment_type']; positions: [number, number][] }[] = []

  segments.forEach((segment, index) => {
    const segmentPoints = points.filter(
      (point) => point.recorded_at >= segment.start_time && point.recorded_at <= segment.end_time,
    )
    if (segmentPoints.length === 0) return

    const positions = segmentPoints.map((point): [number, number] => [point.lat, point.lng])

    const nextSegment = segments[index + 1]
    const bridgePoint = nextSegment
      ? points.find(
          (point) => point.recorded_at >= nextSegment.start_time && point.recorded_at <= nextSegment.end_time,
        )
      : undefined
    if (bridgePoint) {
      positions.push([bridgePoint.lat, bridgePoint.lng])
    }

    if (positions.length > 1) {
      groups.push({ segmentType: segment.segment_type, positions })
    }
  })

  return groups
}

export function TripMap({
  trip,
  gpsPoints = [],
  segments = [],
}: {
  trip: Trip
  gpsPoints?: GpsPoint[]
  segments?: TripSegment[]
}) {
  const segmentGroups = useMemo(() => groupPointsBySegment(gpsPoints, segments), [gpsPoints, segments])

  // Points not covered by any segment (e.g. no speed reading, so
  // compute_trip_segments couldn't classify them) still get drawn, just in
  // a single neutral color — better than a gap in the line. This is also
  // the fallback for trips with points but no segments at all (too short,
  // or no speed data anywhere).
  const hasSegmentColoring = segmentGroups.length > 0
  const fallbackPositions = useMemo<[number, number][]>(
    () => (hasSegmentColoring ? [] : gpsPoints.map((point) => [point.lat, point.lng])),
    [gpsPoints, hasSegmentColoring],
  )

  const origin: [number, number] = [trip.origin_lat, trip.origin_lng]
  const destination: [number, number] = [trip.destination_lat, trip.destination_lng]
  const allRoutePositions = gpsPoints.map((point): [number, number] => [point.lat, point.lng])
  const boundsPoints = allRoutePositions.length > 0 ? allRoutePositions : [origin, destination]

  return (
    <div>
      <div className="h-80 overflow-hidden rounded-lg">
        <MapContainer center={origin} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={origin} />
          <Marker position={destination} />
          {segmentGroups.map((group, index) => (
            <Polyline
              key={index}
              positions={group.positions}
              color={SEGMENT_MAP_COLORS[group.segmentType]}
            />
          ))}
          {fallbackPositions.length > 1 && <Polyline positions={fallbackPositions} color="#378ADD" />}
          <FitBounds positions={boundsPoints} />
        </MapContainer>
      </div>
      {hasSegmentColoring && (
        <div className="mt-2 flex gap-4">
          {(Object.keys(SEGMENT_MAP_COLORS) as TripSegment['segment_type'][]).map((segmentType) => (
            <div key={segmentType} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: SEGMENT_MAP_COLORS[segmentType] }}
              />
              {SEGMENT_LABELS[segmentType]}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
