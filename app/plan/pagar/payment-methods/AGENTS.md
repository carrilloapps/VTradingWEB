# Payment Methods Module - AGENTS.md

## Propósito

Este directorio contiene la implementación modular de todos los métodos de pago soportados por VTradingWeb. Cada método de pago está completamente aislado con su propia lógica, validaciones y UI.

## Arquitectura

### Estructura de Archivos

```
payment-methods/
├── types.ts                      # Interfaces y tipos comunes
├── index.ts                      # Exportaciones centralizadas
├── StripePaymentMethod.tsx       # Stripe (Tarjetas de crédito/débito)
├── PayPalPaymentMethod.tsx       # PayPal
├── BoldPaymentMethod.tsx         # Bold (PSE, Nequi, Daviplata - Colombia)
├── ePaycoPaymentMethod.tsx       # ePayco (Latinoamérica)
├── BinancePayPaymentMethod.tsx   # Binance Pay (Criptomonedas)
└── AGENTS.md                     # Esta documentación
```

## Tipos y Interfaces (types.ts)

### PaymentMethodComponentProps

Props estándar que **todos** los componentes de métodos de pago deben implementar:

```typescript
interface PaymentMethodComponentProps {
  planDetails: PaymentPlanDetails; // Detalles del plan seleccionado
  onSuccess: (result: PaymentResult) => void; // Callback de éxito
  onError: (error: string) => void; // Callback de error
  loading?: boolean; // Estado de carga externo
}
```

### CustomerInfo

Información del cliente requerida por los métodos de pago:

```typescript
interface CustomerInfo {
  name: string; // Requerido por todos
  email: string; // Requerido por todos
  phone?: string; // Requerido por Bold, ePayco
  documentType?: 'CC' | 'NIT' | 'CE' | 'Passport'; // Bold
  documentNumber?: string; // Bold, ePayco (opcional)
  address?: AddressInfo; // Stripe (futuro)
}
```

### PaymentPlanDetails

Información del plan de suscripción:

```typescript
interface PaymentPlanDetails {
  months: number; // Duración del plan
  pricePerMonth: number; // Precio por mes
  subtotal: number; // Total sin descuento
  discount: number; // Porcentaje de descuento
  discountAmount: number; // Monto del descuento
  total: number; // Total final a pagar
}
```

## Componentes de Métodos de Pago

### 1. StripePaymentMethod

**Región:** Global  
**Requisitos:**

- Nombre completo (obligatorio)
- Email (obligatorio)
- Teléfono (opcional)

**Características:**

- Integración completa con Stripe Checkout
- Soporta Visa, Mastercard, American Express
- Validación de email con regex
- Redirige a Stripe hosted checkout

**Uso:**

```tsx
<StripePaymentMethod planDetails={planDetails} onSuccess={handleSuccess} onError={handleError} />
```

### 2. PayPalPaymentMethod

**Región:** Global  
**Requisitos:**

- Nombre completo (obligatorio)
- Email (obligatorio)

**Características:**

- Integración con PayPal
- Opción de pagar con PayPal balance o tarjetas
- Pago en 4 cuotas disponible
- Redirige a PayPal checkout

### 3. BoldPaymentMethod

**Región:** Colombia  
**Requisitos:**

- Nombre completo (obligatorio)
- Tipo de documento (obligatorio): CC, CE, NIT, Pasaporte
- Número de documento (obligatorio)
- Email (obligatorio)
- Teléfono (obligatorio)

**Características:**

- PSE (Pagos Seguros en Línea)
- Nequi
- Daviplata
- Validación de número de documento colombiano
- Específico para pagos en Colombia

### 4. ePaycoPaymentMethod

**Región:** Latinoamérica  
**Requisitos:**

- Nombre completo (obligatorio)
- Email (obligatorio)
- Teléfono (obligatorio)
- Número de documento (opcional)

**Características:**

- Tarjetas de crédito/débito
- Pagos en efectivo
- Transferencias bancarias
- Multi-país en LATAM
- Validación de teléfono (mínimo 10 dígitos)

### 5. BinancePayPaymentMethod

**Región:** Global  
**Requisitos:**

- Nombre completo (obligatorio)
- Email (obligatorio)
- Selección de criptomoneda

**Características:**

- 6 criptomonedas soportadas:
  - Stablecoins: USDT, USDC, BUSD
  - Criptomonedas: BTC, ETH, BNB
- Indicador visual de stablecoins
- Selector de criptomoneda con grid cards
- Pago instantáneo con Binance Pay

## Flujo de Implementación

### 1. Crear un Nuevo Método de Pago

```tsx
// 1. Crear archivo: NewPaymentMethod.tsx
import { PaymentMethodComponentProps } from './types';

export default function NewPaymentMethod({
  planDetails,
  onSuccess,
  onError,
  loading: externalLoading = false,
}: PaymentMethodComponentProps) {
  // Implementar lógica
}

// 2. Exportar en index.ts
export { default as NewPaymentMethod } from './NewPaymentMethod';

// 3. Agregar a configuración en PagarContent.tsx
```

