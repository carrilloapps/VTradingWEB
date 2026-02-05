'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  useTheme,
  alpha,
  Stack,
  Fade,
  Zoom,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TimelineIcon from '@mui/icons-material/Timeline';
import ArticleIcon from '@mui/icons-material/Article';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { PaymentMethod } from '@/lib/vtrading-types';
import {
  StripePaymentMethod,
  PayPalPaymentMethod,
  BoldPaymentMethod,
  EPaycoPaymentMethod,
  BinancePayPaymentMethod,
  PaymentPlanDetails,
} from './payment-methods';

// Payment method icons and info
const paymentMethods = [
  {
    id: 'stripe' as PaymentMethod,
    name: 'Stripe',
    description: 'Tarjetas de crédito/débito',
    iconPath: '/assets/icons/stripe.svg',
    features: ['Visa', 'Mastercard', 'American Express'],
    color: '#635BFF',
    iconBg: '#FFFFFF',
  },
  {
    id: 'paypal' as PaymentMethod,
    name: 'PayPal',
    description: 'Paga con PayPal o tarjeta',
    iconPath: '/assets/icons/paypal.svg',
    features: ['PayPal', 'Tarjetas', 'Pago en 4'],
    color: '#0070BA',
    iconBg: '#FFFFFF',
    hidden: true, // Temporarily hidden
  },
  {
    id: 'bold' as PaymentMethod,
    name: 'Bold',
    description: 'Pagos Colombia (PSE, Nequi)',
    iconPath: '/assets/icons/bold.png',
    features: ['PSE', 'Nequi', 'Daviplata'],
    color: '#00D4FF',
    iconBg: '#FFFFFF',
  },
  {
    id: 'epayco' as PaymentMethod,
    name: 'ePayco',
    description: 'Pagos Latinoamérica',
    iconPath: '/assets/icons/epayco.png',
    features: ['Tarjetas', 'Efectivo', 'Transferencias'],
    color: '#0DC041',
    iconBg: '#FFFFFF',
    hidden: true, // Temporarily hidden
  },
  {
    id: 'binance' as PaymentMethod,
    name: 'Binance Pay',
    description: 'Paga con criptomonedas',
    iconPath: '/assets/icons/binance.svg',
    features: ['USDT', 'USDC', 'BTC', 'ETH', 'BNB'],
    color: '#F3BA2F',
    iconBg: '#F3BA2F',
  },
];

// Plan duration options with discounts
const planDurations = [
  { months: 1, discount: 0, label: '1 Mes', recommended: false },
  { months: 3, discount: 10, label: '3 Meses', recommended: false },
  { months: 6, discount: 15, label: '6 Meses', recommended: true },
  { months: 12, discount: 25, label: '12 Meses', recommended: false },
];

