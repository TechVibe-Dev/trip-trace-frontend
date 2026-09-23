# trip-trace-frontend

Dashboard web para [TripTrace](https://github.com/TechVibe-Dev/trip-trace-android-app) — ver métricas, historial de viajes y estadísticas desde el navegador de la computadora. No incluye la parte de llevar a cabo un viaje (crear/iniciar/grabar GPS en tiempo real) — eso sigue siendo trabajo de la app Android o el bot de Telegram; el celular te acompaña en el auto, la notebook no.

Le pega a la misma API (`trip-trace-api`) que la app y el bot — es un cliente más.

React + TypeScript + Vite, con Tailwind CSS. Mismo esquema de colores oscuro que la app Android (fondo `#12151C`, superficies `#1A2030`/`#232833`, primario `#378ADD`, secundario `#EF9F27`, terciario `#1D9E75`).

## Setup

```bash
npm install
cp .env.default .env
npm run dev
```

`.env` solo necesita `VITE_API_BASE_URL` si querés apuntar a otra cosa que no sea la API en producción (por ejemplo, una instancia corriendo local).

## Estructura

- `src/api/` — cliente HTTP hacia `trip-trace-api` (auth, trips)
- `src/auth/` — contexto de sesión, token persistido en `localStorage`
- `src/pages/` — Login, Dashboard, Historial
- `src/components/` — layout compartido, tarjetas de estadísticas, ruta protegida

## Ramas y releases

Mismo flujo que el resto de los repos de TripTrace: `feature/`, `hotfix/`, `release/x.y.z` contra `develop`, que después se promueve a `main`. `CHANGELOG.md` seguí el formato [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
