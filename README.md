# VTrading Web

VTrading es una plataforma web para seguimiento de tasas de cambio, alertas de divisas y calculadora de conversión. Ofrece planes gratuitos y premium con funcionalidades avanzadas.

## Características Principales

### Plan Free
- ✅ 5 alertas de divisas
- ✅ 2 divisas en calculadora
- ✅ Programa de referidos
- ⚠️ Incluye publicidad

### Plan Premium ($1 USD/mes)
- ✅ Alertas ilimitadas
- ✅ Sin publicidad
- ✅ Divisas ilimitadas en calculadora
- ✅ Personalización de widgets e imágenes
- ✅ Programa de referidos mejorado
- ✅ Soporte prioritario

## Stack Tecnológico

- **Framework:** Next.js 16.1.4 (App Router)
- **Lenguaje:** TypeScript 5+ (Strict Mode)
- **UI:** Material UI v7 + Emotion
- **Backend/API:** VTrading API
- **Estado:** React Context + Server Actions
- **Auth:** Firebase v12
- **Pagos:** Stripe, Bold.co, ePayco, Binance Pay

## Instalación y Configuración

### 1. Clonar e Instalar Dependencias

```bash
git clone <repository-url>
cd vtradingweb
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

Edita `.env.local` y completa las variables necesarias (Firebase, etc.)

### 3. Configurar Métodos de Pago (Opcional)

Si planeas usar pagos, instala los SDKs necesarios:

```bash
# Solo Stripe (recomendado)
npm install stripe

# O todos los métodos
npm install stripe epayco-sdk-node
```

Ver [PAYMENT_SETUP.md](./docs/PAYMENT_SETUP.md) para más detalles.

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
vtradingweb/
├── app/                    # Next.js App Router
│   ├── plan/              # Sistema de planes y pagos
│   │   ├── page.tsx       # Página de planes
│   │   ├── pagar/         # Checkout
│   │   └── success/       # Confirmación
│   ├── actions/           # Server Actions
│   └── ...                # Otras páginas
├── components/            # Componentes reutilizables
├── context/               # Context providers (Theme, Auth)
├── lib/                   # Utilidades y API clients
├── docs/                  # Documentación adicional
└── public/                # Assets estáticos
```

## Sistema de Pagos

### Métodos Soportados

1. **Stripe** - Internacional (Tarjetas)
2. **Bold.co** - Colombia (PSE, Nequi, Daviplata)
3. **ePayco** - Latinoamérica (Múltiples métodos)
4. **Binance Pay** - Global (Criptomonedas)

### Flujo de Pago

1. Usuario selecciona duración (1, 3, 6, 12 meses)
2. Elige método de pago preferido
3. Es redirigido al gateway externo
4. Completa el pago
5. Retorna a página de confirmación
6. Cuenta Premium es activada

Ver [documentación completa de pagos](./app/plan/pagar/AGENTS.md).

## Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Compila para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta ESLint
npx tsc --noEmit    # Verifica tipos TypeScript
```

## Testing

### Validación de Código

```bash
# TypeScript
npx tsc --noEmit

# Linting
npm run lint
```

### Testing de Pagos

Ver [PAYMENT_SETUP.md](./docs/PAYMENT_SETUP.md#testing-en-desarrollo) para tarjetas de prueba y configuración de ambientes de testing.

## Convenciones de Código

- **Idioma:** Código en inglés, comentarios en español
- **Naming:**
  - Components: `PascalCase`
  - Functions/Variables: `camelCase`
  - Files: `kebab-case` para directorios, `PascalCase.tsx` para componentes
- **Tipos:** TypeScript strict, evitar `any`
- **Estilos:** Material UI `sx` prop
- **Responsive:** Mobile-first design

## Documentación para Agentes IA

Cada directorio importante tiene un archivo `AGENTS.md` con:
- Propósito y contexto del directorio
- Reglas específicas de desarrollo
- Ejemplos y patrones recomendados

Ver [AGENTS.md](./AGENTS.md) principal para empezar.

## Deployment

### Vercel (Recomendado)

1. Push a GitHub/GitLab
2. Importa proyecto en Vercel
3. Configura variables de entorno
4. Deploy automático

Ver [documentación de deployment](https://nextjs.org/docs/app/building-your-application/deploying).

### Variables de Entorno en Producción

Asegúrate de configurar en tu plataforma:
- `NEXT_PUBLIC_*` - Variables públicas (Firebase, URLs)
- `STRIPE_SECRET_KEY`, etc. - Variables privadas (nunca expongas en frontend)

## Integración con Firebase

### Authentication
```typescript
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
```

### Firestore (Pendiente)
```typescript
// TODO: Implementar activación de Premium en Firestore
await updateDoc(doc(db, 'users', userId), {
  premiumUntil: new Date(...),
  premiumActive: true
});
```

## Roadmap

### Implementado
- ✅ Sistema de planes (Free/Premium)
- ✅ Página de checkout con 4 métodos de pago
- ✅ Integración con Firebase Auth
- ✅ Diseño responsive con Material UI
- ✅ Sistema de temas (light/dark)

### Pendiente
- ⏳ Webhooks para confirmación de pagos
- ⏳ Activación automática de Premium en Firestore
- ⏳ Sistema de referidos funcional
- ⏳ Emails de confirmación
- ⏳ Panel de administración
- ⏳ Tests unitarios y de integración

## Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Soporte

- **Documentación:** Ver archivos `AGENTS.md` en cada directorio
- **Issues:** Reporta problemas en GitHub Issues
- **Email:** jose.carrillo@yummysuperapp.com

## Licencia

PRIVATE - Todos los derechos reservados © 2026 VTrading Inc.

---

## Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
