# Directorio: app/plan/

## Propósito

Esta carpeta contiene la página de **Planes y Precios** de VTrading, donde los usuarios pueden comparar y seleccionar entre el Plan Free y el Plan Premium.

## Estructura

```
plan/
├── page.tsx           # Metadata y export del componente principal
├── PlanContent.tsx    # Componente Client-Side con todo el diseño
└── AGENTS.md         # Esta documentación
```

## Componentes

### `page.tsx`

- **Tipo:** Server Component (Next.js 16 App Router)
- **Responsabilidades:**
  - Exportar metadata SEO (title, description, canonical, OpenGraph)
  - Renderizar el componente `PlanContent`
- **Nota:** No modificar estructura. Mantener consistencia con otras páginas del proyecto.

### `PlanContent.tsx`

- **Tipo:** Client Component (`'use client'`)
- **Responsabilidades:**
  - Diseño completo de la página de planes
  - Dos tarjetas de precio: Plan Free y Plan Premium
  - Sistema de comparación de características
  - Integración con Material UI v7
- **Dependencias:**
  - `@mui/material` (Box, Container, Typography, Grid, Paper, Button, List, etc.)
  - `@/components/Navbar`
  - `@/components/Footer`
  - Material Icons para características

## Planes Definidos

### Plan Free

- **Precio:** Gratis para siempre
- **Características:**
  - Acceso completo a la app móvil
  - 5 alertas personalizables (solo divisas)
  - Anuncios en la app
  - Calculadora profesional con 2 divisas
  - Programa de referidos (1 mes premium por cada referido premium)

### Plan Premium

- **Precio:** $4.99/mes
- **Características:**
  - Acceso completo a app y web
  - Alertas ilimitadas sobre todos los activos
  - Sin anuncios
  - Divisas ilimitadas en calculadora profesional
  - Personalización de widgets
  - Personalización de imágenes compartidas
  - Programa de referidos (1 mes premium por cada referido premium)

## Sistema de Diseño

- **Layout:** Navbar → Hero Section → Pricing Cards → Payment Methods Carousel → Referral Program (Full-Width) → Footer
- **Estilo:** Consistente con el resto de la aplicación
  - Hero con badge, título grande y descripción
  - Cards con hover effect (translateY + shadow)
  - Plan Premium destacado con badge "Recomendado" y border primary
  - Iconos Material para cada característica
  - Carrusel infinito de métodos de pago con difuminado en bordes
  - Sección de referidos full-width con fondo contrastante
  - Responsive design (xs, md, lg breakpoints)
  - **SIN emojis** en ningún componente

## Acciones de Usuario

- **Plan Free**: Muestra botones de descarga para Android (Google Play) e iOS (App Store) usando el componente `StoreButtons`
- **handlePremiumPlanAction()**: Se ejecuta al seleccionar el Plan Premium
- **Implementación Actual:**
  - Plan Free: Botones de descarga directa de las tiendas
  - Plan Premium: Console.log (placeholder para futura integración)
- **Próximos Pasos:** Integrar sistema de autenticación y pasarela de pago para Premium

## Reglas para IAs

1. **NO modificar** la estructura de precios sin autorización expresa.
2. **Mantener consistencia** de diseño con otras páginas (`/nosotros`, `/contacto`, etc.).
3. **Tipado estricto**: TypeScript con interfaces definidas (`PlanFeature`, `PlanCardProps`).
4. **Iconos:** Usar Material Icons coherentes con la característica que representan.
5. **Responsive:** Probar en xs (mobile) y md/lg (desktop).
6. **Accesibilidad:** Mantener semántica HTML correcta y contraste de colores.

## Testing (Pendiente)

- [ ] Unit tests para `PlanCard` component
- [ ] Integration tests para acciones de CTA
- [ ] Visual regression tests para hover states
- [ ] Responsive testing en múltiples breakpoints

## Próximas Mejoras

- Integración con sistema de pagos (Stripe/PayPal)
- Toggle anual/mensual con descuento
- Testimonios de usuarios Premium
- FAQ section sobre planes
- Comparación detallada de características en tabla
