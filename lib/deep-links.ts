/**
 * Deep Links Utilities para VTradingAPP
 * Genera y maneja deep links para abrir la aplicación móvil desde la web
 */

export interface DeepLinkConfig {
  /** Ruta del artículo, categoría, tag, etc. */
  path: string;
  /** Tipo de contenido */
  type: 'article' | 'category' | 'tag' | 'discover' | 'home';
  /** Parámetros adicionales para la URL */
  params?: Record<string, string>;
}

export interface DeepLinkResult {
  /** URL del custom scheme (vtrading://) */
  customScheme: string;
  /** URL universal (https://vtrading.app) */
  universalLink: string;
  /** URL de fallback (discover.vtrading.app) */
  fallbackLink: string;
}

/**
 * Configuración de dominios
 */
const DOMAINS = {
  main: 'vtrading.app',
  discover: 'discover.vtrading.app',
  scheme: 'vtrading://',
} as const;

/**
 * Genera todas las variantes de deep link para un contenido específico
 * @param config - Configuración del deep link
 * @returns Objeto con todas las URLs generadas
 */
export function generateDeepLink(config: DeepLinkConfig): DeepLinkResult {
  const { path, type, params } = config;

  // Construir query string si hay parámetros
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';

  // Generar custom scheme URL
  let customScheme = '';
  switch (type) {
    case 'article':
      customScheme = `${DOMAINS.scheme}article/${path}${queryString}`;
      break;
    case 'category':
      customScheme = `${DOMAINS.scheme}categoria/${path}${queryString}`;
      break;
    case 'tag':
      customScheme = `${DOMAINS.scheme}tag/${path}${queryString}`;
      break;
    case 'discover':
      customScheme = `${DOMAINS.scheme}discover${queryString}`;
      break;
    case 'home':
    default:
      customScheme = `${DOMAINS.scheme}${queryString}`;
      break;
  }

  // Generar universal link (iOS/Android)
  let universalLink = '';
  switch (type) {
    case 'article':
      universalLink = `https://${DOMAINS.main}/${path}${queryString}`;
      break;
    case 'category':
      universalLink = `https://${DOMAINS.main}/categoria/${path}${queryString}`;
      break;
    case 'tag':
      universalLink = `https://${DOMAINS.main}/tag/${path}${queryString}`;
      break;
    case 'discover':
      universalLink = `https://${DOMAINS.main}/discover${queryString}`;
      break;
    case 'home':
    default:
      universalLink = `https://${DOMAINS.main}${queryString}`;
      break;
  }

  // Generar fallback link (discover subdomain)
  let fallbackLink = '';
  switch (type) {
    case 'article':
      fallbackLink = `https://${DOMAINS.discover}/${path}${queryString}`;
      break;
    case 'category':
      fallbackLink = `https://${DOMAINS.discover}/categoria/${path}${queryString}`;
      break;
    case 'tag':
      fallbackLink = `https://${DOMAINS.discover}/tag/${path}${queryString}`;
      break;
    case 'discover':
      fallbackLink = `https://${DOMAINS.discover}${queryString}`;
      break;
    case 'home':
    default:
      fallbackLink = `https://${DOMAINS.discover}${queryString}`;
      break;
  }

  return {
    customScheme,
    universalLink,
    fallbackLink,
  };
}

/**
 * Intenta abrir la aplicación móvil usando deep links
 * Si la app no está instalada, redirige a la URL de fallback
 * @param deepLink - Resultado de generateDeepLink
 * @param options - Opciones de apertura
 */
