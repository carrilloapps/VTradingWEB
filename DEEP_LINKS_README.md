# Deep Links - VTradingWeb ✨

Implementación completa de deep links para abrir la aplicación VTradingAPP desde el sitio web.

## 🚀 ¿Qué se ha implementado?

### ✅ Archivos de Configuración

- `public/.well-known/apple-app-site-association` - Universal Links (iOS)
- `public/.well-known/assetlinks.json` - App Links (Android)
- Headers configurados en `next.config.ts`

### ✅ Utilidades y Librerías

- `lib/deep-links.ts` - Funciones para generar y manejar deep links
- `lib/use-deep-links.ts` - Hooks de React para deep links

### ✅ Componentes UI

- `components/SmartAppBanner.tsx` - Banner inteligente que invita a abrir la app
- `components/OpenAppButton.tsx` - Botón reutilizable para abrir la app
- `components/AppRedirect.tsx` - Página de redirección con detección automática

### ✅ Páginas

- `app/app/page.tsx` - Ruta universal de redirección (`/app?type=article&path=...`)

### ✅ Scripts y Documentación

- `scripts/verify-deep-links.js` - Script de verificación de configuración
- `docs/DEEP_LINKS_SETUP.md` - Guía completa de configuración
- `docs/DEEP_LINKS_USAGE.md` - Guía de uso y ejemplos
- `DEEP_LINKS_CHECKLIST.md` - Checklist de implementación

## 🎯 Quick Start

### 1. Configuración Inicial (REQUERIDO)

Antes de usar los deep links, debes configurar:

#### iOS (Apple)

Edita `public/.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TU_TEAM_ID.com.vtradingapp", // ← Cambiar esto
        "paths": ["*", "/categoria/*", "/tag/*", "/discover"]
      }
    ]
  }
}
```

Obtén tu Team ID en: https://developer.apple.com/account

#### Android

Edita `public/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.vtradingapp",
      "sha256_cert_fingerprints": [
        "TU_SHA256_FINGERPRINT_AQUI" // ← Cambiar esto (sin dos puntos)
      ]
    }
  }
]
```

Obtén el fingerprint con:

```bash
keytool -list -v -keystore your-keystore.jks -alias your-alias
```

### 2. Verificar Configuración

```bash
npm run verify:deep-links
```

### 3. Uso en tus Páginas

#### Opción A: Banner Inteligente (Recomendado)

```tsx
import { SmartAppBanner } from '@/components/SmartAppBanner';

export default function MyPage() {
  return (
    <>
      <SmartAppBanner
        deepLinkConfig={{
          type: 'article',
          path: 'mi-articulo',
        }}
      />

      {/* Tu contenido */}
    </>
  );
}
```

#### Opción B: Botón de Apertura

```tsx
import { OpenAppButton } from '@/components/OpenAppButton';

export default function MyPage() {
  return (
    <OpenAppButton
      deepLinkConfig={{
        type: 'category',
        path: 'trading',
      }}
      text="Ver en la app"
      variant="contained"
    />
  );
}
```

#### Opción C: Página de Redirección

Crea enlaces que redirigen automáticamente:

```
https://vtrading.app/app?type=article&path=bitcoin-news
https://vtrading.app/app?type=category&path=criptomonedas
```

## 📖 Tipos de Deep Links Soportados

| Tipo       | Descripción                | Ejemplo              |
| ---------- | -------------------------- | -------------------- |
| `article`  | Artículo específico        | `/bitcoin-analysis`  |
| `category` | Categoría de contenido     | `/categoria/trading` |
| `tag`      | Tag específico             | `/tag/bitcoin`       |
| `discover` | Pantalla de descubrimiento | `/discover`          |
| `home`     | Página principal           | `/`                  |

## 🔗 Crear Enlaces Compartibles

```tsx
'use client';

import { useShareDeepLink } from '@/lib/use-deep-links';

export function ShareButton() {
  const { share, copyToClipboard } = useShareDeepLink({
    type: 'article',
    path: 'mi-articulo',
  });

  return <button onClick={() => share({ title: 'Mi Artículo' })}>Compartir</button>;
}
```

## 🛠️ Comandos Útiles

```bash
# Verificar configuración de deep links
npm run verify:deep-links

# Iniciar servidor de desarrollo
npm run dev

# Verificar que los archivos sean accesibles
curl http://localhost:3000/.well-known/apple-app-site-association
curl http://localhost:3000/.well-known/assetlinks.json
```

## ✅ Checklist de Implementación

- [ ] Configurar Apple Team ID en `apple-app-site-association`
- [ ] Configurar SHA-256 fingerprint en `assetlinks.json`
- [ ] Ejecutar `npm run verify:deep-links` sin errores
- [ ] Desplegar a producción
- [ ] Verificar archivos en producción:
  - https://vtrading.app/.well-known/apple-app-site-association
  - https://vtrading.app/.well-known/assetlinks.json
- [ ] Validar con herramientas:
  - [Branch.io AASA Validator](https://branch.io/resources/aasa-validator/)
  - [Google Asset Links Tester](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://vtrading.app&relation=delegate_permission/common.handle_all_urls)
- [ ] Probar en dispositivos reales (iOS y Android)

## 📚 Documentación Completa

- **[Guía de Configuración](./docs/DEEP_LINKS_SETUP.md)** - Configuración paso a paso
- **[Guía de Uso](./docs/DEEP_LINKS_USAGE.md)** - Ejemplos y API completa
- **[Checklist](./DEEP_LINKS_CHECKLIST.md)** - Pasos obligatorios

## 🆘 Problemas Comunes

### ❌ "Los links abren en el navegador"

**Solución:** Verifica que los archivos `.well-known/` sean accesibles con HTTPS y que hayas configurado correctamente el Team ID (iOS) o el SHA-256 fingerprint (Android).

### ❌ "El banner no se muestra"

**Solución:** El banner solo se muestra en dispositivos móviles. Usa las herramientas de desarrollador para simular un dispositivo móvil.

### ❌ "Error al verificar configuración"

**Solución:** Ejecuta `npm run verify:deep-links` para ver los errores específicos. Asegúrate de haber reemplazado los valores placeholder.

## 🎯 ¿Qué sigue?

1. ✅ **Configura los archivos** (Team ID y SHA-256)
2. ✅ **Verifica** con `npm run verify:deep-links`
3. ✅ **Agrega el banner** a tus páginas principales
4. ✅ **Despliega** a producción
5. ✅ **Prueba** en dispositivos reales

## 📧 Soporte

¿Necesitas ayuda? Revisa la documentación completa en `docs/` o el checklist en `DEEP_LINKS_CHECKLIST.md`.

---

**Implementado por:** José Carrillo (jose.carrillo@yummysuperapp.com)
**Fecha:** Febrero 2026
**Proyecto:** VTradingWeb - Deep Links Integration
