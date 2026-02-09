/**
 * Ejemplo de uso del Smart App Banner
 * Agrega este componente al layout principal para mostrar el banner en todas las páginas
 */

'use client';

import { SmartAppBanner } from '@/components/SmartAppBanner';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { DeepLinkConfig } from '@/lib/deep-links';

export function GlobalAppBanner() {
  const pathname = usePathname();

  // Generar configuración de deep link basada en la ruta actual
  const deepLinkConfig = useMemo((): DeepLinkConfig => {
    // Página principal
    if (pathname === '/') {
      return { type: 'home', path: '' };
    }

    // Discover
    if (pathname === '/discover' || pathname.startsWith('/discover')) {
      return { type: 'discover', path: '' };
    }

    // Categorías
    if (pathname.startsWith('/categoria/')) {
      const slug = pathname.replace('/categoria/', '');
      return { type: 'category', path: slug };
    }

    // Tags
    if (pathname.startsWith('/tag/')) {
      const slug = pathname.replace('/tag/', '');
      return { type: 'tag', path: slug };
    }

    // Artículos (cualquier otra ruta)
    const slug = pathname.replace('/', '');
    return { type: 'article', path: slug };
  }, [pathname]);

  return (
    <SmartAppBanner
      deepLinkConfig={deepLinkConfig}
      title="VTradingAPP"
      description="Mejor experiencia en la app"
    />
  );
}
