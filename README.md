# trip-trace-frontend

Dashboard web para [TripTrace](https://github.com/TechVibe-Dev/trip-trace-android-app) — ver métricas, historial de viajes y estadísticas desde el navegador de la computadora. No incluye la parte de llevar a cabo un viaje (crear/iniciar/grabar GPS en tiempo real) — eso sigue siendo trabajo de la app Android o el bot de Telegram; el celular te acompaña en el auto, la notebook no.

Le pega a la misma API (`trip-trace-api`) que la app y el bot — es un cliente más.

React + TypeScript + Vite, con Tailwind CSS. Mismo esquema de colores oscuro que la app Android (fondo `#12151C`, superficies `#1A2030`/`#232833`, primario `#378ADD`, secundario `#EF9F27`, terciario `#1D9E75`).

## Qué tiene

- **Login** contra `trip-trace-api`.
- **Dashboard**: stats agregadas (viajes totales, completados, distancia, velocidad promedio) y un gráfico de distancia por viaje.
- **Viajes**: todos los viajes del usuario, con tabs para filtrar por estado.
- **Detalle de viaje**: mapa (Leaflet + OpenStreetMap, sin API key) con origen/destino/ruta, stats completos, y los tramos lentos/rápidos calculados por la API para viajes completados.

## Setup

Requiere [Node.js](https://nodejs.org/) instalado (18 o más nuevo).

```bash
chmod +x start_dev.sh   # una sola vez
./start_dev.sh
```

`start_dev.sh` crea el `.env` (copiando `.env.default`) si no existe, instala las dependencias si no están (`node_modules`), y levanta el servidor de desarrollo de Vite. Te va a mostrar algo como `Local: http://localhost:5173/` — abrí esa URL en el navegador. Con eso ya podés loguearte con el mismo usuario que usás en la app Android.

`.env` solo hace falta tocarlo si querés que `VITE_API_BASE_URL` apunte a otra cosa que no sea la API en producción (por ejemplo, una instancia corriendo local).

Para correrlo a mano en vez de usar el script: `npm install` y después `npm run dev`.

## Estructura

- `src/api/` — cliente HTTP hacia `trip-trace-api` (auth, trips, segments)
- `src/auth/` — contexto de sesión, token persistido en `localStorage`
- `src/pages/` — Login, Dashboard, Viajes, Detalle de viaje
- `src/components/` — layout compartido, tarjetas de estadísticas, mapa de viaje, ruta protegida
- `src/utils/polyline.ts` — decodificador del encoded polyline de Google (usado por `planned_route_polyline`)

## Ramas y releases

Mismo flujo que el resto de los repos de TripTrace: `feature/`, `hotfix/`, `release/x.y.z` contra `develop`, que después se promueve a `main`. `CHANGELOG.md` seguí el formato [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
