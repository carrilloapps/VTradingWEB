'use client';

/**
 * Botón para abrir la aplicación móvil
 * Componente reutilizable que maneja la apertura de la app con deep links
 */

import { Button, type ButtonProps } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { DeepLinkConfig } from '@/lib/deep-links';
import { useDeepLink } from '@/lib/use-deep-links';
import { getAppStoreLink } from '@/lib/deep-links';

export interface OpenAppButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Configuración del deep link */
  deepLinkConfig: DeepLinkConfig;
  /** Texto del botón */
  text?: string;
  /** Mostrar ícono */
  showIcon?: boolean;
  /** Callback cuando se abre la app */
  onOpenApp?: () => void;
  /** Callback cuando la app no está instalada */
  onAppNotInstalled?: () => void;
  /** Redirigir a la tienda si la app no está instalada */
  goToStoreOnNotInstalled?: boolean;
}

export function OpenAppButton({
  deepLinkConfig,
  text = 'Abrir en la app',
  showIcon = true,
  onOpenApp,
  onAppNotInstalled,
  goToStoreOnNotInstalled = false,
  ...buttonProps
}: OpenAppButtonProps) {
  const { open, isOpening, platform } = useDeepLink(deepLinkConfig);

  const handleClick = (): void => {
    open({
      onAppOpened: () => {
        onOpenApp?.();
      },
      onAppNotInstalled: () => {
        onAppNotInstalled?.();

        if (goToStoreOnNotInstalled) {
          window.location.href = getAppStoreLink();
        }
      },
    });
  };

  // No mostrar en desktop por defecto (a menos que se pase sx con display explícito)
  if (!platform.isMobile && buttonProps.sx === undefined) {
    return null;
  }

  return (
    <Button
      {...buttonProps}
      onClick={handleClick}
      disabled={isOpening || buttonProps.disabled}
      endIcon={showIcon ? <OpenInNewIcon /> : buttonProps.endIcon}
    >
      {isOpening ? 'Abriendo...' : text}
    </Button>
  );
}
