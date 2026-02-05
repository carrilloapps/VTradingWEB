'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Stack,
  Fade,
  Zoom,
  Grow,
  Chip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Divider,
  Grid,
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import { useSearchParams } from 'next/navigation';
import { logger } from '@/lib/logger';

type PaymentStatus = 'verifying' | 'success' | 'failed' | 'cancelled' | 'pending';

export default function SuccessContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Detect payment info from various providers
  const sessionId = searchParams.get('session_id'); // Stripe
  const paypalToken = searchParams.get('token'); // PayPal
  const epaycoStatus = searchParams.get('status'); // ePayco / General status
  const epaycoRef = searchParams.get('ref_payco'); // ePayco reference
  const boldSuccess = searchParams.get('success'); // Bold success param
  const boldRef = searchParams.get('reference'); // Bold reference
  const binanceStatus = searchParams.get('status'); // Binance / General status

  // Final display ID (can be session_id, reference, etc.)
  const transactionId = sessionId || epaycoRef || boldRef || paypalToken || searchParams.get('prepayId');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Simulate a small delay for verification feel
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Detection logic for different payment providers
        const explicitStatus = searchParams.get('status')?.toLowerCase();

        // 1. Check for cancellation (common across many)
        if (explicitStatus === 'cancel' || explicitStatus === 'cancelled' || boldSuccess === 'false') {
          setStatus('cancelled');
          return;
        }

        // 2. Check for failure
        if (explicitStatus === 'failed' || explicitStatus === 'error') {
          setStatus('failed');
          setErrorMessage(searchParams.get('message') || 'La transacción no pudo ser procesada');
          return;
        }

        // 3. Check for specific provider parameters
        if (sessionId || paypalToken || boldSuccess === 'true' || explicitStatus === 'success' || binanceStatus === 'SUCCESS') {
          setStatus('success');
          return;
        }

        // 4. Check for pending
        if (explicitStatus === 'pending' || explicitStatus === 'processing') {
          setStatus('pending');
          return;
        }

        // Default: If we have some ID but no explicit success, assume success for now (dev)
        // In production, we would call the backend here
        if (transactionId) {
          setStatus('success');
        } else {
          // If no parameters at all, we might be in success by default or just browsing
          setStatus('success');
        }
      } catch (err) {
        logger.error('Payment verification error', err);
        setStatus('failed');
        setErrorMessage('Error al verificar el estado del pago');
      }
    };

    verifyPayment();
  }, [searchParams, sessionId, paypalToken, boldSuccess, binanceStatus, transactionId]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 12, md: 20 },
          pb: { xs: 4, md: 8 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.success.dark, 0.08)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.12)} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 20%, ${alpha(theme.palette.success.main, 0.15)} 0%, transparent 50%)`,
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 80% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container
          maxWidth={false}
          sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 6, lg: 8, xl: 10 } }}
        >
          {status === 'verifying' ? (
            <Fade in timeout={600}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: 'center',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.6)
                      : alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <CircularProgress size={70} color="primary" thickness={4} />
                  <Typography variant="h4" fontWeight={700}>
                    Verificando tu pago...
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Por favor, espera mientras confirmamos tu transacción
                  </Typography>
                </Stack>
              </Paper>
            </Fade>
          ) : (
            <Grid container spacing={4} alignItems="stretch">
              {/* Left Column: Icon and Main Status Card */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <Zoom in timeout={600}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4, lg: 6 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.6)
                          : alpha(theme.palette.background.paper, 0.9),
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${status === 'success' ? alpha(theme.palette.success.main, 0.3) :
                        status === 'failed' ? alpha(theme.palette.error.main, 0.3) :
                          status === 'cancelled' ? alpha(theme.palette.warning.main, 0.3) :
                            alpha(theme.palette.info.main, 0.3)
                        }`,
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${status === 'success' ? theme.palette.success.main :
                          status === 'failed' ? theme.palette.error.main :
                            status === 'cancelled' ? theme.palette.warning.main :
                              theme.palette.info.main
                          }, ${theme.palette.primary.main})`,
                      },
                    }}
                  >
                    <Stack spacing={3} alignItems="center">
                      {/* Status Icon with Animation */}
                      <Box
                        sx={{
                          width: { xs: 100, md: 120, lg: 140 },
                          height: { xs: 100, md: 120, lg: 140 },
                          borderRadius: '50%',
                          background: (theme) => `linear-gradient(135deg, ${status === 'success' ? alpha(theme.palette.success.main, 0.2) :
                            status === 'failed' ? alpha(theme.palette.error.main, 0.2) :
                              status === 'cancelled' ? alpha(theme.palette.warning.main, 0.2) :
                                alpha(theme.palette.info.main, 0.2)
                            } 0%, ${status === 'success' ? alpha(theme.palette.success.light, 0.1) :
                              status === 'failed' ? alpha(theme.palette.error.light, 0.1) :
                                status === 'cancelled' ? alpha(theme.palette.warning.light, 0.1) :
                                  alpha(theme.palette.info.light, 0.1)
                            } 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -8,
                            borderRadius: '50%',
                            background: (theme) => `linear-gradient(135deg, ${status === 'success' ? alpha(theme.palette.success.main, 0.1) :
                              status === 'failed' ? alpha(theme.palette.error.main, 0.1) :
                                status === 'cancelled' ? alpha(theme.palette.warning.main, 0.1) :
                                  alpha(theme.palette.info.main, 0.1)
                              }, transparent)`,
                            animation: 'pulse 2s ease-in-out infinite',
                          },
                          '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                            '50%': { transform: 'scale(1.05)', opacity: 0.5 },
                          },
                        }}
                      >
                        {status === 'success' && <CheckCircleIcon sx={{ fontSize: { xs: 60, md: 75, lg: 90 }, color: 'success.main' }} />}
                        {status === 'failed' && <ErrorIcon sx={{ fontSize: { xs: 60, md: 75, lg: 90 }, color: 'error.main' }} />}
                        {status === 'cancelled' && <CancelIcon sx={{ fontSize: { xs: 60, md: 75, lg: 90 }, color: 'warning.main' }} />}
                        {status === 'pending' && <AccessTimeIcon sx={{ fontSize: { xs: 60, md: 75, lg: 90 }, color: 'info.main' }} />}
                      </Box>

                      {/* Status Title */}
                      <Box>
                        <Typography
                          variant="h4"
                          fontWeight={800}
                          sx={{
                            background: (theme) => `linear-gradient(135deg, ${status === 'success' ? theme.palette.success.main :
                              status === 'failed' ? theme.palette.error.main :
                                status === 'cancelled' ? theme.palette.warning.main :
                                  theme.palette.info.main
                              } 0%, ${status === 'success' ? theme.palette.success.dark :
                                status === 'failed' ? theme.palette.error.dark :
                                  status === 'cancelled' ? theme.palette.warning.dark :
                                    theme.palette.info.dark
                              } 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            fontSize: { xs: '1.75rem', md: '2rem', lg: '2.5rem' },
                          }}
                        >
                          {status === 'success' && '¡Pago Exitoso!'}
                          {status === 'failed' && 'Pago Fallido'}
                          {status === 'cancelled' && 'Pago Cancelado'}
                          {status === 'pending' && 'Pago Pendiente'}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          fontWeight={500}
                          sx={{ maxWidth: 300, mx: 'auto' }}
                        >
                          {status === 'success' && 'Tu suscripción a VTrading Premium ha sido activada'}
                          {status === 'failed' && (errorMessage || 'Hubo un error al procesar tu transacción')}
                          {status === 'cancelled' && 'La operación fue cancelada. No se ha realizado ningún cargo.'}
                          {status === 'pending' && 'Estamos esperando la confirmación de tu pago.'}
                        </Typography>
                      </Box>

                      {/* Status Badge */}
                      <Chip
                        icon={
                          status === 'success' ? <StarIcon /> :
                            status === 'failed' ? <ErrorIcon /> :
                              status === 'cancelled' ? <WarningIcon /> :
                                <AccessTimeIcon />
                        }
                        label={
                          status === 'success' ? 'PREMIUM ACTIVO' :
                            status === 'failed' ? 'ERROR EN PAGO' :
                              status === 'cancelled' ? 'CANCELADO' :
                                'PROCESANDO'
                        }
                        color={
                          status === 'success' ? 'success' :
                            status === 'failed' ? 'error' :
                              status === 'cancelled' ? 'warning' :
                                'info'
                        }
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          px: 2,
                          py: 2.5,
                          height: 'auto',
                          '& .MuiChip-icon': { fontSize: '1.2rem' },
                        }}
                      />
                    </Stack>
                  </Paper>
                </Zoom>
              </Grid>

              {/* Right Column: Steps, Transaction & Actions */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <Stack spacing={3}>
                  {/* Info Card (Steps, Error details, etc.) */}
                  <Grow in timeout={800}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        background: (theme) =>
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.4)
                            : alpha(theme.palette.background.paper, 0.7),
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Stack spacing={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {status === 'success' ? (
                              <VerifiedUserIcon sx={{ fontSize: 32, color: 'success.main' }} />
                            ) : status === 'failed' ? (
                              <ErrorIcon sx={{ fontSize: 32, color: 'error.main' }} />
                            ) : status === 'cancelled' ? (
                              <CancelIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                            ) : (
                              <AccessTimeIcon sx={{ fontSize: 32, color: 'info.main' }} />
                            )}
                            <Typography variant="h6" fontWeight={700}>
                              {status === 'success' ? '¿Qué sigue?' :
                                status === 'failed' ? 'Detalles del error' :
                                  status === 'cancelled' ? 'Información adicional' :
                                    'Información del proceso'}
                            </Typography>
                          </Box>

                          <Divider />

                          {status === 'success' || status === 'pending' ? (
                            <Grid container spacing={1}>
                              {[
                                {
                                  icon: <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />,
                                  color: theme.palette.success.main,
                                  text: status === 'success' ? 'Tu cuenta Premium está activa inmediatamente' : 'Tu cuenta será activada al confirmar el pago',
                                },
                                {
                                  icon: <EmailIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
                                  color: theme.palette.primary.main,
                                  text: 'Recibirás un email de confirmación',
                                },
                                {
                                  icon: <PhoneIphoneIcon sx={{ fontSize: 20, color: 'info.main' }} />,
                                  color: theme.palette.info.main,
                                  text: 'Descarga la app para disfrutar todas las funciones',
                                },
                                {
                                  icon: <CardGiftcardIcon sx={{ fontSize: 20, color: 'warning.main' }} />,
                                  color: theme.palette.warning.main,
                                  text: 'Si referiste a alguien, tu mes gratis se aplicará automáticamente',
                                },
                              ].map((item, index) => (
                                <Grid size={{ xs: 12, md: 6 }} key={index}>
                                  <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: alpha(item.color as string, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.icon}
                                      </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={item.text}
                                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3 }}
                                    />
                                  </ListItem>
                                </Grid>
                              ))}
                            </Grid>
                          ) : status === 'failed' ? (
                            <Stack spacing={2}>
                              <Alert severity="error" sx={{ borderRadius: 2 }}>
                                {errorMessage || 'La transacción no pudo completarse. Por favor verifica los datos e intenta nuevamente.'}
                              </Alert>
                              <Typography variant="body2" color="text.secondary">
                                Si el cargo se realizó en tu banco pero no ves tu cuenta activa, por favor contacta a nuestro equipo de soporte con tu ID de transacción.
                              </Typography>
                            </Stack>
                          ) : (
                            <Stack spacing={2}>
                              <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
                                No se ha realizado ningún cargo a tu cuenta. Puedes intentar realizar el pago nuevamente usando el mismo u otro método de pago.
                              </Alert>
                              <Typography variant="body2" color="text.secondary">
                                Si cambiaste de opinión, puedes volver a ver nuestros planes para encontrar el que mejor se adapte a tus necesidades.
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grow>

                  {/* Transaction ID & Action Buttons Row */}
                  <Stack spacing={3}>
                    {/* Transaction ID */}
                    {transactionId && (
                      <Fade in timeout={1000}>
                        <Card
                          elevation={0}
                          sx={{
                            width: '100%',
                            background: (theme) =>
                              theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.paper, 0.3)
                                : alpha(theme.palette.background.paper, 0.6),
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: 3,
                          }}
                        >
                          <CardContent sx={{ p: 2.5 }}>
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <ReceiptLongIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                <Typography
                                  variant="caption"
                                  fontWeight={700}
                                  color="text.secondary"
                                  sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                >
                                  ID de transacción
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'monospace',
                                  fontWeight: 600,
                                  wordBreak: 'break-all',
                                }}
                              >
                                {transactionId}
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Fade>
                    )}

                    {/* Action Buttons */}
                    <Fade in timeout={1200}>
                      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                        {status === 'failed' ? (
                          <Button
                            variant="contained"
                            color="error"
                            href="/plan/pagar"
                            fullWidth
                            sx={{
                              minHeight: 64,
                              fontWeight: 700,
                              borderRadius: 3,
                              textTransform: 'none',
                              boxShadow: `0 4px 14px ${alpha(theme.palette.error.main, 0.4)}`,
                            }}
                          >
                            Reintentar Pago
                          </Button>
                        ) : status === 'cancelled' ? (
                          <Button
                            variant="contained"
                            color="primary"
                            href="/plan/pagar"
                            fullWidth
                            sx={{
                              minHeight: 64,
                              fontWeight: 700,
                              borderRadius: 3,
                              textTransform: 'none',
                            }}
                          >
                            Ver Otros Planes
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            href="/cuenta"
                            fullWidth
                            startIcon={<AccountCircleIcon />}
                            sx={{
                              minHeight: 64,
                              fontWeight: 700,
                              borderRadius: 3,
                              textTransform: 'none',
                              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }}
                          >
                            Ver Mi Cuenta
                          </Button>
                        )}

                        <Button
                          variant="outlined"
                          color="primary"
                          href="/"
                          fullWidth
                          startIcon={<HomeIcon />}
                          sx={{
                            minHeight: 64,
                            fontWeight: 700,
                            borderRadius: 3,
                            textTransform: 'none',
                            borderWidth: 2,
                            '&:hover': { borderWidth: 2 },
                          }}
                        >
                          {status === 'failed' ? 'Ir al Inicio' : 'Volver al Inicio'}
                        </Button>
                      </Stack>
                    </Fade>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
