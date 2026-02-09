# Configuración de Deep Links - VTradingAPP

## 📋 Estado de Implementación

✅ Archivos de configuración creados
✅ Headers de Next.js configurados
⚠️ **Requiere configuración adicional del usuario**

## 🎯 Archivos Creados

### 1. Apple App Site Association (iOS)

**Ubicación:** `public/.well-known/apple-app-site-association`

### 2. Digital Asset Links (Android)

**Ubicación:** `public/.well-known/assetlinks.json`

### 3. Configuración de Next.js

**Archivo:** `next.config.ts`

- Se agregaron headers personalizados para servir los archivos de configuración con `Content-Type: application/json`

## 🔧 Configuración Requerida

### Para iOS (Apple)

1. **Obtener tu Apple Team ID:**
   - Ve a [Apple Developer Portal](https://developer.apple.com/account)
   - Inicia sesión con tu cuenta de desarrollador
   - Busca tu **Team ID** en la sección "Membership"

2. **Editar el archivo de configuración:**
   - Abre: `public/.well-known/apple-app-site-association`
   - Reemplaza `TEAM_ID` con tu Apple Team ID real
   - Ejemplo: `"appID": "ABC123XYZ.com.vtradingapp"`

3. **Configurar en tu aplicación iOS:**
   - En Xcode, agrega el dominio en "Associated Domains"
   - Formato: `applinks:vtrading.app` y `applinks:discover.vtrading.app`

### Para Android

1. **Obtener el SHA-256 Fingerprint de tu keystore:**

   **Para producción:**

   ```bash
   keytool -list -v -keystore your-release-keystore.jks -alias your-key-alias
   ```

   **Para desarrollo (debug):**

   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

2. **Editar el archivo de configuración:**
   - Abre: `public/.well-known/assetlinks.json`
   - Reemplaza `SHA256_FINGERPRINT_AQUI` con tu SHA-256 fingerprint real
   - El fingerprint tiene el formato: `XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX`
   - **IMPORTANTE:** Debes remover los dos puntos (`:`) del fingerprint. Ejemplo:
     - Original: `14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5`
     - En el archivo: `"146DE983C5730650D8EEB9952F34FC6416A08342E61DBEA88A0496B23FCF44E5"`

3. **Configurar en tu aplicación Android:**
   - En `AndroidManifest.xml`, agrega los intent filters para los dominios
   - Verifica que el `package_name` sea `com.vtradingapp`

## 🌐 Dominios Configurados

- **Principal:** `vtrading.app`
- **Discover:** `discover.vtrading.app`

## 📝 Rutas Soportadas

| Ruta                | Descripción                | Ejemplo                                          |
| ------------------- | -------------------------- | ------------------------------------------------ |
| `/{article-slug}`   | Detalle de artículo        | `https://vtrading.app/bitcoin-sube-20-porciento` |
| `/categoria/{slug}` | Categoría de contenido     | `https://vtrading.app/categoria/criptomonedas`   |
| `/tag/{slug}`       | Tag específico             | `https://vtrading.app/tag/bitcoin`               |
| `/discover`         | Pantalla de descubrimiento | `https://vtrading.app/discover`                  |

## ✅ Verificación de Configuración

### Desarrollo Local

1. Inicia el servidor:

   ```bash
   npm run dev
   ```

2. Verifica que los archivos sean accesibles:
   ```bash
   curl http://localhost:3000/.well-known/apple-app-site-association
   curl http://localhost:3000/.well-known/assetlinks.json
   ```

### Producción

1. **iOS - Validador de Apple:**
   - Visita: `https://vtrading.app/.well-known/apple-app-site-association`
   - Usa: [Branch.io AASA Validator](https://branch.io/resources/aasa-validator/)

2. **Android - Validador de Google:**
   - Visita: `https://vtrading.app/.well-known/assetlinks.json`
   - Usa: [Digital Asset Links Tester](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://vtrading.app&relation=delegate_permission/common.handle_all_urls)

## 🚀 Despliegue

### Requisitos de Hosting

Para que los deep links funcionen correctamente:

1. ✅ **HTTPS obligatorio** - Ambos archivos deben servirse sobre HTTPS con certificado SSL válido
2. ✅ **Sin autenticación** - Los archivos deben ser públicamente accesibles
3. ✅ **Content-Type correcto** - Ya configurado en `next.config.ts`
4. ✅ **CORS habilitado** - Ya configurado en `next.config.ts`

### Vercel / Netlify / AWS

Los archivos en `public/.well-known/` son automáticamente servidos correctamente.

### Servidor Personalizado

Si usas un servidor personalizado (Nginx, Apache, etc.), asegúrate de que:

- Los archivos sean accesibles en `https://tu-dominio/.well-known/`
- Se sirvan con `Content-Type: application/json`
- Tengan certificado SSL válido

## 🧪 Testing de Deep Links

### iOS (Simulador)

```bash
# Probar Universal Link
xcrun simctl openurl booted "https://vtrading.app/articulo-ejemplo"

# Probar Custom Scheme
xcrun simctl openurl booted "vtrading://article/articulo-ejemplo"
```

### Android (Emulador/Dispositivo)

```bash
# Probar App Link
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://vtrading.app/articulo-ejemplo" com.vtradingapp

# Probar Custom Scheme
adb shell am start -W -a android.intent.action.VIEW \
  -d "vtrading://article/articulo-ejemplo" com.vtradingapp
```

## ⚠️ Problemas Comunes

### iOS

**❌ Los links abren en Safari en lugar de la app:**

- Verifica que el `appID` en `apple-app-site-association` sea correcto
- El formato debe ser: `TEAM_ID.BUNDLE_ID`
- Ejemplo: `ABC123XYZ.com.vtradingapp`
- Reinstala la app después de editar los associated domains
- Verifica que el certificado SSL esté funcionando correctamente

### Android

**❌ Los links abren en el navegador:**

- Verifica que el fingerprint SHA-256 sea correcto (sin dos puntos)
- Verifica que el `package_name` coincida con tu app
- Limpia la caché de verificación:
  ```bash
  adb shell pm clear com.android.vending
  ```
- Reinstala la app después de hacer cambios

**❌ Error al verificar assetlinks.json:**

- El archivo debe estar en la raíz: `https://vtrading.app/.well-known/assetlinks.json`
- Debe devolver status 200
- Debe tener `Content-Type: application/json`

## 📚 Recursos Adicionales

- [iOS Universal Links - Apple](https://developer.apple.com/ios/universal-links/)
- [Android App Links - Google](https://developer.android.com/training/app-links)
- [Next.js Custom Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)

## 🔄 Próximos Pasos

1. ✅ Obtener tu Apple Team ID
2. ✅ Obtener tu SHA-256 fingerprint de Android
3. ✅ Editar los archivos de configuración con tus valores reales
4. ✅ Desplegar a producción
5. ✅ Verificar en ambos validadores (iOS y Android)
6. ✅ Probar en dispositivos reales

---

**Última actualización:** Febrero 2026
**Implementado por:** José Carrillo
