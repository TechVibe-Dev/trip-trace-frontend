# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added a CI workflow that runs `npm ci` and `npm run build` (type-check + production build) on push/PR. ([#2](https://github.com/TechVibe-Dev/trip-trace-frontend/pull/2))
- Configured Dependabot (npm + github-actions), monthly. ([#2](https://github.com/TechVibe-Dev/trip-trace-frontend/pull/2))
- Initial React + TypeScript + Vite scaffold, with Tailwind CSS matching the Android app's dark color palette.
- Login page against `trip-trace-api` (JWT stored in `localStorage`).
- Dashboard page: stats across all trips (total, completed, distance, avg speed) and a distance-per-trip bar chart (Recharts) for the last 10 completed trips.
- Viajes page: every trip regardless of status, with client-side filter tabs (Todos/Planeados/En curso/Completados). Replaces the initial Historial page.
- Trip detail page (`/viajes/:tripId`): map (Leaflet + OpenStreetMap, decodes `planned_route_polyline`), full stats, and slow/fast/normal segments for completed trips (`GET /trips/{id}/segments`).
