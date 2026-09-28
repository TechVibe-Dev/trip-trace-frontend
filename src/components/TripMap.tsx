import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Pane, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { Trip, TripSegment, GpsPoint } from '../types/trip'
import { PLANNED_ROUTE_MAP_COLOR, SEGMENT_LABELS, SEGMENT_MAP_COLORS } from '../constants/trip'
import { decodePolyline } from '../utils/polyline'

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
  const [showPlanned, setShowPlanned] = useState(false)

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

  // The route Google suggested when the trip was created, decoded once per
  // polyline. Trips whose calculate-route call failed have none.
  const plannedPositions = useMemo<[number, number][]>(
    () => (trip.planned_route_polyline ? decodePolyline(trip.planned_route_polyline) : []),
    [trip.planned_route_polyline],
  )
  const hasPlannedRoute = plannedPositions.length > 1
  const hasRealRoute = gpsPoints.length > 0
  // The checkbox only makes sense when there's something to compare against.
  // A trip with no recorded points (one that hasn't run yet) has nothing else
  // to draw, so its planned route is simply shown, with no checkbox.
  const canTogglePlanned = hasPlannedRoute && hasRealRoute
  const plannedVisible = hasPlannedRoute && (!hasRealRoute || showPlanned)

  const { origin_lat, origin_lng, destination_lat, destination_lng } = trip
  const origin: [number, number] = [origin_lat, origin_lng]
  const destination: [number, number] = [destination_lat, destination_lng]

  // Fit the view to the real route when there is one, plus the planned route
  // while it's visible (it can wander outside the real one — a detour, or a
  // trip ended early). Memoized so the map only re-fits when these inputs
  // actually change, e.g. when the checkbox is toggled.
  const boundsPoints = useMemo<[number, number][]>(() => {
    const realPositions = gpsPoints.map((point): [number, number] => [point.lat, point.lng])
    const positions = plannedVisible ? [...realPositions, ...plannedPositions] : realPositions
    return positions.length > 0
      ? positions
      : [
          [origin_lat, origin_lng],
          [destination_lat, destination_lng],
        ]
  }, [gpsPoints, plannedVisible, plannedPositions, origin_lat, origin_lng, destination_lat, destination_lng])

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
          {/* Its own pane, just below Leaflet's default overlay pane (z-index
              400), so the planned route always sits UNDER the real one —
              otherwise, toggling the checkbox on after the real route is
              already drawn would add the dashed line on top of it. */}
          {plannedVisible && (
            <Pane name="plannedRoute" style={{ zIndex: 399 }}>
              <Polyline
                positions={plannedPositions}
                color={PLANNED_ROUTE_MAP_COLOR}
                weight={4}
                opacity={0.8}
                dashArray="8 8"
              />
            </Pane>
          )}
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
      {(hasSegmentColoring || plannedVisible || canTogglePlanned) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {hasSegmentColoring &&
            (Object.keys(SEGMENT_MAP_COLORS) as TripSegment['segment_type'][]).map((segmentType) => (
              <div key={segmentType} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: SEGMENT_MAP_COLORS[segmentType] }}
                />
                {SEGMENT_LABELS[segmentType]}
              </div>
            ))}
          {plannedVisible && (
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span
                className="inline-block w-5 border-t-2 border-dashed"
                style={{ borderColor: PLANNED_ROUTE_MAP_COLOR }}
              />
              Planeada
            </div>
          )}
          {canTogglePlanned && (
            <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-on-surface-variant">
              <input
                type="checkbox"
                checked={showPlanned}
                onChange={(event) => setShowPlanned(event.target.checked)}
                className="accent-primary"
              />
              Mostrar ruta planeada
            </label>
          )}
        </div>
      )}
    </div>
  )
}
