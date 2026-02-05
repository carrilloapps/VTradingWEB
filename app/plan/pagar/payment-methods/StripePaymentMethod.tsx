/**
 * Stripe Payment Method Component
 * Full integration with Stripe Elements for card payments
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
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { PaymentMethodComponentProps, CustomerInfo } from './types';
import { createPaymentCheckout } from '@/app/actions/payment';

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
  const [phoneValue, setPhoneValue] = useState<string | undefined>('');
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

        <Grid size={{ xs: 12 }}>
          <Box>
            <Typography
              component="label"
              htmlFor="stripe-phone"
              variant="body2"
              sx={{
                display: 'block',
                mb: 0.5,
                fontWeight: 500,
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              Teléfono (opcional)
            </Typography>
            <Box
              sx={{
                '& .PhoneInput': {
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${alpha(theme.palette.divider, 0.23)}`,
                  borderRadius: '8px',
                  padding: '14px 14px',
                  backgroundColor: theme.palette.background.paper,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.text.primary,
                  },
                  '&:focus-within': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                    padding: '13px 13px',
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                },
                '& .PhoneInputInput': {
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  fontSize: '1rem',
                  backgroundColor: 'transparent',
                  color: theme.palette.text.primary,
                  fontFamily: theme.typography.fontFamily,
                  '&::placeholder': {
                    color: theme.palette.text.disabled,
                  },
                },
                '& .PhoneInputCountry': {
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                },
                '& .PhoneInputCountryIcon': {
                  width: '32px',
                  height: '24px',
                  marginRight: '8px',
                  borderRadius: '4px',
                  boxShadow: `0 1px 3px ${alpha('#000', 0.15)}`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                },
                '& .PhoneInputCountrySelect': {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  fontSize: '1rem',
                },
                '& .PhoneInputCountrySelectArrow': {
                  display: 'none',
                },
                '& .PhoneInputCountry::after': {
                  content: '"▼"',
                  fontSize: '10px',
                  color: theme.palette.text.secondary,
                  marginLeft: '4px',
                  pointerEvents: 'none',
                },
              }}
            >
              <PhoneInput
                id="stripe-phone"
                placeholder="Ingresa tu número de teléfono"
                value={phoneValue}
                onChange={(value) => {
                  setPhoneValue(value);
                  setCustomerInfo((prev) => ({ ...prev, phone: value || '' }));
                  setError(null);
                }}
                defaultCountry="US"
                disabled={isLoading}
                international
                countryCallingCodeEditable={false}
                aria-label="Número de teléfono con código de país (opcional)"
              />
            </Box>
          </Box>
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
