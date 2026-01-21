# Documentación de Componentes UI

Este directorio contiene los bloques de construcción visual reutilizables de la aplicación. Todos los componentes están construidos sobre **Material UI v7**.

## Principios de Diseño
1.  **Componentes Puros:** Deben recibir datos vía props siempre que sea posible.
2.  **Server vs Client:** La mayoría son Client Components (`'use client'`) porque interactúan con el DOM o usan hooks de estado/tema.
3.  **Estilos:** Usar prop `sx` para estilos. Acceder al tema vía `useTheme` o callbacks en `sx`.

## Catálogo de Componentes Clave

### Estructurales
*   **`Navbar.tsx`**: Barra de navegación superior. Responsive (Drawer en móvil).
*   **`Footer.tsx`**: Pie de página con enlaces y copyright.
*   **`AuthModal.tsx`**: Modal de autenticación (Login/Registro) integrado con Firebase.
*   **`MarketTicker.tsx`**: Cinta de cotizaciones en tiempo real (Marquee).

### Proveedores
*   **`MUIProvider.tsx`**: Wrapper necesario para que funcione Material UI con el App Router de Next.js. Maneja la caché de estilos Emotion.
*   **`ThemeToggle.tsx`**: Botón/Switch para cambiar entre modo Claro/Oscuro.

## Mejores Prácticas para Nuevos Componentes
*   **Imports:** Importar componentes de MUI directamente para tree-shaking (aunque el compilador moderno lo maneja bien).
    ```typescript
    import Box from '@mui/material/Box'; // Bien
    import { Box } from '@mui/material'; // También aceptable en v7
    ```
*   **Props:** Definir interfaces TypeScript para las props.
    ```typescript
    interface MyComponentProps {
      title: string;
      isActive?: boolean;
    }
    ```
*   **Iconos:** Usar `@mui/icons-material`.

## Validación
Al modificar componentes aquí, verificar que no rompan el layout en `app/layout.tsx` o `app/page.tsx`.
