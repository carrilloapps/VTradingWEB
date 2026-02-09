'use client';

/**
 * Smart App Banner
 * Banner inteligente que invita a los usuarios móviles a abrir o descargar la app
 */

import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useAppBanner } from '@/lib/use-deep-links';
import { getAppStoreLink } from '@/lib/deep-links';
import type { DeepLinkConfig } from '@/lib/deep-links';
import { useDeepLink } from '@/lib/use-deep-links';

export interface SmartAppBannerProps {
  /** Configuración del deep link para abrir contenido específico */
  deepLinkConfig?: DeepLinkConfig;
  /** Título personalizado */
  title?: string;
  /** Descripción personalizada */
  description?: string;
  /** Mostrar siempre, incluso si fue cerrado antes */
  forceShow?: boolean;
  /** Callback cuando se abre la app */
  onOpenApp?: () => void;
  /** Callback cuando se va a la tienda */
  onGoToStore?: () => void;
}

export function SmartAppBanner({
  deepLinkConfig,
  title = 'VTradingAPP',
  description = 'Abre en la app para una mejor experiencia',
  forceShow = false,
  onOpenApp,
  onGoToStore,
}: SmartAppBannerProps) {
  const { isVisible, dismiss, platform } = useAppBanner({ force: forceShow });

  const defaultConfig: DeepLinkConfig = {
    type: 'home',
    path: '',
  };

  const { deepLink, open: openApp } = useDeepLink(deepLinkConfig || defaultConfig);

  if (!isVisible || !platform.isMobile) {
    return null;
  }

  const handleOpenApp = (): void => {
    onOpenApp?.();
    openApp({
      onAppNotInstalled: () => {
        // Si la app no está instalada, ir a la tienda
        window.location.href = getAppStoreLink();
        onGoToStore?.();
      },
    });
  };

  const handleGoToStore = (): void => {
    onGoToStore?.();
    window.location.href = getAppStoreLink();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        borderRadius: 0,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1.5,
          px: 2,
        }}
      >
        {/* Icono de la plataforma */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            borderRadius: 2,
            color: 'primary.contrastText',
            flexShrink: 0,
          }}
        >
          {platform.isIOS ? <AppleIcon fontSize="large" /> : <AndroidIcon fontSize="large" />}
        </Box>

        {/* Contenido */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 0.25,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          <Button
            variant="contained"
            size="small"
            endIcon={<OpenInNewIcon />}
            onClick={handleOpenApp}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
            }}
          >
            Abrir
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={handleGoToStore}
            sx={{
              textTransform: 'none',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            Descargar
          </Button>

          <IconButton size="small" onClick={dismiss} aria-label="Cerrar banner" sx={{ ml: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
