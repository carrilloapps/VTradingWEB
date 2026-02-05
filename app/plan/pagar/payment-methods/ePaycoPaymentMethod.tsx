/**
 * ePayco Payment Method Component (Latin America)
 * Integration for multiple payment methods across LATAM
 */

'use client';

import React, { useState, FormEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { PaymentMethodComponentProps, CustomerInfo } from './types';
import { createPaymentCheckout } from '@/app/actions/payment';

/**
 * ePayco Payment Form Component
 * For Latin American countries
 */
export default function EPaycoPaymentMethod({
  planDetails,
  onSuccess,
  onError,
  loading: externalLoading = false,
}: PaymentMethodComponentProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    documentNumber: '',
  });

  const handleInputChange =
    (field: keyof CustomerInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomerInfo((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setError(null);
    };

  const validateForm = (): boolean => {
    if (!customerInfo.name || customerInfo.name.length < 3) {
      setError('Por favor ingresa tu nombre completo');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerInfo.email || !emailRegex.test(customerInfo.email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (!customerInfo.phone || customerInfo.phone.length < 10) {
      setError('Por favor ingresa un número de teléfono válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createPaymentCheckout({
        method: 'epayco',
        months: planDetails.months,
        totalAmount: planDetails.total,
        currency: 'USD',
        customerInfo,
      });

      if (result.success && result.checkoutUrl) {
        onSuccess(result);
        window.location.href = result.checkoutUrl;
      } else {
        const errorMessage = result.error || 'Error al procesar el pago con ePayco.';
        setError(errorMessage);
        onError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Error al conectar con ePayco. Por favor, intenta más tarde.';
      setError(errorMessage);
      onError(errorMessage);
      console.error('ePayco payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || externalLoading;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Pagar con ePayco
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Acepta tarjetas, efectivo y transferencias en toda Latinoamérica
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={customerInfo.name}
            onChange={handleInputChange('name')}
            disabled={isLoading}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Número de documento"
            placeholder="1234567890"
            value={customerInfo.documentNumber}
            onChange={handleInputChange('documentNumber')}
            disabled={isLoading}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            type="email"
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={customerInfo.email}
            onChange={handleInputChange('email')}
            disabled={isLoading}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Teléfono"
            placeholder="+57 300 123 4567"
            value={customerInfo.phone}
            onChange={handleInputChange('phone')}
            disabled={isLoading}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            py: 1.5,
            borderRadius: 2.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <LockIcon sx={{ mr: 1, fontSize: 18 }} />
              Pagar ${planDetails.total.toFixed(2)} USD con ePayco
            </>
          )}
        </Button>

        <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            💳 Pago seguro disponible en toda Latinoamérica
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
