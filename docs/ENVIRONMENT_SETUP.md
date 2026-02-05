# Configuración de Variables de Entorno

Este documento explica todas las variables de entorno necesarias para ejecutar VTradingWeb en modo desarrollo y producción.

## Configuración Inicial

1. Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

2. Configura las variables según tu entorno (desarrollo/producción)

## Variables Esenciales

### Entorno

```env
NODE_ENV=development  # o 'production'
```

### VTrading API

```env
VTRADING_API_URL=https://api.vtrading.app
VTRADING_API_KEY=tu_api_key
```

### URLs de la Aplicación

```env
# IMPORTANTE: Debe incluir el esquema completo (http:// o https://)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_BASE_URL=https://vtrading.app  # Production

NEXT_PUBLIC_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=com.vtrading
```

### Plan Premium

```env
NEXT_PUBLIC_PREMIUM_PLAN_PRICE_USD=1.00  # Precio por mes en USD
```

## Firebase Configuration

### Cliente (Frontend)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_VAPID_KEY=tu_vapid_key
```

### Admin SDK (Backend/Server Actions)

```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Nota:** Asegúrate de que `FIREBASE_PRIVATE_KEY` mantenga los saltos de línea (`\n`) correctamente.

## Pasarelas de Pago

### Stripe

```env
# Test Mode (Development)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx

# Production Mode
# STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
# STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
```

**Documentación:** [Stripe API Keys](https://dashboard.stripe.com/apikeys)

### PayPal

```env
PAYPAL_CLIENT_ID=tu_paypal_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret
PAYPAL_MODE=sandbox  # o 'live' para producción
```

**Documentación:** [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)

### Bold (Colombia)

```env
BOLD_API_KEY=tu_bold_api_key
BOLD_PUBLIC_KEY=tu_bold_public_key
BOLD_TEST_MODE=true  # false en producción
```

**Documentación:** [Bold.co Developers](https://bold.co/developers/)

### ePayco (LATAM)

```env
EPAYCO_PUBLIC_KEY=tu_epayco_public_key
EPAYCO_PRIVATE_KEY=tu_epayco_private_key
EPAYCO_P_KEY=tu_epayco_p_key
EPAYCO_TEST_MODE=true  # false en producción
```

**Documentación:** [ePayco Documentation](https://docs.epayco.co/)

### Binance Pay

```env
BINANCE_PAY_API_KEY=tu_binance_api_key
BINANCE_PAY_SECRET_KEY=tu_binance_secret_key
BINANCE_PAY_TEST_MODE=true  # Solo para documentación, no afecta la URL
```

**Importante:** Binance Pay NO tiene un entorno sandbox separado. El modo test se controla con credenciales de API especiales (diferentes para test vs producción). Ambos modos usan la misma URL: `https://bpay.binanceapi.com`

**Documentación:** [Binance Pay API](https://developers.binance.com/docs/binance-pay/introduction)

## Notas Importantes

### Desarrollo vs Producción

#### Modo Desarrollo:

- Usa `http://localhost:3000` para `NEXT_PUBLIC_BASE_URL`
- Usa credenciales de prueba (test/sandbox) para todas las pasarelas
- `NODE_ENV=development`

#### Modo Producción:

- Usa URLs completas con HTTPS para `NEXT_PUBLIC_BASE_URL`
- Usa credenciales en vivo (live/production) para las pasarelas
- `NODE_ENV=production`

### Seguridad

⚠️ **NUNCA** comitees el archivo `.env.local` al repositorio. Este archivo está en `.gitignore` por defecto.

✅ **SÍ** comitea `.env.example` con valores de ejemplo (sin credenciales reales).

### Validación de URLs

Las URLs de callback de pago (como `success_url` y `cancel_url` de Stripe) **DEBEN** incluir el esquema completo:

✅ Correcto: `http://localhost:3000` o `https://vtrading.app`
❌ Incorrecto: `localhost:3000` o `//vtrading.app`

El código incluye un fallback automático en caso de que `NEXT_PUBLIC_BASE_URL` no esté definida:

- Development: `http://localhost:3000`
- Production: `https://vtrading.app`

## Testing de Configuración

Para verificar que todas las variables estén correctamente configuradas:

```bash
npm run validate
```

Esto ejecutará:

1. `npm run type-check` - Verifica tipos de TypeScript
2. `npm run lint` - Verifica código con ESLint
3. `npm run format:check` - Verifica formato con Prettier

## Troubleshooting

### Error: "Invalid URL: An explicit scheme must be provided"

**Causa:** `NEXT_PUBLIC_BASE_URL` no está definida o no incluye `http://` o `https://`

**Solución:** Agrega `NEXT_PUBLIC_BASE_URL=http://localhost:3000` a tu `.env.local`

### Error: "Stripe no está configurado correctamente"

**Causa:** `STRIPE_SECRET_KEY` no está definida

**Solución:** Obtén tus API keys de [Stripe Dashboard](https://dashboard.stripe.com/apikeys) y agrégalas a `.env.local`

### Firebase Admin Error

**Causa:** `FIREBASE_PRIVATE_KEY` con formato incorrecto

**Solución:** Asegúrate de que la clave mantenga los `\n` y esté entre comillas dobles:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Recursos Adicionales

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Stripe Payments](https://stripe.com/docs/payments)
- [PayPal Integration](https://developer.paypal.com/api/rest/)
