# Implementación de Deep Links - Guía de Uso

## 🎯 Componentes Principales

### 1. **SmartAppBanner** - Banner inteligente de app

Muestra un banner en la parte superior de la página invitando a abrir la app.

```tsx
import { SmartAppBanner } from '@/components/SmartAppBanner';

export default function Page() {
  return (
    <>
      <SmartAppBanner
        deepLinkConfig={{
          type: 'article',
          path: 'bitcoin-sube-20-porciento',
        }}
        title="VTradingAPP"
        description="Abre en la app para una mejor experiencia"
      />

      {/* Tu contenido aquí */}
    </>
  );
}
```

**Props:**

- `deepLinkConfig` - Configuración del contenido a abrir
- `title` - Título del banner (opcional)
- `description` - Descripción (opcional)
- `forceShow` - Mostrar aunque se haya cerrado antes (opcional)
- `onOpenApp` - Callback cuando se abre la app
- `onGoToStore` - Callback cuando se va a la tienda

### 2. **OpenAppButton** - Botón para abrir la app

Botón reutilizable que abre la app con un deep link específico.

```tsx
import { OpenAppButton } from '@/components/OpenAppButton';

export default function ArticlePage() {
  return (
    <OpenAppButton
      deepLinkConfig={{
        type: 'article',
        path: 'bitcoin-analysis',
      }}
      text="Leer en la app"
      variant="contained"
      goToStoreOnNotInstalled
    />
  );
}
```

**Props:**

- `deepLinkConfig` - Configuración del deep link (requerido)
- `text` - Texto del botón
- `showIcon` - Mostrar ícono de apertura
- `goToStoreOnNotInstalled` - Ir a la tienda si no está instalada
- Todas las props de `Button` de MUI

### 3. **AppRedirect** - Página de redirección

Componente que maneja la redirección automática a la app.

```tsx
import AppRedirect from '@/components/AppRedirect';

export default function RedirectPage() {
  return (
    <AppRedirect
      config={{
        type: 'article',
        path: 'bitcoin-news',
      }}
      autoOpen
    />
  );
}
```

## 🔧 Utilidades y Hooks

### **useDeepLink** - Hook para manejar deep links

```tsx
'use client';

import { useDeepLink } from '@/lib/use-deep-links';

export default function MyComponent() {
  const { deepLink, open, isOpening, platform } = useDeepLink({
    type: 'category',
    path: 'criptomonedas',
  });

  return <button onClick={() => open()}>{isOpening ? 'Abriendo...' : 'Ver en app'}</button>;
}
```

### **usePlatform** - Detectar plataforma del usuario

```tsx
'use client';

import { usePlatform } from '@/lib/use-deep-links';

export default function MyComponent() {
  const platform = usePlatform();

  if (platform.isIOS) {
    return <div>Usuario de iOS</div>;
  }

  if (platform.isAndroid) {
    return <div>Usuario de Android</div>;
  }

  return <div>Usuario de Desktop</div>;
}
```

### **useAppBanner** - Controlar visibilidad del banner

```tsx
'use client';

import { useAppBanner } from '@/lib/use-deep-links';

export default function MyComponent() {
  const { isVisible, dismiss, reset } = useAppBanner();

  return isVisible ? (
    <div>
      <p>¡Descarga la app!</p>
      <button onClick={dismiss}>Cerrar</button>
    </div>
  ) : null;
}
```

### **useShareDeepLink** - Compartir con deep links

```tsx
'use client';

import { useShareDeepLink } from '@/lib/use-deep-links';

export default function ShareButton() {
  const { share, copyToClipboard } = useShareDeepLink({
    type: 'article',
    path: 'bitcoin-analysis',
  });

  return (
    <>
      <button onClick={() => share({ title: 'Bitcoin Analysis' })}>Compartir</button>
      <button onClick={copyToClipboard}>Copiar enlace</button>
    </>
  );
}
```

## 📖 Funciones Directas (Sin React)

### **generateDeepLink** - Generar deep links

```typescript
import { generateDeepLink } from '@/lib/deep-links';

const links = generateDeepLink({
  type: 'article',
  path: 'bitcoin-sube-20-porciento',
  params: {
    utm_source: 'email',
    utm_campaign: 'newsletter',
  },
});

console.log(links);
// {
//   customScheme: 'vtrading://article/bitcoin-sube-20-porciento?utm_source=email...',
//   universalLink: 'https://vtrading.app/bitcoin-sube-20-porciento?utm_source=email...',
//   fallbackLink: 'https://discover.vtrading.app/bitcoin-sube-20-porciento?utm_source=email...'
// }
```

