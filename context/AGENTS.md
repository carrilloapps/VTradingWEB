# Documentación de Contextos (Estado Global)

Este directorio maneja el estado global de la aplicación utilizando React Context API.

## Contextos Disponibles

### 1. ThemeContext (`ThemeContext.tsx`)
*   **Propósito:** Gestionar el tema visual (Claro/Oscuro) y proveerlo a Material UI.
*   **Estado:** `mode` ('light' | 'dark').
*   **Persistencia:** Guarda la preferencia del usuario en `localStorage` ('themeMode').
*   **Provider:** Envuelve toda la aplicación en `app/layout.tsx`.

## Cómo Usar
Para consumir el contexto en un componente (debe ser `'use client'`):

```typescript
'use client';
import { useColorMode } from '@/context/ThemeContext';

export default function MyComponent() {
  const { toggleColorMode, mode } = useColorMode();
  
  return (
    <Button onClick={toggleColorMode}>
      Cambiar a {mode === 'light' ? 'Oscuro' : 'Claro'}
    </Button>
  );
}
```

## Buenas Prácticas
*   **Minimizar:** No crear contextos para estados que solo se usan en una página.
*   **Client Components:** Los Providers siempre deben ser Client Components.
*   **Performance:** Cuidado con renderizados innecesarios.
