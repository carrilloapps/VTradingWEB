/**
 * Binance Pay Payment Method Component
 * Integration for cryptocurrency payments
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
  Card,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { PaymentMethodComponentProps, CustomerInfo } from './types';
import { createPaymentCheckout } from '@/app/actions/payment';
import { CryptoCurrency } from '@/lib/vtrading-types';

// Cryptocurrency options for Binance Pay
const cryptoOptions: { value: CryptoCurrency; label: string; stable: boolean }[] = [
  { value: 'USDT', label: 'Tether (USDT)', stable: true },
  { value: 'USDC', label: 'USD Coin (USDC)', stable: true },
  { value: 'BUSD', label: 'Binance USD (BUSD)', stable: true },
  { value: 'BTC', label: 'Bitcoin (BTC)', stable: false },
  { value: 'ETH', label: 'Ethereum (ETH)', stable: false },
  { value: 'BNB', label: 'BNB', stable: false },
];

/**
 * Binance Pay Form Component
 * Allows cryptocurrency selection and payment
 */
export default function BinancePayPaymentMethod({
  planDetails,
  onSuccess,
  onError,
  loading: externalLoading = false,
}: PaymentMethodComponentProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency>('USDT');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
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
        method: 'binance',
        months: planDetails.months,
        totalAmount: planDetails.total,
        currency: 'USD',
        customerInfo,
        cryptoCurrency: selectedCrypto,
      });

      if (result.success && result.checkoutUrl) {
        onSuccess(result);
        window.location.href = result.checkoutUrl;
      } else {
        const errorMessage = result.error || 'Error al procesar el pago con Binance Pay.';
        setError(errorMessage);
        onError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Error al conectar con Binance Pay. Por favor, intenta más tarde.';
      setError(errorMessage);
      onError(errorMessage);
      console.error('Binance Pay payment error:', err);
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
          Pagar con Binance Pay
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona tu criptomoneda preferida
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Cryptocurrency Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Selecciona la criptomoneda
        </Typography>
        <Grid container spacing={1.5}>
          {cryptoOptions.map((crypto) => (
            <Grid size={{ xs: 6, sm: 4 }} key={crypto.value}>
              <Card
                sx={{
                  cursor: 'pointer',
                  p: 1.5,
                  border: `1px solid ${
                    selectedCrypto === crypto.value
                      ? alpha('#F3BA2F', 0.4)
                      : alpha(theme.palette.divider, 0.15)
                  }`,
                  bgcolor: selectedCrypto === crypto.value ? alpha('#F3BA2F', 0.05) : 'transparent',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: alpha('#F3BA2F', 0.3),
                    bgcolor: alpha('#F3BA2F', 0.03),
                  },
                }}
                onClick={() => setSelectedCrypto(crypto.value)}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" fontWeight={700}>
                    {crypto.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    {crypto.label.replace(/\s*\(.*?\)\s*/g, '')}
                  </Typography>
                  {crypto.stable && (
                    <Chip
                      label="Stablecoin"
                      size="small"
                      sx={{
                        mt: 0.5,
                        height: 16,
                        fontSize: '0.6rem',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                      }}
                    />
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Customer Information */}
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
              Pagar ${planDetails.total.toFixed(2)} USD en {selectedCrypto}
            </>
          )}
        </Button>

        <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: alpha('#F3BA2F', 0.1) }}>
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            ₿ Pago instantáneo y seguro con criptomonedas
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
