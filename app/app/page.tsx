import { Suspense } from 'react';
import AppRedirect from '@/components/AppRedirect';
import type { DeepLinkConfig } from '@/lib/deep-links';

export const metadata = {
  title: 'Abriendo VTradingAPP',
  description: 'Redirigiendo a la aplicación VTradingAPP',
};

interface PageProps {
  searchParams: Promise<{
    type?: string;
    path?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function AppPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Construir configuración del deep link desde los parámetros
  const config: DeepLinkConfig = {
    type: (params.type as DeepLinkConfig['type']) || 'home',
    path: params.path || '',
    params: Object.entries(params)
      .filter(([key]) => key !== 'type' && key !== 'path')
      .reduce(
        (acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      ),
  };

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AppRedirect
        config={config}
        title="Abriendo VTradingAPP..."
        description="Serás redirigido a la aplicación en un momento."
      />
    </Suspense>
  );
}
