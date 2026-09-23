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
