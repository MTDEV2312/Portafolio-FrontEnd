# AGENTS

Guia rapida para agentes de codigo trabajando en este proyecto.

## Stack y objetivo

- Astro 5 con salida estatica (SSG).
- Tailwind CSS v4 via Vite.
- TypeScript estricto.
- Deploy en Vercel.

## Comandos principales

Ejecutar desde la raiz del proyecto:

- `npm install`
- `npm run dev` - servidor local en puerto 4321.
- `npm run check` - chequeo de tipos para Astro/TS.
- `npm run build` - corre `astro check && astro build`.
- `npm run preview` - sirve el build localmente.
- `npm run clean` - limpia `dist` y `.astro`.

Notas:

- `npm run build:production` apunta a `build-production.js`, archivo no presente en el repo. No usar salvo que se cree ese script.

## Mapa de arquitectura

- `src/pages/`: rutas Astro (`index.astro`, `admin.astro`).
- `src/layouts/`: layout global y secciones compartidas (`Layout.astro`, `nav.astro`, `footer.astro`).
- `src/components/`: componentes de UI para el sitio publico.
- `src/components/admin/`: componentes exclusivos del panel admin.
- `src/services/`: logica de datos/autenticacion/estado del panel admin.
- `src/styles/global.css`: Tailwind v4 + tokens de tema (`@theme`).
- `public/`: archivos estaticos servidos sin procesamiento.

## Convenciones del proyecto

- Componentes en `.astro`; servicios en `.ts` dentro de `src/services/`.
- Nombres de tipos/interfaces en PascalCase; props/campos en camelCase.
- Mantener responsabilidades claras:
  - UI en `src/components/` y `src/layouts/`.
  - acceso a API, auth y cache en `src/services/`.
- Reutilizar estado y cache existentes antes de introducir nuevas soluciones.

## Flujo de datos y estado admin

- `src/services/api.ts`: fetch para datos del portfolio y fallback para SSG.
- `src/services/apiClient.ts`: cliente HTTP central con token Bearer cuando existe.
- `src/services/adminState.ts`: singleton de estado admin + cache con TTL.
- `src/services/dataManager.ts`: cache y deduplicacion de requests.
- `src/services/authMiddleware.ts`: login/logout/guardas de autenticacion.

## Gotchas importantes

- Requiere `PUBLIC_API_URL` para requests; revisar `.env.example`.
- Durante build SSG puede ejecutarse fetch de datos: no romper ese flujo con dependencias solo de browser.
- `localStorage` y `window` existen solo en cliente: proteger uso en codigo compartido.
- En dev existe proxy `/api` definido en `astro.config.mjs`; en produccion hay rewrite en `vercel.json`.

## Archivos clave para consultar

- `astro.config.mjs` - salida SSG, plugin de Tailwind, proxy dev.
- `vercel.json` - rewrites y headers de seguridad/cache en despliegue.
- `.env.example` - variables de entorno esperadas.
- `src/pages/admin.astro` - flujo de pagina admin.
- `README.md` - comandos base de Astro.

## Alcance de cambios para agentes

- Mantener cambios acotados al requerimiento.
- No renombrar/mover estructura de carpetas sin justificacion explicita.
- Evitar agregar dependencias si puede resolverse con utilidades existentes.
- Si se toca auth/cache/api, validar que no se rompa el panel admin.