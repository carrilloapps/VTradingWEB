'use client';

/**
 * Hooks personalizados para detección de plataforma y manejo de deep links
 */

import { useEffect, useState } from 'react';
import type { DeepLinkConfig, DeepLinkResult } from './deep-links';
import { generateDeepLink, openApp } from './deep-links';

export interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  userAgent: string;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
}

/**
 * Hook para detectar la plataforma del usuario
 * @returns Información de la plataforma
 */
export function usePlatform(): PlatformInfo {
  const [platform, setPlatform] = useState<PlatformInfo>({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isDesktop: true,
    userAgent: '',
    platform: 'unknown',
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;
    const isDesktop = !isMobile;

    let platformType: PlatformInfo['platform'] = 'unknown';
    if (isIOS) {
      platformType = 'ios';
    } else if (isAndroid) {
      platformType = 'android';
    } else if (isDesktop) {
      platformType = 'desktop';
    }

    setPlatform({
      isIOS,
      isAndroid,
      isMobile,
      isDesktop,
      userAgent,
      platform: platformType,
    });
  }, []);

  return platform;
}

/**
 * Hook para verificar si VTradingAPP está instalada
 * @returns Estado de instalación de la app
 */
export function useAppInstalled(): {
  isInstalled: boolean | null;
  isChecking: boolean;
  checkInstallation: () => void;
} {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkInstallation = (): void => {
    setIsChecking(true);

    const timeout = setTimeout(() => {
      // Si después de 1 segundo no se abrió la app, asumimos que no está instalada
      setIsInstalled(false);
      setIsChecking(false);
    }, 1000);

    const handleBlur = (): void => {
      // Si la ventana pierde el foco, la app probablemente se abrió
      clearTimeout(timeout);
      setIsInstalled(true);
      setIsChecking(false);
      window.removeEventListener('blur', handleBlur);
    };

    window.addEventListener('blur', handleBlur);

    // Intentar abrir un deep link silencioso
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'vtrading://';
      document.body.appendChild(iframe);

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    } catch (error) {
      console.error('Error al verificar instalación:', error);
      setIsInstalled(false);
      setIsChecking(false);
    }
  };

  return { isInstalled, isChecking, checkInstallation };
}

/**
 * Hook para generar y manejar deep links
 * @param config - Configuración del deep link
 * @returns Utilidades para trabajar con deep links
 */
export function useDeepLink(config: DeepLinkConfig) {
  const [deepLink, setDeepLink] = useState<DeepLinkResult | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const platform = usePlatform();

  useEffect(() => {
    const link = generateDeepLink(config);
    setDeepLink(link);
  }, [config]);

  const open = (options?: Parameters<typeof openApp>[1]): void => {
    if (!deepLink) return;

    setIsOpening(true);

    openApp(deepLink, {
      ...options,
      onAppOpened: () => {
        setIsOpening(false);
        options?.onAppOpened?.();
      },
      onAppNotInstalled: () => {
        setIsOpening(false);
        options?.onAppNotInstalled?.();
      },
    });
  };

  return {
    deepLink,
    isOpening,
    open,
    platform,
  };
}

/**
 * Hook para manejar el banner de descarga de la app
 * Persiste el estado de "mostrar/ocultar" en localStorage
 * @returns Estado y controles del banner
 */
export function useAppBanner(options?: {
  /** Clave para localStorage (default: 'vtrading_app_banner_dismissed') */
  storageKey?: string;
  /** Forzar mostrar el banner incluso si fue cerrado antes */
  force?: boolean;
}) {
  const { storageKey = 'vtrading_app_banner_dismissed', force = false } = options || {};

  const platform = usePlatform();
  const [isDismissed, setIsDismissed] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar en móviles
    if (!platform.isMobile) {
      setIsVisible(false);
      return;
    }

    // Verificar si el usuario ya lo cerró antes
    if (!force) {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed === 'true') {
        setIsDismissed(true);
        setIsVisible(false);
        return;
      }
    }

    setIsDismissed(false);
    setIsVisible(true);
  }, [platform.isMobile, storageKey, force]);

  const dismiss = (): void => {
    localStorage.setItem(storageKey, 'true');
    setIsDismissed(true);
    setIsVisible(false);
  };

  const reset = (): void => {
    localStorage.removeItem(storageKey);
    setIsDismissed(false);
    setIsVisible(platform.isMobile);
  };

  return {
    isVisible,
    isDismissed,
    dismiss,
    reset,
    platform,
  };
}

/**
 * Hook para manejar compartición con deep links
 * @param config - Configuración del deep link
 * @returns Funciones para compartir
 */
export function useShareDeepLink(config: DeepLinkConfig) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const deepLink = generateDeepLink(config);

  const share = async (options?: { title?: string; text?: string }): Promise<void> => {
    setIsSharing(true);
    setShareError(null);

    try {
      if (navigator.share) {
        await navigator.share({
          title: options?.title || 'VTradingAPP',
          text: options?.text || 'Mira esto en VTradingAPP',
          url: deepLink.universalLink,
        });
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(deepLink.universalLink);
        alert('¡Enlace copiado al portapapeles!');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error al compartir:', error);
        setShareError('No se pudo compartir el enlace');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(deepLink.universalLink);
      return true;
    } catch (error) {
      console.error('Error al copiar:', error);
      setShareError('No se pudo copiar el enlace');
      return false;
    }
  };

  return {
    deepLink,
    isSharing,
    shareError,
    share,
    copyToClipboard,
  };
}
