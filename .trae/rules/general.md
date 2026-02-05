# VTradingWeb: Contexto y Reglas Maestras

Este documento resume la identidad técnica, arquitectura y reglas de desarrollo del proyecto `vtradingweb`. Úsalo como fuente de verdad.

# Identidad Técnica

- Dominio: `vtrading.app`
- Nombre: VTrading
- Emails:
  - soporte@vtrading.app
  - contacto@vtrading.app

## 1. Stack Tecnológico

- **Core:** Next.js 16.1.4 (App Router)
- **Lenguaje:** TypeScript 5+ (Strict Mode)
- **UI:** Material UI v7 + Emotion (Estilos vía `sx` prop)
- **Backend Services:** Firebase v12 (Auth, Firestore, Analytics)
- **Data Source:** VTrading API (Integración centralizada)

## 2. Arquitectura de Datos (CRÍTICO)

El proyecto utiliza una capa de abstracción estricta para la comunicación de datos.

- **PROHIBIDO:** Usar `fetch` directamente en componentes.
- **OBLIGATORIO:** Importar funciones desde `@/lib/vtrading-api`.
  - Ejemplo: `import { getRates } from '@/lib/vtrading-api';`
- **Tipado:** Usar interfaces de `@/lib/vtrading-types`.
- **Server Actions:** La lógica de mutación y server-side data fetching reside en `app/actions/`.

## 3. Estructura del Proyecto

- **`app/`**: Rutas (App Router).
  - `layout.tsx`: Layout global y Providers.
  - `page.tsx`: Server Components (Data Fetching).
  - `xxxContent.tsx`: Client Components (UI interactiva).
  - `mercados/`: Dashboard principal (Bento Grid).
- **`components/`**: UI Reutilizable (Navbar, Footer, MarketTicker).
- **`lib/`**: Núcleo lógico (`vtrading-api.ts`, `firebase.ts`, `theme.ts`).
- **`context/`**: Estado global (`ThemeContext`).
- **`docs/`**: Documentación técnica detallada.

## 4. Reglas de Desarrollo

1.  **Mobile-First:** Diseña para `xs` primero, luego escala a `md` y `lg`.
2.  **Integridad:** Antes de confirmar, ejecuta:
    - `npx tsc --noEmit` (Verificación de tipos).
    - `npm run lint` (Reglas de estilo).
3.  **Documentación:** Si encuentras un directorio con `AGENTS.md`, léelo antes de editar.

## 5. Referencias Rápidas

- **API Docs:** [docs/VTRADING_API_INTEGRATION.md](../docs/VTRADING_API_INTEGRATION.md)
- **Guía Agentes:** [AGENTS.md](../AGENTS.md)
