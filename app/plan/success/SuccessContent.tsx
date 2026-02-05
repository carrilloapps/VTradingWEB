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
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
          py: 8,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.success.dark, 0.05)
              : alpha(theme.palette.success.light, 0.05),
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 5,
              textAlign: 'center',
              border: `2px solid ${theme.palette.success.main}`,
            }}
          >
            {verifying ? (
              <Stack spacing={3} alignItems="center">
                <CircularProgress size={60} color="success" />
                <Typography variant="h5" fontWeight={700}>
                  Verificando tu pago...
                </Typography>
                <Typography color="text.secondary">
                  Por favor, espera mientras confirmamos tu transacción
                </Typography>
              </Stack>
            ) : error ? (
              <Stack spacing={3}>
                <Alert severity="error">{error}</Alert>
                <Button variant="contained" color="primary" href="/soporte" size="large">
                  Contactar Soporte
                </Button>
              </Stack>
            ) : (
              <Stack spacing={3} alignItems="center">
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: 60,
                      color: 'success.main',
                    }}
                  />
                </Box>

                <Typography variant="h4" fontWeight={800} color="success.main" gutterBottom>
                  ¡Pago Exitoso!
                </Typography>

                <Typography variant="h6" color="text.secondary">
                  Tu suscripción a VTrading Premium ha sido activada
                </Typography>

                <Alert severity="success" sx={{ width: '100%', textAlign: 'left' }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>¿Qué sigue?</strong>
                  </Typography>
                  <Typography variant="body2">
                    • Tu cuenta Premium está activa inmediatamente
                    <br />
                    • Recibirás un email de confirmación
                    <br />
                    • Descarga la app para disfrutar todas las funciones
                    <br />• Si referiste a alguien con tu código, tu mes gratis se aplicará
                    automáticamente
                  </Typography>
                </Alert>

                {sessionId && (
                  <Typography variant="caption" color="text.secondary">
                    ID de transacción: {sessionId}
                  </Typography>
                )}

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ width: '100%', mt: 2 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    href="/cuenta"
                    size="large"
                    fullWidth
                    startIcon={<AccountCircleIcon />}
                  >
                    Ver mi Cuenta
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    href="/"
                    size="large"
                    fullWidth
                    startIcon={<HomeIcon />}
                  >
                    Ir al Inicio
                  </Button>
                </Stack>
              </Stack>
            )}
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
