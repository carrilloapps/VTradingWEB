# Módulo de Mercados

Este directorio gestiona la vista detallada de los mercados (`/mercados`). Es una de las secciones más complejas y ricas en datos de la aplicación.

## Arquitectura
*   **`page.tsx` (Server):**
    *   Carga datos iniciales (SSR) para SEO y primera pintura rápida.
    *   Llama a `fetchMarketData` de `lib/vtrading-api`.
*   **`MercadosContent.tsx` (Client):**
    *   Interfaz principal tipo Dashboard / Bento Grid.
    *   Maneja actualización en tiempo real (polling o recarga manual).
    *   Muestra gráficas (`TrendChart`) y tablas.

## Componentes Clave
*   **Layout:** Utiliza un diseño **Bento Grid** implementado con CSS Grid y Material UI `Box`/`Grid`.
*   **Gráficos:** SVG customizado en `TrendChart` (dentro de `MercadosContent` o componente separado).
*   **Listas:** `MarketRow` para mostrar pares de divisas de forma compacta.

## Integración de Datos
*   Consume `RatesResponse`, `BanksResponse` y `BVCMarketData`.
*   **Lógica Especial:** Normalización de datos bancarios para mostrar solo "Fuente" y "Valor", ocultando variaciones si así se requiere.

## Reglas para Modificar
1.  **Diseño:** Mantener la consistencia del Bento Grid. Usar `gridTemplateColumns` responsivo.
2.  **Performance:** No bloquear el hilo principal con cálculos pesados. Usar `useMemo` para procesar datos de gráficas.
3.  **Resiliencia:** Manejar casos donde la API devuelva arrays vacíos o nulos (mostrar "DATOS NO DISPONIBLES" en lugar de crashear).
