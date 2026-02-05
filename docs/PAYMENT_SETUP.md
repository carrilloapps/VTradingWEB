# Instalación de SDKs de Métodos de Pago

Este documento describe cómo instalar y configurar los diferentes métodos de pago disponibles en VTradingWeb.

## Visión General

El sistema de pagos soporta 4 métodos diferentes:

1. **Stripe** - Internacional (Tarjetas)
2. **Bold.co** - Colombia (PSE, Nequi, Daviplata)
3. **ePayco** - Latinoamérica (Múltiples métodos)
4. **Binance Pay** - Global (Criptomonedas)

**Importante:** Los SDKs son **opcionales**. Solo instala los que planeas usar. Si intentas usar un método sin su SDK instalado, recibirás un error claro indicándote qué instalar.

## Instalación por Método

### 1. Stripe (Recomendado para Internacional)

```bash
npm install stripe
```

**Variables de entorno necesarias:**
```env
STRIPE_SECRET_KEY=sk_test_xxx  # o sk_live_xxx para producción
STRIPE_PUBLIC_KEY=pk_test_xxx  # (opcional, solo si usas Stripe.js en frontend)
```

**Documentación:** https://stripe.com/docs/api

### 2. Bold.co (Colombia)

No requiere SDK npm. Usa API RESTful directamente con `fetch`.

**Variables de entorno necesarias:**
```env
BOLD_API_KEY=tu_api_key
BOLD_API_URL=https://sandbox.bold.co/v1  # o https://api.bold.co/v1 para producción
```

**Documentación:** https://developers.bold.co/pagos-en-linea/boton-de-pagos

### 3. ePayco (Latinoamérica)

```bash
npm install epayco-sdk-node
```

**Variables de entorno necesarias:**
```env
EPAYCO_PUBLIC_KEY=tu_public_key
EPAYCO_PRIVATE_KEY=tu_private_key
EPAYCO_TEST_MODE=true  # o false para producción
```

**Documentación:** https://api.epayco.co/

### 4. Binance Pay (Criptomonedas)

No requiere SDK npm. Usa API RESTful directamente con `fetch`.

**Variables de entorno necesarias:**
```env
BINANCE_PAY_API_KEY=tu_api_key
BINANCE_PAY_SECRET_KEY=tu_secret_key
BINANCE_PAY_API_URL=https://bpay.binanceapi.com
```

**Documentación:** https://developers.binance.com/docs/binance-pay

## Instalación Completa (Todos los Métodos)

Si quieres soportar todos los métodos de pago, ejecuta:

```bash
npm install stripe epayco-sdk-node
```

**Nota:** Bold y Binance Pay no requieren SDKs adicionales.

## Configuración de Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Completa las variables de entorno para los métodos que vayas a usar:
   ```env
   # Ejemplo para solo Stripe
   NEXT_PUBLIC_PREMIUM_PLAN_PRICE_USD=1.00
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   STRIPE_SECRET_KEY=sk_test_xxx
   ```

3. Las variables que dejes vacías harán que ese método de pago muestre un error si se intenta usar.

## Verificación de Instalación

Para verificar que los SDKs están correctamente instalados, ejecuta:

```bash
npx tsc --noEmit
npm run lint
```

Si todo está correcto, no deberían aparecer errores relacionados con los módulos de pago.

## Testing en Desarrollo

### Stripe

Usa las claves de prueba (con prefijo `test_`):
- **Tarjeta de éxito:** 4242 4242 4242 4242
- **CVV:** Cualquier 3 dígitos
- **Fecha:** Cualquier fecha futura

### Bold

Usa el ambiente sandbox: `https://sandbox.bold.co/v1`

### ePayco

Establece `EPAYCO_TEST_MODE=true` para usar el ambiente de pruebas.

### Binance Pay

Usa credenciales de testnet si están disponibles.

## Troubleshooting

### Error: "Cannot find module 'stripe'"

**Solución:** Instala el SDK:
```bash
npm install stripe
```

### Error: "Stripe no está configurado correctamente"

**Solución:** Verifica que `STRIPE_SECRET_KEY` esté en tu archivo `.env.local`

### Error: "epayco-sdk-node package not installed"

**Solución:** Instala el SDK:
```bash
npm install epayco-sdk-node
```

### TypeScript Compilation Errors

Los errores de compilación relacionados con módulos de pago son normales si no tienes los SDKs instalados. El código usa `@ts-expect-error` para manejar esto y mostrar errores claros en runtime.

## Webhooks (Producción)

Para producción, necesitarás configurar webhooks para cada método:

1. **Stripe:** Configura webhook en Dashboard → Developers → Webhooks
2. **Bold:** Configura notification_url en tu cuenta
3. **ePayco:** Usa el parámetro `confirmation` en la petición
4. **Binance Pay:** Configura `webhookUrl` en la orden

Los endpoints de webhook deben crearse en `app/api/webhooks/[provider]/route.ts`

## Referencias

- [Documentación de Pagos](./app/plan/pagar/AGENTS.md)
- [Tipos de Pago](./lib/vtrading-types.ts)
- [Server Actions](./app/actions/payment.ts)

## Soporte

Si necesitas ayuda con la configuración de algún método de pago, consulta la documentación oficial del proveedor o contacta al equipo de desarrollo.