### 2. Validaciones Requeridas

Todos los componentes **deben** implementar:

1. Validación de campos obligatorios
2. Validación de formato de email
3. Manejo de errores con mensajes claros
4. Estado de carga (loading)
5. Llamada a `createPaymentCheckout` con método correcto

### 3. Diseño UI Consistente

Todos los formularios deben mantener:

- Padding: `{ xs: 2.5, md: 3 }`
- Border radius: `3` (form), `2` (inputs)
- Glassmorphism: `backdropFilter: 'blur(10px)'`
- Botón con gradiente primary
- Alert para errores
- Typography h6 para título

## Integración con PagarContent

### Paso 1: Importar Componente

```tsx
import { StripePaymentMethod } from './payment-methods';
```

### Paso 2: Renderizar Condicionalmente

```tsx
{
  selectedMethod === 'stripe' && (
    <StripePaymentMethod
      planDetails={planDetails}
      onSuccess={handlePaymentSuccess}
      onError={handlePaymentError}
      loading={loading}
    />
  );
}
```

### Paso 3: Manejar Callbacks

```tsx
const handlePaymentSuccess = (result: PaymentResult) => {
  // Redirigir a checkoutUrl
  if (result.checkoutUrl) {
    window.location.href = result.checkoutUrl;
  }
};

const handlePaymentError = (error: string) => {
  setError(error);
  // Mostrar mensaje al usuario
};
```

## Reglas para Agentes IA

### ANTES de Modificar

1. **Leer este archivo completo**
2. **Verificar tipos en `types.ts`**
3. **Revisar implementación de referencia (StripePaymentMethod)**
4. **Probar localmente con `npm run dev`**

### AL Crear Nuevo Método

1. **Copiar estructura de StripePaymentMethod**
2. **Adaptar campos según requisitos del gateway**
3. **Implementar validaciones específicas**
4. **Agregar a index.ts**
5. **Documentar aquí**
6. **Actualizar PagarContent.tsx**

### AL Modificar Existente

1. **NO romper la interfaz PaymentMethodComponentProps**
2. **Mantener el diseño UI consistente**
3. **Actualizar documentación si cambian requisitos**
4. **Probar todos los campos obligatorios**

### NUNCA

- ❌ Cambiar la interfaz `PaymentMethodComponentProps` sin actualizar TODOS los componentes
- ❌ Eliminar validaciones de email o campos obligatorios
- ❌ Hardcodear URLs de API o keys en el componente
- ❌ Cambiar el flujo de onSuccess/onError
- ❌ Modificar el diseño visual sin consultarlo

## Testing

### Checklist de Pruebas

Para cada método de pago:

- [ ] Validación de campos obligatorios funciona
- [ ] Validación de email rechaza emails inválidos
- [ ] Estado de loading deshabilita el form
- [ ] Mensaje de error se muestra correctamente
- [ ] onSuccess se llama con el resultado correcto
- [ ] onError se llama cuando falla la validación
- [ ] Redirección funciona después de éxito
- [ ] UI responsive en móvil y desktop

## Mantenimiento

### Cuando Agregar un Nuevo Gateway

1. Contactar con el proveedor de pagos
2. Obtener credenciales de API
3. Configurar en variables de entorno
4. Implementar componente siguiendo esta arquitectura
5. Agregar a la lista de métodos en PagarContent
6. Actualizar AGENTS.md
7. Crear tests

### Cuando Actualizar Uno Existente

1. Identificar el componente específico
2. Modificar solo ese archivo
3. Mantener la interfaz
4. Actualizar documentación si es necesario
5. Probar exhaustivamente

## Dependencias

- `@mui/material`: Componentes UI
- `@/app/actions/payment`: Server action para crear checkout
- `@/lib/vtrading-types`: Tipos del sistema
- `next/image`: Para logos de payment methods

## Variables de Entorno Requeridas

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Bold
BOLD_API_KEY=...

# ePayco
EPAYCO_PUBLIC_KEY=...
EPAYCO_PRIVATE_KEY=...

# Binance Pay
BINANCE_PAY_API_KEY=...
BINANCE_PAY_SECRET=...
```

## Notas Importantes

1. **Todos los formularios son client-side** (`'use client'`)
2. **La lógica de servidor está en `/app/actions/payment.ts`**
3. **Nunca exponer API keys en código cliente**
4. **Validar siempre en servidor además de cliente**
5. **Mantener consistencia en UX entre todos los métodos**

## Contacto

Para dudas sobre este módulo, revisar:

- `/app/actions/payment.ts` - Lógica de servidor
- `/lib/vtrading-types.ts` - Tipos del sistema
- `/app/plan/pagar/PagarContent.tsx` - Implementación principal
