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
import { useSearchParams } from 'next/navigation';

export default function SuccessContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate payment verification
    const verifyPayment = async () => {
      // In production, you would verify the payment with your backend
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setVerifying(false);
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Error al verificar el pago');
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

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
          {verifying ? (
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
                  <CircularProgress size={70} color="success" thickness={4} />
                  <Typography variant="h4" fontWeight={700}>
                    Verificando tu pago...
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Por favor, espera mientras confirmamos tu transacción
                  </Typography>
                </Stack>
              </Paper>
            </Fade>
          ) : error ? (
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
                  border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                  borderRadius: 3,
                }}
              >
                <Stack spacing={3}>
                  <Alert severity="error" sx={{ fontSize: '1rem' }}>
                    {error}
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/soporte"
                    size="large"
                    sx={{ minHeight: 48 }}
                  >
                    Contactar Soporte
                  </Button>
                </Stack>
              </Paper>
            </Fade>
          ) : (
            <Grid container spacing={4} alignItems="stretch">
              {/* Left Column: Success Header Card */}
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
                      border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
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
                        background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                      },
                    }}
                  >
                    <Stack spacing={3} alignItems="center">
                      {/* Success Icon with Animation */}
                      <Box
                        sx={{
                          width: { xs: 100, md: 120, lg: 140 },
                          height: { xs: 100, md: 120, lg: 140 },
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, ${alpha(theme.palette.success.light, 0.1)} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -8,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, transparent)`,
                            animation: 'pulse 2s ease-in-out infinite',
                          },
                          '@keyframes pulse': {
                            '0%, 100%': {
                              opacity: 1,
                              transform: 'scale(1)',
                            },
                            '50%': {
                              opacity: 0.5,
                              transform: 'scale(1.05)',
                            },
                          },
                        }}
                      >
                        <CheckCircleIcon
                          sx={{
                            fontSize: { xs: 60, md: 75, lg: 90 },
                            color: 'success.main',
                          }}
                        />
                      </Box>

                      {/* Success Title */}
                      <Box>
                        <Typography
                          variant="h4"
                          fontWeight={800}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            fontSize: { xs: '1.75rem', md: '2rem', lg: '2.5rem' },
                          }}
                        >
                          ¡Pago Exitoso!
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          fontWeight={500}
                          sx={{ maxWidth: 300, mx: 'auto' }}
                        >
                          Tu suscripción a VTrading Premium ha sido activada
                        </Typography>
                      </Box>

                      {/* Premium Badge */}
                      <Chip
                        icon={<StarIcon />}
                        label="PREMIUM ACTIVO"
                        color="success"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          px: 2,
                          py: 2.5,
                          height: 'auto',
                          '& .MuiChip-icon': {
                            fontSize: '1.2rem',
                          },
                        }}
                      />
                    </Stack>
                  </Paper>
                </Zoom>
              </Grid>

              {/* Right Column: Steps, Transaction & Actions */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <Stack spacing={3}>
                  {/* Next Steps Card */}
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
                            <VerifiedUserIcon sx={{ fontSize: 32, color: 'success.main' }} />
                            <Typography variant="h6" fontWeight={700}>
                              ¿Qué sigue?
                            </Typography>
                          </Box>

                          <Divider />

                          <Grid container spacing={1}>
                            {[
                              {
                                icon: (
                                  <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
                                ),
                                color: theme.palette.success.main,
                                text: 'Tu cuenta Premium está activa inmediatamente',
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
                                icon: (
                                  <CardGiftcardIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                                ),
                                color: theme.palette.warning.main,
                                text: 'Si referiste a alguien, tu mes gratis se aplicará automáticamente',
                              },
                            ].map((item, index) => (
                              <Grid size={{ xs: 12, md: 6 }} key={index}>
                                <ListItem sx={{ px: 0, py: 1 }}>
                                  <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Box
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        bgcolor: alpha(item.color as string, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      {item.icon}
                                    </Box>
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                      fontWeight: 600,
                                      fontSize: '0.9rem',
                                      lineHeight: 1.3,
                                    }}
                                  />
                                </ListItem>
                              </Grid>
                            ))}
                          </Grid>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grow>

                  {/* Transaction ID & Action Buttons Row */}
                  <Stack spacing={3}>
                    {/* Transaction ID */}
                    {sessionId && (
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
                                {sessionId}
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Fade>
                    )}

                    {/* Action Buttons */}
                    <Fade in timeout={1200}>
                      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          href="/cuenta"
                          fullWidth
                          startIcon={<AccountCircleIcon />}
                          sx={{
                            minHeight: 64,
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            borderRadius: 3,
                            textTransform: 'none',
                            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                            },
                          }}
                        >
                          Ver Cuenta
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          href="/"
                          fullWidth
                          startIcon={<HomeIcon />}
                          sx={{
                            minHeight: 64,
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            borderRadius: 3,
                            textTransform: 'none',
                            borderWidth: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderWidth: 2,
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          Inicio
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
