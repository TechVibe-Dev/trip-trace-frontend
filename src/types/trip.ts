// Mirrors the API's TripRead schema — kept in the API's own snake_case
// (no camelCase mapping layer, unlike the Kotlin/Gson side, since plain
// JS/TS objects don't need one).
export interface Trip {
  id: string
  user_id: string
  origin_name: string
  origin_lat: number
  origin_lng: number
  destination_name: string
  destination_lat: number
  destination_lng: number
  planned_route_polyline: string | null
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  planned_departure_at: string | null
  desired_arrival_at: string | null
  calculated_arrival_at: string | null
  started_at: string | null
  ended_at: string | null
  distance_km: number | null
  max_speed: number | null
  min_speed: number | null
  avg_speed: number | null
  created_at: string
  updated_at: string
}

// Mirrors the API's TripSegmentRead (GET /trips/{id}/segments) — slow/fast
// segments computed on the fly from the trip's GPS points.
export interface TripSegment {
  segment_type: 'SLOW' | 'NORMAL' | 'FAST'
  start_lat: number
  start_lng: number
  end_lat: number
  end_lng: number
  start_time: string
  end_time: string
  avg_speed: number
}

// Mirrors the API's GpsPointRead (GET /trips/{id}/gps-points) — the trip's
// actually recorded path, as opposed to planned_route_polyline (Google's
// suggested route at creation time).
export interface GpsPoint {
  id: number
  trip_id: string
  lat: number
  lng: number
  speed: number | null
  accuracy: number | null
  bearing: number | null
  recorded_at: string
}
