'use client';

/**
 * Página de redirección universal
 * Esta página se muestra cuando un usuario accede a un deep link
 * Intenta abrir la app automáticamente, o muestra opciones para descargarla
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Button, CircularProgress, Container, Paper, Typography, Stack } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { usePlatform, useDeepLink } from '@/lib/use-deep-links';
import { getAppStoreLink } from '@/lib/deep-links';
import type { DeepLinkConfig } from '@/lib/deep-links';

export interface AppRedirectProps {
  /** Configuración del deep link */
  config: DeepLinkConfig;
  /** URL de fallback si no se puede abrir la app */
  fallbackUrl?: string;
  /** Título de la página */
  title?: string;
  /** Descripción de la página */
  description?: string;
  /** Intentar abrir la app automáticamente */
  autoOpen?: boolean;
}

export default function AppRedirect({
  config,
  fallbackUrl,
  title = 'Abriendo VTradingAPP...',
  description,
  autoOpen = true,
}: AppRedirectProps) {
  const searchParams = useSearchParams();
  const platform = usePlatform();
  const { deepLink, open, isOpening } = useDeepLink(config);
  const [status, setStatus] = useState<'loading' | 'opening' | 'not-installed' | 'desktop'>(
    'loading'
  );

  useEffect(() => {
    if (!platform.isMobile) {
      setStatus('desktop');
      return;
    }

    if (autoOpen && deepLink) {
      setStatus('opening');

      // Pequeño delay para que el usuario vea el mensaje
      const timer = setTimeout(() => {
        open({
          fallbackUrl: fallbackUrl || searchParams.get('fallback') || undefined,
          onAppNotInstalled: () => {
            setStatus('not-installed');
          },
        });
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [platform.isMobile, autoOpen, deepLink, open, fallbackUrl, searchParams]);

  const handleOpenApp = (): void => {
    setStatus('opening');
    open({
      fallbackUrl: fallbackUrl || searchParams.get('fallback') || undefined,
      onAppNotInstalled: () => {
        setStatus('not-installed');
      },
    });
  };

  const handleGoToStore = (): void => {
    window.location.href = getAppStoreLink();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            width: '100%',
            maxWidth: 480,
          }}
        >
          {/* Estado: Cargando */}
          {status === 'loading' && (
            <Stack spacing={3} alignItems="center">
              <CircularProgress size={60} />
              <Typography variant="h5" fontWeight={600}>
                Cargando...
              </Typography>
            </Stack>
          )}

          {/* Estado: Abriendo app */}
          {status === 'opening' && (
            <Stack spacing={3} alignItems="center">
              <CircularProgress size={60} />
              <Typography variant="h5" fontWeight={600}>
                {title}
              </Typography>
              {description && (
                <Typography variant="body1" color="text.secondary">
                  {description}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Si la app no se abre automáticamente, haz clic en el botón abajo.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                endIcon={<OpenInNewIcon />}
                onClick={handleOpenApp}
                disabled={isOpening}
              >
                Abrir VTradingAPP
              </Button>
            </Stack>
          )}

          {/* Estado: App no instalada */}
          {status === 'not-installed' && (
            <Stack spacing={3} alignItems="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {platform.isIOS ? (
                  <AppleIcon sx={{ fontSize: 48 }} />
                ) : (
                  <AndroidIcon sx={{ fontSize: 48 }} />
                )}
              </Box>

              <Typography variant="h5" fontWeight={600}>
                ¡Descarga VTradingAPP!
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Parece que no tienes la app instalada. Descárgala gratis para disfrutar de la mejor
                experiencia de trading.
              </Typography>

              <Stack spacing={2} width="100%">
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={platform.isIOS ? <AppleIcon /> : <AndroidIcon />}
                  onClick={handleGoToStore}
                  sx={{ py: 1.5 }}
                >
                  Descargar en {platform.isIOS ? 'App Store' : 'Google Play'}
                </Button>

                <Button variant="outlined" size="large" fullWidth onClick={handleOpenApp}>
                  Intentar abrir de nuevo
                </Button>
              </Stack>
            </Stack>
          )}

          {/* Estado: Desktop */}
          {status === 'desktop' && (
            <Stack spacing={3} alignItems="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                }}
              >
                📱
              </Box>

              <Typography variant="h5" fontWeight={600}>
                VTradingAPP - Móvil
              </Typography>

              <Typography variant="body1" color="text.secondary">
                VTradingAPP está diseñada para dispositivos móviles. Escanea el código QR con tu
                teléfono para descargar la app.
              </Typography>

              <Box
                sx={{
                  width: 200,
                  height: 200,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  [QR Code aquí]
                </Typography>
              </Box>

              <Typography variant="caption" color="text.secondary">
                O visita vtrading.app desde tu móvil
              </Typography>
            </Stack>
          )}

          {/* Links adicionales */}
          {deepLink && (
            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                ¿Problemas para abrir la app?
              </Typography>
              <Button size="small" href={deepLink.universalLink} sx={{ textTransform: 'none' }}>
                Abrir enlace directo
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
