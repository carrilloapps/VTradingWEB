# Documentación del App Router

Este directorio sigue la estructura de **Next.js App Router**. Cada carpeta representa una ruta en la URL.

## Estructura de Rutas

*   **`/` (Raíz):** `page.tsx` (Home). Muestra dashboard principal (`HomeContent.tsx`).
*   **`/mercados`:** Dashboard detallado de mercado.
*   **`/estado`:** Estado del sistema y servicios.
*   **`/contacto`, `/soporte`, etc.:** Páginas estáticas/informativas.

## Archivos Clave
*   **`layout.tsx`:** Define la estructura global (HTML, Body, Navbar, Footer, Providers). **No editar a la ligera.**
*   **`page.tsx`:** El contenido de cada ruta. Por defecto son **Server Components**.
*   **`globals.css`:** Estilos globales CSS (Tailwind imports y resets).

## Patrón de Diseño: Server Data, Client UI
Para maximizar rendimiento y SEO, seguimos este patrón:

1.  **`page.tsx` (Server):**
    *   Realiza el `fetch` de datos iniciales usando `lib/vtrading-api.ts`.
    *   Pasa los datos como `props` a un componente de contenido (Client Component).
    
    ```typescript
    // app/ejemplo/page.tsx
    import { getRates } from '@/lib/vtrading-api';
    import EjemploContent from './EjemploContent';

    export default async function Page() {
      const data = await getRates();
      return <EjemploContent initialData={data} />;
    }
    ```

2.  **`EjemploContent.tsx` (Client):**
    *   Maneja interactividad (`useState`, `useEffect`, `onClick`).
    *   Renderiza la UI final.

## Reglas para IAs
*   **Nuevas Rutas:** Crear carpeta nueva + `page.tsx`.
*   **SEO:** Usar `generateMetadata` en `page.tsx` para títulos dinámicos.
*   **Loading:** Usar `loading.tsx` para estados de carga nativos de Next.js.
