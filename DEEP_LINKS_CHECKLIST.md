# ✅ Checklist de Configuración de Deep Links

## 📋 Pasos Obligatorios Antes de Desplegar

### 1️⃣ Configuración de iOS (Apple)

- [ ] Obtener Apple Team ID desde [Apple Developer Portal](https://developer.apple.com/account)
- [ ] Abrir archivo: `public/.well-known/apple-app-site-association`
- [ ] Reemplazar `TEAM_ID` con tu Team ID real
- [ ] Verificar formato: `"appID": "TU_TEAM_ID.com.vtradingapp"`
- [ ] En Xcode: Agregar `applinks:vtrading.app` a Associated Domains
- [ ] En Xcode: Agregar `applinks:discover.vtrading.app` a Associated Domains

### 2️⃣ Configuración de Android

**Obtener SHA-256 Fingerprint:**

Para producción:

```bash
keytool -list -v -keystore your-release-keystore.jks -alias your-key-alias
```

Para desarrollo:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Configurar archivo:**

- [ ] Copiar el SHA-256 fingerprint (línea que dice `SHA256:`)
- [ ] Remover todos los dos puntos (`:`) del fingerprint
- [ ] Abrir archivo: `public/.well-known/assetlinks.json`
- [ ] Reemplazar `SHA256_FINGERPRINT_AQUI` con el fingerprint sin dos puntos
- [ ] Verificar que `package_name` sea `com.vtradingapp`

**Ejemplo de conversión:**

```
Original:    14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5
Convertido:  146DE983C5730650D8EEB9952F34FC6416A08342E61DBEA88A0496B23FCF44E5
```

### 3️⃣ Verificación Local

- [ ] Ejecutar `npm run dev`
- [ ] Probar: `curl http://localhost:3000/.well-known/apple-app-site-association`
- [ ] Probar: `curl http://localhost:3000/.well-known/assetlinks.json`
- [ ] Verificar que ambos devuelvan JSON válido

### 4️⃣ Despliegue

- [ ] Hacer commit de los cambios
- [ ] Desplegar a producción (Vercel/Netlify/etc.)
- [ ] Esperar 5-10 minutos para propagación de DNS

### 5️⃣ Verificación en Producción

**iOS:**

- [ ] Visitar: `https://vtrading.app/.well-known/apple-app-site-association`
- [ ] Debe devolver JSON (no error 404)
- [ ] Validar en: [Branch.io AASA Validator](https://branch.io/resources/aasa-validator/)

**Android:**

- [ ] Visitar: `https://vtrading.app/.well-known/assetlinks.json`
- [ ] Debe devolver JSON (no error 404)
- [ ] Validar en: [Digital Asset Links Tester](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://vtrading.app&relation=delegate_permission/common.handle_all_urls)

### 6️⃣ Testing en Dispositivos

**iOS (Simulador):**

```bash
xcrun simctl openurl booted "https://vtrading.app/test-articulo"
```

**Android (Emulador):**

```bash
adb shell am start -W -a android.intent.action.VIEW -d "https://vtrading.app/test-articulo" com.vtradingapp
```

**Dispositivo Real:**

- [ ] Enviar un link por WhatsApp/Telegram
- [ ] Tocar el link
- [ ] Verificar que abra la app (no el navegador)

### 7️⃣ Configuración de Subdominio (discover.vtrading.app)

Si tienes configurado un subdominio separado:

- [ ] Copiar `apple-app-site-association` a `https://discover.vtrading.app/.well-known/`
- [ ] Copiar `assetlinks.json` a `https://discover.vtrading.app/.well-known/`
- [ ] Verificar ambos dominios con los validadores

## 🚨 Información Requerida

Para completar esta configuración necesitas:

1. **Apple Team ID**
   - Dónde: [https://developer.apple.com/account](https://developer.apple.com/account)
   - Formato: 10 caracteres alfanuméricos (ej: `ABC123XYZ`)

2. **Android SHA-256 Fingerprint**
   - Obtener con comando `keytool` (ver arriba)
   - Formato: 64 caracteres hexadecimales SIN dos puntos

3. **Bundle ID de iOS** (si es diferente)
   - Actualmente configurado como: `com.vtradingapp`

4. **Package Name de Android** (si es diferente)
   - Actualmente configurado como: `com.vtradingapp`

## 📞 Soporte

Si encuentras problemas, revisa la documentación completa en:

- `docs/DEEP_LINKS_SETUP.md`

---

**¿Todo listo?** Una vez completados estos pasos, tus deep links estarán funcionando correctamente ✨
