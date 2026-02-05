# Integración VTrading API

Este documento detalla la integración de la VTrading API en el proyecto `vtradingweb`. La capa de comunicación se encuentra centralizada en `lib/vtrading-api.ts` y utiliza tipos estrictos definidos en `lib/vtrading-types.ts`.

## Ubicación de Archivos

- **Cliente API**: [`lib/vtrading-api.ts`](../lib/vtrading-api.ts) - Contiene todas las funciones para realizar peticiones.
- **Definiciones de Tipos**: [`lib/vtrading-types.ts`](../lib/vtrading-types.ts) - Interfaces TypeScript que reflejan la estructura de respuestas de la API.

## Configuración

Para que la integración funcione, es necesario configurar las siguientes variables de entorno en `.env.local`:

```env
VTRADING_API_URL=https://vt.isapp.dev
VTRADING_API_KEY=tu_api_key_aqui
```

## Funciones Disponibles

Todas las funciones son asíncronas y devuelven promesas tipadas. Se pueden importar individualmente o a través del objeto `vtradingApi`.

### 1. Obtener Tasas de Cambio (`getRates`)

Obtiene las tasas actuales del BCV, divisas fronterizas y un resumen del mercado cripto.

```typescript
import { getRates } from '@/lib/vtrading-api';

const rates = await getRates();
console.log(rates.rates); // Array de tasas (USD, EUR, etc.)
```

### 2. Estado del Mercado (`getMarketStatus`)

Verifica si el mercado cambiario está abierto o cerrado y la fecha de actualización.

```typescript
import { getMarketStatus } from '@/lib/vtrading-api';

const status = await getMarketStatus();
console.log(status.state); // "ABIERTO" | "CERRADO"
```

### 3. Criptomonedas P2P (`getCrypto`)

Obtiene ofertas P2P (Binance, etc.) con soporte de paginación y filtros.

```typescript
import { getCrypto } from '@/lib/vtrading-api';

// Obtener ofertas de venta (SELL) de USDT en VES
const crypto = await getCrypto('USDT', 'VES', 'SELL', 1, 10);
```

### 4. Bolsa de Valores de Caracas (`getBVCMarket`)

Información del mercado bursátil venezolano.

```typescript
import { getBVCMarket } from '@/lib/vtrading-api';

const bvc = await getBVCMarket();
console.log(bvc.quotes); // Lista de acciones
```

### 5. Tasas Bancarias (`getBankRates`)

Lista detallada de tasas de cambio por entidad bancaria.

```typescript
import { getBankRates } from '@/lib/vtrading-api';

const banks = await getBankRates(1, 30); // Página 1, 30 items
```

### 6. Histórico de Activos (`getAssetHistory`)

Obtiene el histórico de precios para cualquier símbolo (fiat o cripto).

```typescript
import { getAssetHistory } from '@/lib/vtrading-api';

const history = await getAssetHistory('USD', 1, 30);
```

### 7. Histórico Bancario (`getBankHistory`)

Histórico de tasas para un banco específico.

```typescript
import { getBankHistory } from '@/lib/vtrading-api';

const history = await getBankHistory('Banco Mercantil', 1, 30);
```

### 8. Notificaciones (`sendNotification`)

Envío de notificaciones push vía Firebase Cloud Messaging (requiere permisos).

```typescript
import { sendNotification } from '@/lib/vtrading-api';

await sendNotification({
  title: 'Alerta de Precio',
  body: 'El dólar ha subido',
  topic: 'rates',
});
```

### 9. Carga de Datos Agregados (`fetchMarketData`)

Función de conveniencia para cargar tasas, cripto y bolsa en una sola llamada (útil para `page.tsx`).

```typescript
import { fetchMarketData } from '@/lib/vtrading-api';

const data = await fetchMarketData();
```

## Manejo de Errores

El cliente API lanza errores estándar de JavaScript cuando la respuesta HTTP no es exitosa (status !== 200). Se recomienda envolver las llamadas en bloques `try/catch` o dejar que Next.js maneje los errores en componentes de servidor.

```typescript
try {
  const data = await getRates();
} catch (error) {
  console.error('Error fetching rates:', error);
}
```