### **openApp** - Abrir la app manualmente

```typescript
import { generateDeepLink, openApp } from '@/lib/deep-links';

const deepLink = generateDeepLink({
  type: 'category',
  path: 'trading',
});

openApp(deepLink, {
  timeout: 3000,
  onAppOpened: () => {
    console.log('¡App abierta!');
  },
  onAppNotInstalled: () => {
    console.log('App no instalada');
  },
});
```

## 🌐 URLs de Redirección

### Ruta genérica: `/app`

Acepta parámetros de query para construir el deep link:

```
/app?type=article&path=bitcoin-news
/app?type=category&path=criptomonedas
/app?type=tag&path=bitcoin
/app?type=discover
```

**Ejemplo completo:**

```
https://vtrading.app/app?type=article&path=bitcoin-analysis&utm_source=twitter
```

### Crear enlaces personalizados

Para crear un enlace que abra directamente en la app:

1. **Desde emails/redes sociales:**

   ```
   https://vtrading.app/app?type=article&path=tu-articulo
   ```

2. **Con tracking:**

   ```
   https://vtrading.app/app?type=article&path=tu-articulo&utm_source=email&utm_campaign=promo
   ```

3. **Para categorías:**
   ```
   https://vtrading.app/app?type=category&path=acciones
   ```

## 📱 Ejemplos de Uso Completos

### Ejemplo 1: Página de artículo con banner

```tsx
// app/articulos/[slug]/page.tsx
import { SmartAppBanner } from '@/components/SmartAppBanner';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <>
      <SmartAppBanner
        deepLinkConfig={{
          type: 'article',
          path: slug,
        }}
      />

      <article>{/* Contenido del artículo */}</article>
    </>
  );
}
```

### Ejemplo 2: Botón de compartir con deep link

```tsx
'use client';

import { Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { useShareDeepLink } from '@/lib/use-deep-links';

export function ShareArticleButton({ slug, title }: { slug: string; title: string }) {
  const { share, isSharing } = useShareDeepLink({
    type: 'article',
    path: slug,
  });

  return (
    <Button startIcon={<ShareIcon />} onClick={() => share({ title })} disabled={isSharing}>
      Compartir
    </Button>
  );
}
```

### Ejemplo 3: Lista de artículos con botones de apertura

```tsx
'use client';

import { OpenAppButton } from '@/components/OpenAppButton';
import { Card, CardContent, Typography } from '@mui/material';

export function ArticleCard({ slug, title }: { slug: string; title: string }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>

        <OpenAppButton
          deepLinkConfig={{
            type: 'article',
            path: slug,
          }}
          text="Leer en app"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
        />
      </CardContent>
    </Card>
  );
}
```

## 🎨 Personalización del Banner

El banner es completamente personalizable con el sistema de temas de MUI:

```tsx
<SmartAppBanner
  sx={{
    bgcolor: 'secondary.main',
    color: 'secondary.contrastText',
  }}
/>
```

## 🔍 Testing

### Verificar que los archivos estén accesibles:

```bash
npm run verify:deep-links
```

### Probar en navegador:

1. Abre: `http://localhost:3000/app?type=article&path=test`
2. Debe intentar abrir la app automáticamente
3. Si no está instalada, mostrará opciones de descarga

### Probar deep links directos:

```
# iOS
https://vtrading.app/articulo-ejemplo

# Android
https://vtrading.app/articulo-ejemplo

# Custom scheme
vtrading://article/articulo-ejemplo
```

## ⚠️ Consideraciones Importantes

1. **HTTPS Obligatorio:** Los Universal/App Links solo funcionan sobre HTTPS
2. **Configuración de archivos:** Asegúrate de tener configurados los archivos `.well-known/`
3. **Testing en producción:** Los Universal/App Links solo se pueden probar completamente en producción
4. **Caché del navegador:** Si cambias los archivos de configuración, limpia la caché

## 📚 Documentación Adicional

- [Configuración de deep links](./DEEP_LINKS_SETUP.md)
- [Checklist de configuración](../DEEP_LINKS_CHECKLIST.md)

---

¿Necesitas ayuda? Revisa los ejemplos arriba o consulta la documentación completa.
