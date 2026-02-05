# /app/plan/pagar - Página de Checkout

## Propósito

Página de checkout completa para la suscripción al Plan Premium de VTrading. Permite a los usuarios seleccionar la duración de su suscripción y el método de pago preferido.

## Estructura de Archivos

```
app/plan/pagar/
├── page.tsx              # Server Component con metadata SEO
├── PagarContent.tsx      # Client Component principal (checkout UI)
└── AGENTS.md            # Este archivo
```

## Rutas Relacionadas

- `/plan` - Página de planes (origen del flujo)
- `/plan/pagar` - Checkout actual
- `/plan/success` - Página de confirmación post-pago

## Métodos de Pago Soportados

### 1. Stripe

- **Región:** Internacional
- **Acepta:** Tarjetas crédito/débito (Visa, Mastercard, Amex)
- **SDK:** `stripe` npm package
- **Env vars:** `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`
- **Docs:** https://stripe.com/docs/api

### 2. Bold.co

- **Región:** Colombia
- **Acepta:** PSE, Nequi, Daviplata, tarjetas
- **Env vars:** `BOLD_API_KEY`, `BOLD_API_URL`
- **Docs:** https://developers.bold.co/pagos-en-linea/boton-de-pagos/ambiente-pruebas

### 3. ePayco

- **Región:** Latinoamérica
- **Acepta:** Tarjetas, efectivo, transferencias bancarias
- **SDK:** `epayco-sdk-node` npm package
- **Env vars:** `EPAYCO_PUBLIC_KEY`, `EPAYCO_PRIVATE_KEY`, `EPAYCO_TEST_MODE`
- **Docs:** https://api.epayco.co/

### 4. Binance Pay

- **Región:** Global
- **Acepta:** Criptomonedas (USDT, BTC, BNB, etc.)
- **Env vars:** `BINANCE_PAY_API_KEY`, `BINANCE_PAY_SECRET_KEY`, `BINANCE_PAY_API_URL`
- **Docs:** https://developers.binance.com/docs/binance-pay

## Variables de Entorno Requeridas

### Precio del Plan

```env
NEXT_PUBLIC_PREMIUM_PLAN_PRICE_USD=1.00
```

### URLs de la App

```env
NEXT_PUBLIC_BASE_URL=https://vtradingweb.com
```

### Stripe

```env
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLIC_KEY=pk_live_xxx (opcional, para frontend si se usa)
```

### Bold

```env
BOLD_API_KEY=xxx
BOLD_API_URL=https://api.bold.co/v1 (producción) o https://sandbox.bold.co/v1 (pruebas)
```

### ePayco

```env
EPAYCO_PUBLIC_KEY=xxx
EPAYCO_PRIVATE_KEY=xxx
EPAYCO_TEST_MODE=true (para pruebas) o false (producción)
```

### Binance Pay

```env
BINANCE_PAY_API_KEY=xxx
BINANCE_PAY_SECRET_KEY=xxx
BINANCE_PAY_API_URL=https://bpay.binanceapi.com (producción)
```

## Flujo de Pago

1. **Selección de Duración:**
   - Usuario elige: 1, 3, 6, o 12 meses
   - Se calculan descuentos automáticamente (10%, 15%, 25%)
   - Resumen de precio se actualiza en tiempo real

2. **Selección de Método:**
   - Tabs para cambiar entre métodos de pago
   - Cada método muestra info específica (features, aceptados)
   - Botón de pago se adapta al método seleccionado

3. **Procesamiento:**
   - Click en botón "Pagar con [Método]"
   - Server action `createPaymentCheckout()` crea sesión
   - Usuario es redirigido a checkout del gateway
   - Completa el pago en la plataforma externa

4. **Confirmación:**
   - Callback a `/plan/success?session_id=xxx`
   - Verificación del pago (simulada en MVP, real en producción)
   - Activación de cuenta Premium en base de datos

## Server Actions

### `createPaymentCheckout(request: PaymentRequest)`

- **Archivo:** `app/actions/payment.ts`
- **Propósito:** Crear sesión de checkout según método elegido
- **Retorna:** `PaymentResponse` con `checkoutUrl` y `orderId`

### `verifyPaymentStatus(method, orderId)`

- **Archivo:** `app/actions/payment.ts`
- **Propósito:** Verificar estado de un pago existente
- **Uso:** Webhooks y confirmaciones

## Tipos TypeScript

Definidos en `lib/vtrading-types.ts`:

