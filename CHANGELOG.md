# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial React + TypeScript + Vite scaffold, with Tailwind CSS matching the Android app's dark color palette.
- Login page against `trip-trace-api` (JWT stored in `localStorage`).
- Dashboard page: aggregate stats (trip count, total distance, average speed) and recent completed trips.
- Historial page: completed trips list with expandable per-trip stats (distance, max/min/avg speed).
