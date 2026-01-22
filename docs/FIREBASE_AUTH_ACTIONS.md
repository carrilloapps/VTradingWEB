# Manual de Integración: Acciones de Autenticación Firebase

Este documento describe cómo configurar y manejar las acciones de correo electrónico de Firebase Authentication (restablecimiento de contraseña, verificación de email, recuperación de email) utilizando la página personalizada implementada en este proyecto.

## 1. Implementación en el Proyecto

Hemos creado una página dedicada en `app/auth/action/page.tsx` que maneja los siguientes modos de acción (`mode`):

*   **`resetPassword`**: Permite al usuario ingresar una nueva contraseña.
*   **`verifyEmail`**: Verifica automáticamente el correo electrónico al cargar la página.
*   **`recoverEmail`**: Permite revertir un cambio de correo electrónico no autorizado.

La página utiliza `firebase/auth` en el cliente para verificar los códigos de acción (`oobCode`) y ejecutar las operaciones.

## 2. Configuración en Firebase Console (OBLIGATORIO)

Para que los correos electrónicos enviados por Firebase dirijan a los usuarios a nuestra página personalizada en lugar de la página predeterminada de Firebase, debes realizar la siguiente configuración:

1.  Ve a la [Consola de Firebase](https://console.firebase.google.com/).
2.  Selecciona tu proyecto (**vtrading-prod**).
3.  Navega a **Authentication** en el menú lateral.
4.  Ve a la pestaña **Plantillas** (Templates).
5.  Selecciona **Restablecer contraseña** (Password reset).
6.  Haz clic en el icono de edición (lápiz) o en "Personalizar URL de acción".
7.  En el campo "URL de acción personalizada" (Custom action URL), ingresa la URL completa de tu página de acción:

    *   **Desarrollo:** `http://localhost:3000/auth/action`
    *   **Producción:** `https://vtrading.app/auth/action` (o tu dominio final)

8.  Guarda los cambios.
9.  Repite los pasos 6-8 para la plantilla **Verificación de dirección de correo electrónico**.

> **Nota:** Al configurar esto, Firebase añadirá automáticamente los parámetros `mode`, `oobCode` y `apiKey` a tu URL cuando envíe los correos.

## 3. Variables de Entorno (Firebase Admin)

Para operaciones del lado del servidor (como suscripciones a tópicos o gestión de usuarios avanzada), utilizamos `firebase-admin`. Asegúrate de que tu archivo `.env.local` tenga las siguientes variables configuradas.

Estas credenciales se obtienen de: **Configuración del Proyecto > Cuentas de servicio > Generar nueva clave privada**.

```env
# ... otras variables ...

# Firebase Admin SDK (Service Account)
# El email de la cuenta de servicio (ej: firebase-adminsdk-xxxxx@proyecto.iam.gserviceaccount.com)
FIREBASE_CLIENT_EMAIL=tu-client-email@vtrading-prod.iam.gserviceaccount.com

# La clave privada completa. En Vercel/Producción, asegúrate de manejar los saltos de línea (\n) correctamente.
# En .env local, puedes ponerla tal cual entre comillas si es necesario, o asegurarte de que los \n se interpreten.
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD...\n-----END PRIVATE KEY-----\n"
```

## 4. Pruebas

Para probar el flujo:

1.  Ve a la página de **Login**.
2.  Haz clic en "¿Olvidaste tu contraseña?".
3.  Ingresa tu correo y envía.
4.  Revisa tu bandeja de entrada.
5.  El enlace debe dirigirte a `http://localhost:3000/auth/action?mode=resetPassword&oobCode=...`.
6.  Verifica que la UI de VTrading cargue correctamente y te permita cambiar la contraseña.
