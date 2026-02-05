# Documentación de Utilidades y Librerías

Este directorio es el núcleo de la lógica de negocio, integración con APIs externas y utilidades compartidas. **Es la capa más crítica para la integridad de los datos.**

## Módulos Principales

### 1. Integración VTrading API (`vtrading-api.ts` | `vtrading-types.ts`)

- **Propósito:** Cliente HTTP tipado para comunicar con el backend de VTrading.
- **Regla #1:** NUNCA hacer fetch directo en componentes. Usar estas funciones.
- **Archivos:**
  - `vtrading-types.ts`: Definiciones TypeScript (Interfaces). **Actualizar si la API cambia.**
  - `vtrading-api.ts`: Implementación de los endpoints.

### 2. Firebase (`firebase.ts`)

- **Propósito:** Inicialización de Firebase SDK (Auth, Analytics, Firestore).
- **Uso:** Singleton que exporta `auth`, `db`, `analytics`.
- **Config:** Depende de variables de entorno `NEXT_PUBLIC_FIREBASE_*`.

### 3. Tema (`theme.ts`)

- **Propósito:** Definición del tema de Material UI (Paleta de colores, tipografía, breakpoints).
- **Personalización:** Aquí se definen los modos `light` y `dark`.

## Guía de Uso para IAs

- **Si necesitas datos:** Importa desde `@/lib/vtrading-api`.
- **Si necesitas tipos:** Importa desde `@/lib/vtrading-types`.
- **Si necesitas Auth:** Importa `auth` de `@/lib/firebase`.

## Validación

Cualquier cambio en este directorio requiere una verificación exhaustiva de tipos:

```bash
npx tsc --noEmit
```

Un error aquí puede romper toda la aplicación.
