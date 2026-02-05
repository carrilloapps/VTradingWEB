# Documentación de Componentes UI

Este directorio contiene los bloques de construcción visual reutilizables de la aplicación. Todos los componentes están construidos sobre **Material UI v7**.

## Principios de Diseño

1.  **Componentes Puros:** Deben recibir datos vía props siempre que sea posible.
2.  **Server vs Client:** La mayoría son Client Components (`'use client'`) porque interactúan con el DOM o usan hooks de estado/tema.
3.  **Estilos:** Usar prop `sx` para estilos. Acceder al tema vía `useTheme` o callbacks en `sx`.

## Catálogo de Componentes Clave

### Estructurales

- **`Navbar.tsx`**: Barra de navegación superior. Responsive (Drawer en móvil). Soporta ancho completo (`maxWidth={false}`).
- **`Footer.tsx`**: Pie de página con enlaces y copyright.
- **`AuthModal.tsx`**: Modal de autenticación (Login/Registro) integrado con Firebase.
- **`MarketTicker.tsx`**: Cinta de cotizaciones en tiempo real (Marquee).

### Home (Landing Page)

- **`HeroSection.tsx`**: Sección principal con grid asimétrico (Texto expansivo vs Mockup). Optimizado para Mobile-First con fondo dinámico.
- **`PhoneMockup.tsx`**: Emulador de dispositivo móvil de alta fidelidad (360x720px). Estilo "Dark Mode" forzado.
  - **`RateCard.tsx`**: Tarjetas de tasas de cambio con diseño compacto de 3 columnas (General, Compra, Venta) y alta densidad de información.
  - **`StockListCard.tsx`**: Lista bursátil con avatares, indicadores de tendencia y diseño optimizado para espacios reducidos.

### Proveedores

- **`MUIProvider.tsx`**: Wrapper necesario para que funcione Material UI con el App Router de Next.js. Maneja la caché de estilos Emotion.
- **`ThemeToggle.tsx`**: Botón/Switch para cambiar entre modo Claro/Oscuro.

## Mejores Prácticas para Nuevos Componentes

- **Imports:** Importar componentes de MUI directamente para tree-shaking (aunque el compilador moderno lo maneja bien).
  ```typescript
  import Box from '@mui/material/Box'; // Bien
  import { Box } from '@mui/material'; // También aceptable en v7
  ```
- **Props:** Definir interfaces TypeScript para las props.
  ```typescript
  interface MyComponentProps {
    title: string;
    isActive?: boolean;
  }
  ```
- **Iconos:** OBLIGATORIO usar `@mui/icons-material`. PROHIBIDO usar emojis, caracteres unicode (flechas, etc.) o imágenes para iconos estándar.
  - Ejemplo correcto: `<TrendingUpIcon />`
  - Ejemplo incorrecto: `change: '↘ -9.09%'` o `<span>📈</span>`

## Validación

Al modificar componentes aquí, verificar que no rompan el layout en `app/layout.tsx` o `app/page.tsx`.
