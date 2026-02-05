# Guía Maestra para Agentes IA - VTradingWeb

Este documento define las directrices maestras, la arquitectura y las reglas de desarrollo para cualquier Agente IA que trabaje en este proyecto. **Es obligatorio seguir estas normas antes de considerar cualquier tarea como completada.**

## 1. Identidad del Proyecto

**Nombre:** vtradingweb
**Stack Tecnológico:**

- **Framework:** Next.js 16.1.4 (App Router)
- **Lenguaje:** TypeScript 5+ (Strict Mode)
- **UI:** Material UI v7 + Emotion
- **Backend/API:** VTrading API (Integración tipada en `lib/`)
- **Estado:** React Context + Server Actions
- **Auth/Backend Services:** Firebase v12

## 2. Reglas de Oro para el Desarrollo

### A. Integridad del Código (Checklist Obligatorio)

Antes de confirmar cualquier cambio, DEBES verificar:

1.  **Compilación TypeScript:** Ejecutar `npx tsc --noEmit` para asegurar que no hay errores de tipos.
    - _Nota:_ No supongas que funciona solo porque no ves errores en un archivo.
2.  **Linting:** Ejecutar `npm run lint` para cumplir con las reglas de ESLint/Next.js.
3.  **No romper la build:** Si editas componentes compartidos (`components/`), verifica que no afecten a otras páginas.

### B. Arquitectura de Datos

- **NO usar `fetch` nativo en componentes:** Todas las llamadas a datos externos deben pasar por `lib/vtrading-api.ts`.
- **Tipado Estricto:** Usa siempre las interfaces de `lib/vtrading-types.ts`. Evita `any` a toda costa.
- **Server Actions:** La lógica de negocio y mutaciones debe residir en `app/actions/`.

### C. Estilo y UI

- **Material UI:** Usa componentes de `@mui/material`.
- **Estilos:** Preferencia por la prop `sx={{ ... }}` para estilos inline mantenibles y con acceso al tema.
- **Responsive:** Diseña siempre pensando en Mobile-First (`xs`) y luego escala (`md`, `lg`).

## 3. Mapa de Documentación (AGENTS.md Locales)

Cada directorio clave tiene su propio `AGENTS.md` con detalles específicos:

- [`app/AGENTS.md`](./app/AGENTS.md) -> Routing, Layouts y Pages.
- [`app/actions/AGENTS.md`](./app/actions/AGENTS.md) -> Server Actions y Lógica de Servidor.
- [`app/mercados/AGENTS.md`](./app/mercados/AGENTS.md) -> Módulo de Mercados (Feature específico).
- [`components/AGENTS.md`](./components/AGENTS.md) -> Biblioteca de Componentes UI.
- [`context/AGENTS.md`](./context/AGENTS.md) -> Estado Global y Temas.
- [`lib/AGENTS.md`](./lib/AGENTS.md) -> Utilidades, API Clients y Tipos.

## 4. Flujo de Trabajo Recomendado para IAs

1.  **Leer Contexto:** Lee este archivo y el `AGENTS.md` del directorio donde vas a trabajar.
2.  **Planificar:** Identifica qué componentes y funciones de la API necesitas.
3.  **Implementar:** Escribe el código siguiendo TS Strict.
4.  **Verificar:** `npx tsc --noEmit` + `npm run lint`.
5.  **Documentar:** Si creas algo nuevo y complejo, actualiza el `AGENTS.md` local.
