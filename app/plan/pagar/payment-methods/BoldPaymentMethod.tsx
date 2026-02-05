/**
 * Bold Payment Method Component (Colombia)
 * Integration for PSE, Nequi, Daviplata
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  useTheme,
  alpha,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { PaymentMethodComponentProps, CustomerInfo } from './types';
import { createPaymentCheckout } from '@/app/actions/payment';
import CountryPhoneInput, { ALL_COUNTRIES } from './CountryPhoneInput';

/**
 * Bold Payment Form Component
 * Specific for Colombian payment methods
 */
export default function BoldPaymentMethod({
  planDetails,
  onSuccess,
  onError,
  loading: externalLoading = false,
}: PaymentMethodComponentProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(ALL_COUNTRIES[0]); // Colombia por defecto
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    documentType: 'CC',
    documentNumber: '',
  });

  const formatDocumentNumber = (value: string): string => {
    // Remover todo excepto letras y números
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');

    // Separar letra inicial (si existe) y números
    const match = cleaned.match(/^([a-zA-Z])?([0-9]*)$/);
    if (!match) return value;

    const [, letter, numbers] = match;

    // Formatear números con puntos de miles
    const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retornar con formato apropiado
    return letter ? `${letter.toUpperCase()}-${formatted}` : formatted;
  };

  const handleInputChange =
    (field: keyof CustomerInfo) =>
      (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
      ) => {
        const value = event.target.value;

        // Formatear automáticamente el documento
        if (field === 'documentNumber') {
          const formatted = formatDocumentNumber(value);
          setCustomerInfo((prev) => ({
            ...prev,
            [field]: formatted,
          }));
        } else {
          setCustomerInfo((prev) => ({
            ...prev,
            [field]: value,
          }));
        }
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

    if (!customerInfo.documentNumber || customerInfo.documentNumber.length < 6) {
      setError('Por favor ingresa un número de documento válido');
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
        method: 'bold',
        months: planDetails.months,
        totalAmount: planDetails.total,
        currency: 'USD',
        customerInfo,
      });

      if (result.success && result.checkoutUrl) {
        onSuccess(result);
        window.location.href = result.checkoutUrl;
      } else {
        const errorMessage = result.error || 'Error al procesar el pago con Bold.';
        setError(errorMessage);
        onError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Error al conectar con Bold. Por favor, intenta más tarde.';
      setError(errorMessage);
      onError(errorMessage);
      console.error('Bold payment error:', err);
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
          Pagar con Bold
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Acepta PSE, Nequi, Daviplata y otros métodos colombianos
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
            id="bold-customer-name"
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required>
            <InputLabel id="bold-document-type-label">Tipo de documento</InputLabel>
            <Select
              labelId="bold-document-type-label"
              id="bold-document-type"
              value={customerInfo.documentType}
              onChange={handleInputChange('documentType')}
              disabled={isLoading}
              label="Tipo de documento"
              inputProps={{
                'aria-label': 'Tipo de documento de identificación',
                'aria-required': 'true',
              }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
              <MenuItem value="CE">Cédula de Extranjería</MenuItem>
              <MenuItem value="VEN">Cédula Venezolana</MenuItem>
              <MenuItem value="NIT">NIT</MenuItem>
              <MenuItem value="Passport">Pasaporte</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            id="bold-document-number"
            name="documentNumber"
            label="Número de documento"
            placeholder="Ej: 1.234.567 o V-1.234.567"
            value={customerInfo.documentNumber}
            onChange={handleInputChange('documentNumber')}
            disabled={isLoading}
            variant="outlined"
            inputProps={{
              'aria-label': 'Número de documento de identificación (se formateará automáticamente)',
              'aria-required': 'true',
              minLength: 6,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            id="bold-email"
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
          required
          inputId="bold-phone"
          placeholder="300 123 4567"
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
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <LockIcon sx={{ mr: 1, fontSize: 18 }} />
              Pagar ${planDetails.total.toFixed(2)} USD con Bold
            </>
          )}
        </Button>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <PublicIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Pago seguro con PSE, Nequi o Daviplata
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
