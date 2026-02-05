# Documentación de Server Actions

Este directorio contiene las **Server Actions** de Next.js (`'use server'`). Son funciones que se ejecutan exclusivamente en el servidor y pueden ser llamadas desde Client Components.

## Archivos

- **`market.ts`:** Acciones relacionadas con datos de mercado.
  - `getMarketHistoryAction`: Obtiene histórico para gráficas.
  - `getMarketDataAction`: Obtiene datos agregados (tasas, cripto, bancos).
  - Normaliza respuestas de la API para que el frontend las consuma fácilmente.

- **`payment.ts`:** Acciones relacionadas con procesamiento de pagos.
  - `createPaymentCheckout`: Crea sesión de checkout según método de pago elegido.
  - `verifyPaymentStatus` Verifica el estado de un pago (usado en webhooks).
  - Soporta múltiples gateways: Stripe, Bold.co, ePayco, Binance Pay.
  - Maneja redirecciones a páginas de pago externas.

- **`notifications.ts`:** Acciones relacionadas con notificaciones push.
  - Gestiona subscripciones y envío de notificaciones FCM.

## Cuándo usar Server Actions

1.  **Mutaciones:** Enviar formularios, POST requests.
2.  **Ocultar Lógica:** Cuando se necesita procesar datos sensibles o claves de API que no deben llegar al cliente (aunque `vtrading-api` ya maneja esto, las acciones añaden una capa extra de abstracción).
3.  **Bypassing CORS:** Útil si la API externa tiene problemas de CORS con el navegador.

## Reglas de Implementación

- Deben empezar con `'use server';` al inicio del archivo.
- Deben ser funciones `async`.
- Deben manejar errores con `try/catch` y devolver estructuras predecibles (o lanzar errores controlados).

```typescript
'use server';
import { getRates } from '@/lib/vtrading-api';

export async function myAction() {
  try {
    const data = await getRates();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: 'Falló la petición' };
  }
}
```