export function openApp(
  deepLink: DeepLinkResult,
  options: {
    /** Tiempo en ms para esperar antes de considerar que la app no está instalada */
    timeout?: number;
    /** URL de fallback personalizada (por defecto usa fallbackLink) */
    fallbackUrl?: string;
    /** Callback cuando la app se abre exitosamente */
    onAppOpened?: () => void;
    /** Callback cuando la app no está instalada */
    onAppNotInstalled?: () => void;
  } = {}
): void {
  const { timeout = 2500, fallbackUrl, onAppOpened, onAppNotInstalled } = options;

  // Detectar plataforma
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;

  if (!isMobile) {
    // En desktop, abrir directamente la URL de fallback
    window.location.href = fallbackUrl || deepLink.fallbackLink;
    return;
  }

  // Timestamp de inicio
  const startTime = Date.now();
  let appOpened = false;

  // Listener para detectar si el usuario sale de la página (app se abrió)
  const handleVisibilityChange = (): void => {
    if (document.hidden) {
      appOpened = true;
      onAppOpened?.();
    }
  };

  const handleBlur = (): void => {
    appOpened = true;
    onAppOpened?.();
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', handleBlur);

  // Intentar abrir la app
  try {
    if (isIOS) {
      // En iOS, intentar con universal link primero
      window.location.href = deepLink.universalLink;
    } else if (isAndroid) {
      // En Android, intentar con el intent primero
      const intent = `intent://${deepLink.universalLink.replace('https://', '')}#Intent;scheme=https;package=com.vtradingapp;end`;
      window.location.href = intent;
    } else {
      // Fallback para otros casos
      window.location.href = deepLink.customScheme;
    }

    // Timeout para verificar si la app se abrió
    setTimeout(() => {
      const elapsedTime = Date.now() - startTime;

      // Limpiar listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);

      // Si la app no se abrió (el usuario sigue en la página)
      if (!appOpened && elapsedTime < timeout + 500) {
        onAppNotInstalled?.();
        // Redirigir a fallback
        window.location.href = fallbackUrl || deepLink.fallbackLink;
      }
    }, timeout);
  } catch (error) {
    console.error('Error al intentar abrir la app:', error);
    // En caso de error, ir al fallback
    window.location.href = fallbackUrl || deepLink.fallbackLink;
  }
}

/**
 * Genera un enlace compartible con tracking
 * @param config - Configuración del deep link
 * @param source - Fuente del compartido (para analytics)
 * @returns URL lista para compartir
 */
export function generateShareLink(config: DeepLinkConfig, source?: string): string {
  const params = {
    ...config.params,
    ...(source && { utm_source: source }),
    utm_medium: 'web',
    utm_campaign: 'deeplink_share',
  };

  const deepLink = generateDeepLink({ ...config, params });
  return deepLink.universalLink;
}

/**
 * Extrae información de un deep link
 * @param url - URL del deep link
 * @returns Información extraída del deep link
 */
export function parseDeepLink(url: string): DeepLinkConfig | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;

    // Verificar si es un dominio válido
    if (
      hostname !== DOMAINS.main &&
      hostname !== DOMAINS.discover &&
      !url.startsWith(DOMAINS.scheme)
    ) {
      return null;
    }

    // Parsear parámetros
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Determinar tipo y path
    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathSegments.length === 0) {
      return { type: 'home', path: '', params };
    }

    const [firstSegment, ...rest] = pathSegments;

    if (firstSegment === 'categoria' && rest.length > 0) {
      return { type: 'category', path: rest.join('/'), params };
    }

    if (firstSegment === 'tag' && rest.length > 0) {
      return { type: 'tag', path: rest.join('/'), params };
    }

    if (firstSegment === 'discover') {
      return { type: 'discover', path: '', params };
    }

    // Por defecto, asumimos que es un artículo
    return { type: 'article', path: pathSegments.join('/'), params };
  } catch (error) {
    console.error('Error parseando deep link:', error);
    return null;
  }
}

/**
 * Genera un botón de descarga de la app según la plataforma
 * @returns URL de la tienda correspondiente
 */
export function getAppStoreLink(): string {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isIOS) {
    return 'https://apps.apple.com/app/vtradingapp/idXXXXXXXXXX'; // TODO: Reemplazar con ID real
  }

  if (isAndroid) {
    return 'https://play.google.com/store/apps/details?id=com.vtradingapp';
  }

  // Fallback para desktop
  return 'https://vtrading.app/app';
}
