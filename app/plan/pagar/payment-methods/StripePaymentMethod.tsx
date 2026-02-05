/**
 * Stripe Payment Method Component
 * Full integration with Stripe Elements for card payments
 */

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
import CountryPhoneInput, { ALL_COUNTRIES, Country } from './CountryPhoneInput';

// Lista de países para Stripe (US primero)
const STRIPE_COUNTRIES = ALL_COUNTRIES.filter((c) =>
  ['US', 'CO', 'MX', 'AR', 'CL', 'PE', 'EC', 'BR', 'ES', 'GB', 'CA'].includes(c.code)
);

/**
 * Stripe Payment Form Component
 * Handles customer information and initiates Stripe checkout
 */
export default function StripePaymentMethod({
  planDetails,
  onSuccess,
  onError,
  loading: externalLoading = false,
}: PaymentMethodComponentProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(STRIPE_COUNTRIES[0]); // US por defecto
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
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
        method: 'stripe',
        months: planDetails.months,
        totalAmount: planDetails.total,
        currency: 'USD',
        customerInfo,
      });

      if (result.success && result.checkoutUrl) {
        onSuccess(result);
        // Redirect to Stripe checkout
        window.location.href = result.checkoutUrl;
      } else {
        const errorMessage =
          result.error || 'Error al procesar el pago. Por favor, intenta de nuevo.';
        setError(errorMessage);
        onError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Error al conectar con Stripe. Por favor, intenta más tarde.';
      setError(errorMessage);
      onError(errorMessage);
      console.error('Stripe payment error:', err);
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
          Información de facturación
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completa tus datos para proceder con el pago seguro vía Stripe
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
            id="stripe-customer-name"
            name="name"
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={customerInfo.name}
            onChange={handleInputChange('name')}
            disabled={isLoading}
            variant="outlined"
            autoComplete="name"
            inputProps={{
              'aria-label': 'Nombre completo del cliente',
              'aria-required': 'true',
              minLength: 3,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            id="stripe-email"
            name="email"
            type="email"
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={customerInfo.email}
            onChange={handleInputChange('email')}
            disabled={isLoading}
            variant="outlined"
            autoComplete="email"
            inputProps={{
              'aria-label': 'Correo electrónico de contacto',
              'aria-required': 'true',
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        <CountryPhoneInput
          selectedCountry={selectedCountry}
          onCountryChange={(country) => {
            setSelectedCountry(country);
            const fullPhone = phoneNumber ? `${country.dial}${phoneNumber}` : '';
            setCustomerInfo((prev) => ({ ...prev, phone: fullPhone }));
          }}
          phoneNumber={phoneNumber}
          onPhoneChange={(value) => {
            setPhoneNumber(value);
            const fullPhone = value ? `${selectedCountry.dial}${value}` : '';
            setCustomerInfo((prev) => ({ ...prev, phone: fullPhone }));
            setError(null);
          }}
          disabled={isLoading}
          required={false}
          inputId="stripe-phone"
          placeholder="123 456 7890"
          label="Teléfono (opcional)"
          countries={STRIPE_COUNTRIES}
        />
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
              boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              background: theme.palette.action.disabledBackground,
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <LockIcon sx={{ mr: 1, fontSize: 18 }} />
              Pagar ${planDetails.total.toFixed(2)} USD con Stripe
            </>
          )}
        </Button>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            textAlign="center"
          >
            <LockIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Pago procesado de forma segura por{' '}
            <Box component="span" fontWeight={700} color="primary.main" sx={{ ml: 0.5 }}>
              Stripe
            </Box>
            <Box component="span" sx={{ width: '100%', display: 'block', mt: 0.5 }}>
              Aceptamos Visa, Mastercard y American Express
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
