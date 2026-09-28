# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Trip detail map: a "Mostrar ruta planeada" checkbox that also draws the planned route (`planned_route_polyline`, dashed gray, under the real one) to compare the two — the map re-fits to include both while it's on. Trips with no recorded points yet (not run) show their planned route directly, with no checkbox; since the real-route change above, those trips showed no route at all. Closes `trip-trace-frontend#11`. ([#13](https://github.com/TechVibe-Dev/trip-trace-frontend/pull/13))
- Trip detail map now draws the trip's actual recorded route (`GET /trips/{id}/gps-points`), colored per-segment (SLOW/NORMAL/FAST, from `GET /trips/{id}/segments`) instead of a single solid color — replaces the previous `planned_route_polyline` display and the separate Tramos list below the map. ([trip-trace-frontend#6](https://github.com/TechVibe-Dev/trip-trace-frontend/issues/6))
- Added a CI workflow that runs `npm ci` and `npm run build` (type-check + production build) on push/PR. ([#2](https://github.com/TechVibe-Dev/trip-trace-frontend/pull/2))
- Configured Dependabot (npm + github-actions), monthly. ([#2](https://github.com/TechVibe-Dev/trip-trace-frontend/pull/2))
- Initial React + TypeScript + Vite scaffold, with Tailwind CSS matching the Android app's dark color palette.
- Login page against `trip-trace-api` (JWT stored in `localStorage`).
- Dashboard page: stats across all trips (total, completed, distance, avg speed) and a distance-per-trip bar chart (Recharts) for the last 10 completed trips.
- Viajes page: every trip regardless of status, with client-side filter tabs (Todos/Planeados/En curso/Completados). Replaces the initial Historial page.
- Trip detail page (`/viajes/:tripId`): map (Leaflet + OpenStreetMap), full stats, and the real route colored by segment for completed trips.

### Changed

- Any authenticated API call that comes back 401 (token expired, or invalidated server-side by a password change elsewhere, `trip-trace-api#60`) now logs the user out and redirects to `/login` — previously every screen was left with a raw, uncaught error. Closes `trip-trace-frontend#8`. ([#14](https://github.com/TechVibe-Dev/trip-trace-frontend/pull/14))
- Login now tells apart wrong credentials, being rate limited (429: "Demasiados intentos. Probá de nuevo en N segundos", using the `retry_after_seconds` field the API sends since `trip-trace-api#67`) and connection/server errors, instead of showing "wrong credentials" for everything. Closes `trip-trace-frontend#10`. ([#12](https://github.com/TechVibe-Dev/trip-trace-frontend/pull/12))
