# AGENTS

Guia rapida para agentes de codigo trabajando en este proyecto.

## Stack y objetivo

- Astro 5 con salida estatica (SSG).
- React 19 vía @astrojs/react para componentes interactivos del portfolio.
- Tailwind CSS v4 via Vite.
- TypeScript estricto.
- Supabase como PaaS / BaaS exclusivo (sin backend en Render).
- Deploy en Vercel.

## Comandos principales

Ejecutar desde la raiz del proyecto:

- `pnpm install`
- `pnpm dev` - servidor local en puerto 4321.
- `pnpm check` - chequeo de tipos para Astro/TS.
- `pnpm build` - corre `astro check && astro build`.
- `pnpm preview` - sirve el build localmente.
- `pnpm clean` - limpia `dist` y `.astro`.

Notas:

- `pnpm run build:production` apunta a `build-production.js`, archivo no presente en el repo. No usar salvo que se cree ese script.

## Mapa de arquitectura

- `src/pages/`: rutas Astro (`index.astro`, `admin.astro`).
- `src/layouts/`: layout global y secciones compartidas (`Layout.astro` para admin, `PortfolioLayout.astro` para landing).
- `src/components/`: componentes de UI para el sitio publico y admin.
- `src/components/portfolio/`: componentes interactivos React 19 de la nueva UI (`App.tsx`, `Hero.tsx`, `ProjectScene.tsx`, etc.).
- `src/components/admin/`: componentes exclusivos del panel admin.
- `src/services/`: logica de datos/autenticacion/estado con Supabase.
- `src/styles/portfolio.css`: Tailwind v4 + tokens de la nueva UI editorial.
- `src/styles/global.css`: Tailwind v4 + tokens semanticos del panel admin.
- `public/`: archivos estaticos servidos sin procesamiento.

## Convenciones del proyecto

- Landing publica orquestada con Astro SSG y React 19 (`client:load`).
- Componentes en `.astro` y `.tsx`; servicios en `.ts` dentro de `src/services/`.
- Nombres de tipos/interfaces en PascalCase; props/campos en camelCase.
- Mantener responsabilidades claras:
  - UI en `src/components/` y `src/layouts/`.
  - acceso a base de datos y auth en `src/services/` (Supabase).
- Reutilizar estado y cache existentes antes de introducir nuevas soluciones.

## Flujo de datos y estado admin

- `src/data/projects.ts`: catalogo tipado de proyectos para la nueva UI de alta fidelidad.
- `src/services/api.ts`: consultas a Supabase y fallbacks para SSG.
- `src/services/supabase.ts`: cliente oficial de Supabase.
- `src/services/adminState.ts`: singleton de estado admin + cache con TTL.
- `src/services/dataManager.ts`: cache y deduplicacion de requests.
- `src/services/authMiddleware.ts`: login/logout/guardas de autenticacion con Supabase.

## Gotchas importantes

- Backend en Render ya no existe; el proyecto utiliza exclusivamente Supabase.
- Durante build SSG se renderiza el HTML completo en servidor (islas hidratan con `client:load`).
- `useIsMobile.ts` esta optimizado para SSR (inicializa en `false` y sincroniza en `useEffect`).
- `localStorage` y `window` existen solo en cliente: proteger su uso fuera del ciclo de montaje.

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