- `PaymentMethod`: 'stripe' | 'bold' | 'epayco' | 'binance'
- `PaymentPlan`: Estructura de plan con meses y precios
- `PaymentRequest`: Datos de solicitud de pago
- `PaymentResponse`: Respuesta con URL de checkout

## Descuentos por Duración

```typescript
const planDurations = [
  { months: 1, discount: 0 }, // Sin descuento
  { months: 3, discount: 10 }, // 10% OFF
  { months: 6, discount: 15 }, // 15% OFF (Recomendado)
  { months: 12, discount: 25 }, // 25% OFF
];
```

## Características del Diseño

- **Responsive:** Layout de 2 columnas (md) que colapsa a 1 columna (xs)
- **Sticky Summary:** Resumen de pedido fijo al hacer scroll (solo desktop)
- **Tabs Material UI:** Para navegación entre métodos de pago
- **Radio Cards:** Para selección de duración con indicador visual
- **Loading States:** Spinner durante procesamiento de pago
- **Error Handling:** Alertas para errores de API o configuración

## Reglas de Negocio

1. **Precio base:** Siempre en USD, tomado de `NEXT_PUBLIC_PREMIUM_PLAN_PRICE_USD`
2. **Descuentos acumulativos:** Se aplican automáticamente según meses seleccionados
3. **Plan recomendado:** 6 meses (mejor balance precio/duración)
4. **Autenticación:** No requerida para iniciar checkout, pero se captura userId si existe
5. **Emails:** Confirmación enviada post-pago (implementar en webhooks)

## Webhooks (Pendiente Implementación)

Cada método de pago requiere un webhook endpoint para confirmar pagos:

- `POST /api/webhooks/stripe` - Verificar `checkout.session.completed`
- `POST /api/webhooks/bold` - Confirmar pago Bold
- `POST /api/webhooks/epayco` - Confirmar pago ePayco
- `POST /api/webhooks/binance` - Confirmar pago Binance

**Acciones en webhook:**

1. Verificar firma/autenticidad del request
2. Extraer `orderId` y `userId`
3. Actualizar estado de suscripción en base de datos
4. Enviar email de confirmación
5. Retornar 200 OK

## Testing

### Modo de Pruebas

- **Stripe:** Usar test keys `sk_test_xxx`
- **Bold:** Usar sandbox URL
- **ePayco:** Establecer `EPAYCO_TEST_MODE=true`
- **Binance:** Usar testnet keys

### Tarjetas de Prueba (Stripe)

- Éxito: `4242 4242 4242 4242`
- Requiere auth: `4000 0027 6000 3184`
- Falla: `4000 0000 0000 0002`

## Mantenimiento y Actualizaciones

### Agregar Nuevo Método de Pago

1. Agregar tipo a `PaymentMethod` en `vtrading-types.ts`
2. Agregar objeto a array `paymentMethods` en `PagarContent.tsx`
3. Crear función `createXXXCheckout()` en `payment.ts`
4. Agregar case en switch de `createPaymentCheckout()`
5. Configurar env vars correspondientes
6. Actualizar documentación

### Cambiar Precio

Modificar `NEXT_PUBLIC_PREMIUM_PLAN_PRICE_USD` en `.env.local` y redeployar.

### Ajustar Descuentos

Modificar array `planDurations` en `PagarContent.tsx`.

## Integración con Firebase

Cuando el usuario está autenticado:

- Se captura `userId` desde Firebase Auth
- Se pasa en metadata del checkout
- Se usa en webhook para activar Premium en Firestore

```typescript
// Ejemplo de activación en webhook
await db
  .collection('users')
  .doc(userId)
  .update({
    premiumUntil: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000),
    premiumActive: true,
    lastPaymentDate: new Date(),
    lastPaymentMethod: method,
  });
```

## Seguridad

1. **Keys secretas:** NUNCA exponer en variables `NEXT_PUBLIC_*`
2. **Validación de webhooks:** Siempre verificar firma/autenticidad
3. **HTTPS:** Obligatorio para todos los endpoints de pago
4. **Rate limiting:** Implementar en server actions para evitar abuso
5. **Logs:** No registrar datos sensibles (números de tarjeta, etc.)

## Notas para Agentes IA

- Las integraciones de pago están preparadas pero requieren instalación de SDKs
- Webhooks aún no implementados (TODO crítico para producción)
- Página de success actualmente simula verificación (implementar real)
- Considerar agregar más métodos regionales según mercado objetivo
- Testing exhaustivo requerido antes de producción con dinero real