export default function PagarContent() {
  const theme = useTheme();
  const [selectedDuration, setSelectedDuration] = useState<number>(6);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = duration, 1 = payment method

  // Get price from environment variable
  const pricePerMonth = parseFloat(process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_USD || '1');

  // Calculate total with discount
  const planDetails = useMemo(() => {
    const duration = planDurations.find((d) => d.months === selectedDuration);
    if (!duration) return null;

    const subtotal = pricePerMonth * selectedDuration;
    const discountAmount = (subtotal * duration.discount) / 100;
    const total = subtotal - discountAmount;

    return {
      months: selectedDuration,
      pricePerMonth,
      subtotal,
      discount: duration.discount,
      discountAmount,
      total,
    } as PaymentPlanDetails;
  }, [selectedDuration, pricePerMonth]);

  // Update step cuando cambia la selección
  React.useEffect(() => {
    if (selectedDuration) setCurrentStep(1);
  }, [selectedDuration]);

  // Handle payment success
  const handlePaymentSuccess = () => {
    // Redirect will be handled by the individual payment component
  };

  // Handle payment error
  const handlePaymentError = (errorMessage: string) => {
    console.error('Payment error:', errorMessage);
    setLoading(false);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      {/* Progress Indicator */}
      <Fade in timeout={800}>
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 60, md: 70 },
            left: 0,
            right: 0,
            zIndex: 100,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ py: 2 }}>
              <Grid container spacing={2} alignItems="center">
                {[
                  { label: 'Duración', completed: currentStep >= 0 },
                  { label: 'Método de pago', completed: currentStep >= 1 },
                  { label: 'Confirmación', completed: false },
                ].map((step, index) => (
                  <Grid size={{ xs: 4 }} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: step.completed
                            ? theme.palette.primary.main
                            : alpha(theme.palette.divider, 0.15),
                          color: step.completed ? 'white' : 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          transition: 'all 0.3s',
                        }}
                      >
                        {step.completed ? '✓' : index + 1}
                      </Box>
                      <Typography
                        variant="caption"
                        fontWeight={step.completed ? 700 : 500}
                        color={step.completed ? 'primary.main' : 'text.secondary'}
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                      >
                        {step.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <LinearProgress
                variant="determinate"
                value={(currentStep / 2) * 100}
                sx={{
                  mt: 2,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.divider, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                    bgcolor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
          </Container>
        </Box>
      </Fade>

      {/* Hero Section mejorado */}
      <Box
        sx={{
          pt: { xs: 28, md: 32 },
          pb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              {/* Trust Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.5,
                  py: 1,
                  borderRadius: 50,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
                  mb: 3,
                }}
              >
                <LockIcon sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'success.main',
                    fontSize: '0.7rem',
                  }}
                >
                  Pago 100% Seguro · SSL 256-bit
                </Typography>
              </Box>

              {/* Título principal */}
              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  fontSize: { xs: '2.25rem', md: '4rem' },
                  letterSpacing: '-0.03em',
                  mb: 2.5,
                  lineHeight: 1.1,
                }}
              >
                Activa tu{' '}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Premium
                </Box>
              </Typography>

              {/* Subtítulo */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 550,
                  mx: 'auto',
                  fontSize: '1.1rem',
                  fontWeight: 400,
                  lineHeight: 1.7,
                }}
              >
                Completa tu orden en menos de 2 minutos y empieza a disfrutar todas las ventajas
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ pb: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Left Column: Steps */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={4}>
                {/* Step 1: Duration */}
                <Fade in timeout={1000}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4 },
                      borderRadius: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      bgcolor: alpha(theme.palette.background.paper, 0.6),
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                          1
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Elige la duración
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ahorra más al elegir períodos más largos
                        </Typography>
                      </Box>
                    </Box>

                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(Number(e.target.value))}
                      >
                        <Grid container spacing={2}>
                          {planDurations.map((duration, index) => {
                            const subtotal = pricePerMonth * duration.months;
                            const savings = subtotal * (duration.discount / 100);
                            const total = subtotal - savings;
                            const isSelected = selectedDuration === duration.months;

                            return (
                              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={duration.months}>
                                <Zoom in timeout={1200 + index * 100}>
                                  <Card
                                    sx={{
                                      position: 'relative',
                                      cursor: 'pointer',
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      border: `1px solid ${
                                        isSelected
                                          ? theme.palette.primary.main
                                          : alpha(theme.palette.divider, 0.15)
                                      }`,
                                      bgcolor: isSelected
                                        ? alpha(theme.palette.primary.main, 0.03)
                                        : 'transparent',
                                      borderRadius: 3,
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      overflow: 'visible',
                                      backdropFilter: 'blur(10px)',
                                      '&:hover': {
                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                        transform: 'translateY(-2px)',
                                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                                        boxShadow: isSelected
                                          ? `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`
                                          : `0 8px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                                      },
                                    }}
                                    onClick={() => setSelectedDuration(duration.months)}
                                  >
                                    {/* Badge Superior */}
                                    {duration.recommended && (
                                      <Box
                                        sx={{
                                          position: 'absolute',
                                          top: -8,
                                          left: '50%',
                                          transform: 'translateX(-50%)',
                                          bgcolor:
                                            theme.palette.mode === 'dark'
                                              ? theme.palette.primary.dark
                                              : 'primary.main',
                                          color: 'white',
                                          px: { xs: 1.2, lg: 0.8 },
                                          py: { xs: 0.3, lg: 0.25 },
                                          borderRadius: 1,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 0.3,
                                          fontWeight: 800,
                                          fontSize: { xs: '0.6rem', lg: '0.55rem' },
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.08em',
                                          boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.3)}`,
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        <StarIcon
                                          sx={{ fontSize: { xs: '0.75rem', lg: '0.7rem' } }}
                                        />
                                        Top
                                      </Box>
                                    )}

                                    <CardContent
                                      sx={{
                                        p: { xs: 2.5, lg: 1.5 },
                                        pb: { xs: 2, lg: 1.5 },
                                        textAlign: 'center',
                                      }}
                                    >
                                      <FormControlLabel
                                        value={duration.months}
                                        control={
                                          <Radio checked={isSelected} sx={{ display: 'none' }} />
                                        }
                                        label={
                                          <Box width="100%" sx={{ textAlign: 'center' }}>
                                            {/* Título */}
                                            <Typography
                                              variant="h6"
                                              fontWeight={700}
                                              sx={{
                                                mb: { xs: 0.8, lg: 0.5 },
                                                fontSize: { xs: '1.25rem', lg: '1.1rem' },
                                                color: isSelected ? 'primary.main' : 'text.primary',
                                              }}
                                            >
                                              {duration.label}
                                            </Typography>

                                            {/* Precio */}
                                            <Box sx={{ mb: { xs: 1, lg: 0.7 } }}>
                                              {duration.discount > 0 ? (
                                                <>
                                                  <Box
                                                    sx={{
                                                      display: 'flex',
                                                      alignItems: 'baseline',
                                                      justifyContent: 'center',
                                                      gap: { xs: 0.8, lg: 0.5 },
                                                      mb: { xs: 0.3, lg: 0.2 },
                                                      flexWrap: 'wrap',
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="h3"
                                                      fontWeight={800}
                                                      color={
                                                        isSelected ? 'primary.main' : 'text.primary'
                                                      }
                                                      sx={{
                                                        fontSize: { xs: '2rem', lg: '1.75rem' },
                                                        lineHeight: 1,
                                                      }}
                                                    >
                                                      ${total.toFixed(2)}
                                                    </Typography>
                                                    <Typography
                                                      variant="body2"
                                                      color="text.secondary"
                                                      sx={{
                                                        textDecoration: 'line-through',
                                                        fontWeight: 500,
                                                        fontSize: { xs: '1rem', lg: '0.875rem' },
                                                      }}
                                                    >
                                                      ${subtotal.toFixed(2)}
                                                    </Typography>
                                                  </Box>
                                                  <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    fontWeight={500}
                                                    sx={{
                                                      fontSize: { xs: '0.875rem', lg: '0.75rem' },
                                                      display: 'block',
                                                      textAlign: 'center',
                                                    }}
                                                  >
                                                    Total por {duration.months} meses
                                                  </Typography>
                                                </>
                                              ) : (
                                                <>
                                                  <Typography
                                                    variant="h3"
                                                    fontWeight={800}
                                                    color={
                                                      isSelected ? 'primary.main' : 'text.primary'
                                                    }
                                                    sx={{
                                                      fontSize: { xs: '2rem', lg: '1.75rem' },
                                                      lineHeight: 1,
                                                      mb: { xs: 0.3, lg: 0.2 },
                                                    }}
                                                  >
                                                    ${total.toFixed(2)}
                                                  </Typography>
                                                  <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    fontWeight={500}
                                                    sx={{
                                                      fontSize: { xs: '0.875rem', lg: '0.75rem' },
                                                      display: 'block',
                                                    }}
                                                  >
                                                    Total por {duration.months} mes
                                                  </Typography>
                                                </>
                                              )}
                                            </Box>

                                            {/* Ahorro */}
                                            {duration.discount > 0 && (
                                              <Box
                                                sx={{
                                                  display: 'flex',
                                                  justifyContent: 'center',
                                                  width: '100%',
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: { xs: 0.5, lg: 0.3 },
                                                    px: { xs: 1.5, lg: 1 },
                                                    py: { xs: 0.5, lg: 0.35 },
                                                    borderRadius: 1,
                                                    bgcolor: alpha(
                                                      theme.palette.success.main,
                                                      0.12
                                                    ),
                                                    border: `1px solid ${alpha(
                                                      theme.palette.success.main,
                                                      0.25
                                                    )}`,
                                                  }}
                                                >
                                                  <LocalOfferIcon
                                                    sx={{
                                                      fontSize: { xs: 14, lg: 12 },
                                                      color: 'success.main',
                                                    }}
                                                  />
                                                  <Typography
                                                    variant="caption"
                                                    fontWeight={700}
                                                    color="success.main"
                                                    sx={{
                                                      fontSize: { xs: '0.7rem', lg: '0.65rem' },
                                                    }}
                                                  >
                                                    {duration.discount}% OFF · ${savings.toFixed(2)}
                                                  </Typography>
                                                </Box>
                                              </Box>
                                            )}

                                            {/* Precio mensual */}
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                              sx={{
                                                display: 'block',
                                                mt: { xs: 1, lg: 0.6 },
                                                fontSize: { xs: '0.75rem', lg: '0.7rem' },
                                              }}
                                            >
                                              ${pricePerMonth.toFixed(2)} USD/mes
                                            </Typography>
                                          </Box>
                                        }
                                        sx={{
                                          width: '100%',
                                          m: 0,
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                      />
                                    </CardContent>

                                    {/* Indicador de Selección */}
                                    {isSelected && (
                                      <Box
                                        sx={{
                                          position: 'absolute',
                                          top: 10,
                                          right: 10,
                                          width: 20,
                                          height: 20,
                                          borderRadius: '50%',
                                          bgcolor: theme.palette.primary.main,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxShadow: `0 2px 6px ${alpha(
                                            theme.palette.primary.main,
                                            0.35
                                          )}`,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: 'white',
                                          }}
                                        />
                                      </Box>
                                    )}
                                  </Card>
                                </Zoom>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                </Fade>

                {/* Step 2: Payment Method */}
                <Fade in timeout={1200}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4 },
                      borderRadius: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      bgcolor: alpha(theme.palette.background.paper, 0.6),
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                          2
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Selecciona cómo pagar
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Elige tu método de pago preferido
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2}>
                      {paymentMethods.filter((m) => !m.hidden).map((method, index) => {
                        const isSelected = selectedMethod === method.id;
                        return (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={method.id}>
                            <Zoom in timeout={1400 + index * 100}>
                              <Card
                                sx={{
                                  cursor: 'pointer',
                                  height: '100%',
                                  border: `1px solid ${
                                    isSelected
                                      ? alpha(method.color, 0.4)
                                      : alpha(theme.palette.divider, 0.15)
                                  }`,
                                  bgcolor: isSelected ? alpha(method.color, 0.03) : 'transparent',
                                  borderRadius: 3,
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  backdropFilter: 'blur(10px)',
                                  position: 'relative',
                                  overflow: 'visible',
                                  '&:hover': {
                                    borderColor: alpha(method.color, 0.5),
                                    transform: 'translateY(-2px)',
                                    bgcolor: alpha(method.color, 0.02),
                                    boxShadow: `0 8px 20px ${alpha(method.color, 0.1)}`,
                                  },
                                }}
                                onClick={() => setSelectedMethod(method.id)}
                              >
                                <CardContent sx={{ textAlign: 'center', p: { xs: 2.5, lg: 2 } }}>
                                  <Box
                                    sx={{
                                      width: { xs: 48, lg: 44 },
                                      height: { xs: 48, lg: 44 },
                                      borderRadius: 2,
                                      bgcolor: method.iconBg,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      mx: 'auto',
                                      mb: 1.5,
                                      position: 'relative',
                                      transition: 'all 0.3s',
                                    }}
                                  >
                                    <Image
                                      src={method.iconPath}
                                      alt={method.name}
                                      width={32}
                                      height={32}
                                      style={{
                                        objectFit: 'contain',
                                        maxWidth: '80%',
                                        maxHeight: '80%',
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    gutterBottom
                                    sx={{
                                      fontSize: { xs: '1.1rem', lg: '1rem' },
                                      mb: 0.5,
                                    }}
                                  >
                                    {method.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      display: 'block',
                                      mb: 1.5,
                                      fontSize: { xs: '0.75rem', lg: '0.7rem' },
                                    }}
                                  >
                                    {method.description}
                                  </Typography>
                                  <Stack
                                    direction="row"
                                    spacing={0.5}
                                    justifyContent="center"
                                    flexWrap="wrap"
                                    sx={{ gap: 0.5 }}
                                  >
                                    {method.features.slice(0, 3).map((feature) => (
                                      <Chip
                                        key={feature}
                                        label={feature}
                                        size="small"
                                        sx={{
                                          fontSize: { xs: '0.65rem', lg: '0.6rem' },
                                          height: { xs: 22, lg: 20 },
                                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                                          color: theme.palette.text.secondary,
                                          fontWeight: 600,
                                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                          '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                                          },
                                        }}
                                      />
                                    ))}
                                  </Stack>
                                </CardContent>

                                {/* Indicador de Selección */}
                                {isSelected && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: 10,
                                      right: 10,
                                      width: 20,
                                      height: 20,
                                      borderRadius: '50%',
                                      bgcolor: method.color,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: `0 2px 6px ${alpha(method.color, 0.35)}`,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'white',
                                      }}
                                    />
                                  </Box>
                                )}
                              </Card>
                            </Zoom>
                          </Grid>
                        );
                      })}
                    </Grid>

                    {/* Payment Form for Selected Method */}
                    {selectedMethod && planDetails && (
                      <Fade in timeout={600}>
                        <Box sx={{ mt: 3 }}>
                          {selectedMethod === 'stripe' && (
                            <StripePaymentMethod
                              planDetails={planDetails}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                              loading={loading}
                            />
                          )}

                          {selectedMethod === 'paypal' && (
                            <PayPalPaymentMethod
                              planDetails={planDetails}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                              loading={loading}
                            />
                          )}

                          {selectedMethod === 'bold' && (
                            <BoldPaymentMethod
                              planDetails={planDetails}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                              loading={loading}
                            />
                          )}

                          {selectedMethod === 'epayco' && (
                            <EPaycoPaymentMethod
                              planDetails={planDetails}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                              loading={loading}
                            />
                          )}

                          {selectedMethod === 'binance' && (
                            <BinancePayPaymentMethod
                              planDetails={planDetails}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                              loading={loading}
                            />
                          )}
                        </Box>
                      </Fade>
                    )}
                  </Paper>
                </Fade>
              </Stack>
            </Grid>

            {/* Right Column: Summary mejorado */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Fade in timeout={1400}>
                <Box sx={{ position: 'sticky', top: { xs: 100, lg: 120 } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 5,
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(30px)',
                      boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.12)}`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      },
                    }}
                  >
                    {/* Header del resumen */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="overline"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          fontSize: '0.7rem',
                        }}
                      >
                        Tu Orden
                      </Typography>
                      <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }}>
                        Resumen de Pago
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {planDetails && (
                      <Stack spacing={3}>
                        {/* Plan seleccionado */}
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography variant="body1" fontWeight={700}>
                              VTrading Premium
                            </Typography>
                            <Chip
                              icon={<StarIcon sx={{ fontSize: 14 }} />}
                              label={`${planDetails.months} ${planDetails.months === 1 ? 'mes' : 'meses'}`}
                              size="small"
                              sx={{
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                              }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Acceso completo a todas las funciones premium
                          </Typography>
                        </Box>

                        {/* Desglose de precios */}
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Precio por mes
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              ${planDetails.pricePerMonth.toFixed(2)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Subtotal ({planDetails.months}{' '}
                              {planDetails.months === 1 ? 'mes' : 'meses'})
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              ${planDetails.subtotal.toFixed(2)}
                            </Typography>
                          </Box>

                          {planDetails.discount > 0 && (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.success.main, 0.08),
                                border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocalOfferIcon
                                  sx={{ fontSize: 16, color: 'success.main' }}
                                />
                                <Typography
                                  variant="body2"
                                  color="success.main"
                                  fontWeight={700}
                                >
                                  Descuento ({planDetails.discount}%)
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                color="success.main"
                                fontWeight={800}
                              >
                                -${planDetails.discountAmount.toFixed(2)}
                              </Typography>
                            </Box>
                          )}
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        {/* Total destacado */}
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                            border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              <Typography
                                variant="overline"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  color: 'text.secondary',
                                }}
                              >
                                Total a Pagar
                              </Typography>
                              <Typography variant="h3" fontWeight={900} color="primary.main">
                                ${planDetails.total.toFixed(2)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Pago único · Sin renovación automática
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Trust indicators */}
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                          }}
                        >
                          <Stack spacing={1.5}>
                            {[
                              { icon: SecurityIcon, text: 'Encriptación SSL 256-bit' },
                              { icon: LockIcon, text: 'Datos protegidos' },
                              { icon: VerifiedUserIcon, text: 'Sin cargos ocultos' },
                            ].map((item, index) => (
                              <Box
                                key={index}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                              >
                                <item.icon
                                  sx={{
                                    fontSize: 18,
                                    color: 'success.main',
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  fontWeight={600}
                                >
                                  {item.text}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      </Stack>
                    )}
                  </Paper>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
