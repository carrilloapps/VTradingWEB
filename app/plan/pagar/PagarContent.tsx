'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PaymentMethod, PaymentRequest } from '@/lib/vtrading-types';
import { createPaymentCheckout } from '@/app/actions/payment';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Icons
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Plan durations with discounts
const planDurations = [
  { months: 1, discount: 0 },
  { months: 3, discount: 10 },
  { months: 6, discount: 15, recommended: true },
  { months: 12, discount: 25 },
];

// Payment methods configuration
const paymentMethods: Array<{
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactElement;
  features: string[];
  region: string;
}> = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Tarjetas de crédito/débito internacionales',
    icon: <CreditCardIcon />,
    features: ['Visa, Mastercard, Amex', 'Pago seguro instantáneo', 'Disponible globalmente'],
    region: 'Internacional',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Paga con tu cuenta PayPal',
    icon: <AccountBalanceIcon />,
    features: ['Pago rápido y seguro', 'Sin compartir datos bancarios', 'Protección al comprador'],
    region: 'Internacional',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'PSE, Nequi, Daviplata, tarjetas',
    icon: <LocalAtmIcon />,
    features: ['PSE y transferencias', 'Nequi y Daviplata', 'Tarjetas locales'],
    region: 'Colombia',
  },
  {
    id: 'epayco',
    name: 'ePayco',
    description: 'Múltiples métodos de pago en Latinoamérica',
    icon: <CreditCardIcon />,
    features: ['Tarjetas y efectivo', 'Transferencias bancarias', 'Puntos de pago físicos'],
    region: 'Latinoamérica',
  },
  {
    id: 'binance',
    name: 'Binance Pay',
    description: 'Paga con criptomonedas',
    icon: <CurrencyBitcoinIcon />,
    features: ['USDT, BTC, BNB, ETH', 'Sin comisiones', 'Confirmación instantánea'],
    region: 'Global',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PagarContent() {
  const theme = useTheme();
  const router = useRouter();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(6); // Default 6 months (recommended)
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Get base price from environment
  const basePriceUSD = parseFloat(process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_USD || '1.00');

  // Calculate prices
  const selectedPlan = useMemo(
    () => planDurations.find((p) => p.months === selectedDuration)!,
    [selectedDuration]
  );

  const subtotal = useMemo(() => basePriceUSD * selectedDuration, [basePriceUSD, selectedDuration]);

  const discountAmount = useMemo(
    () => (subtotal * selectedPlan.discount) / 100,
    [subtotal, selectedPlan.discount]
  );

  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  const pricePerMonth = useMemo(() => total / selectedDuration, [total, selectedDuration]);

  // Handle payment
  const handlePayment = async () => {
    setError(null);
    setLoading(true);

    try {
      const selectedMethod = paymentMethods[selectedMethodIndex];

      const paymentRequest: PaymentRequest = {
        method: selectedMethod.id,
        months: selectedDuration,
        totalAmount: total,
        currency: 'USD',
        email: user?.email || '',
        userId: user?.uid,
        customerInfo: {
          name: user?.displayName || 'Usuario',
          email: user?.email || '',
        },
      };

      const response = await createPaymentCheckout(paymentRequest);

      if (response.success && response.checkoutUrl) {
        // Redirect to payment gateway
        window.location.href = response.checkoutUrl;
      } else {
        setError(response.error || 'Error al procesar el pago. Por favor, intenta de nuevo.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Error inesperado al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          pt: { xs: 10, md: 12 },
          pb: 8,
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`
              : `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.02)}, transparent)`,
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Completa tu Suscripción
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Elige la duración de tu plan y el método de pago preferido
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Left Column - Payment Details */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                {/* Duration Selection */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  1. Selecciona la duración
                </Typography>
                <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
                  <RadioGroup
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  >
                    {planDurations.map((plan) => (
                      <Card
                        key={plan.months}
                        sx={{
                          mb: 2,
                          cursor: 'pointer',
                          border: `2px solid ${
                            selectedDuration === plan.months
                              ? theme.palette.primary.main
                              : alpha(theme.palette.divider, 0.1)
                          }`,
                          transition: 'all 0.2s',
                          position: 'relative',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
                          },
                        }}
                        onClick={() => setSelectedDuration(plan.months)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormControlLabel
                              value={plan.months}
                              control={<Radio />}
                              label=""
                              sx={{ m: 0 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {plan.months} {plan.months === 1 ? 'Mes' : 'Meses'}
                                </Typography>
                                {plan.recommended && (
                                  <Chip
                                    label="Recomendado"
                                    size="small"
                                    color="primary"
                                    sx={{ height: 20 }}
                                  />
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {plan.discount > 0
                                  ? `${plan.discount}% de descuento`
                                  : 'Sin descuento'}
                              </Typography>
                            </Box>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                              $
                              {((basePriceUSD * plan.months * (100 - plan.discount)) / 100).toFixed(
                                2
                              )}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </FormControl>

                <Divider sx={{ my: 4 }} />

                {/* Payment Method Selection */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  2. Selecciona el método de pago
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                  <Tabs
                    value={selectedMethodIndex}
                    onChange={(_, newValue) => setSelectedMethodIndex(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {paymentMethods.map((method, index) => (
                      <Tab
                        key={method.id}
                        label={method.name}
                        id={`payment-tab-${index}`}
                        aria-controls={`payment-tabpanel-${index}`}
                        icon={method.icon}
                        iconPosition="start"
                      />
                    ))}
                  </Tabs>
                </Box>

                {paymentMethods.map((method, index) => (
                  <TabPanel key={method.id} value={selectedMethodIndex} index={index}>
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {method.name}
                        </Typography>
                        <Chip label={method.region} size="small" variant="outlined" />
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {method.description}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        {method.features.map((feature, idx) => (
                          <Box
                            key={idx}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                          >
                            <CheckCircleIcon
                              sx={{ fontSize: 18, color: theme.palette.success.main }}
                            />
                            <Typography variant="body2">{feature}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </TabPanel>
                ))}

                {/* Error Alert */}
                {error && (
                  <Alert severity="error" sx={{ mt: 3 }} onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  position: { md: 'sticky' },
                  top: { md: 100 },
                  background:
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.8)
                      : theme.palette.background.paper,
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Resumen del Pedido
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Plan Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Plan seleccionado
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Plan Premium - {selectedDuration} {selectedDuration === 1 ? 'Mes' : 'Meses'}
                  </Typography>
                  {selectedPlan.recommended && (
                    <Chip
                      label="¡Mejor oferta!"
                      size="small"
                      color="success"
                      sx={{ mt: 1, height: 20 }}
                    />
                  )}
                </Box>

                {/* Price Breakdown */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Subtotal ({selectedDuration} {selectedDuration === 1 ? 'mes' : 'meses'})
                    </Typography>
                    <Typography variant="body2">${subtotal.toFixed(2)} USD</Typography>
                  </Box>

                  {selectedPlan.discount > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="success.main">
                        Descuento ({selectedPlan.discount}%)
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        -${discountAmount.toFixed(2)} USD
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                    ${total.toFixed(2)} USD
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 3 }}
                >
                  Equivale a ${pricePerMonth.toFixed(2)} USD/mes
                </Typography>

                {/* Payment Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handlePayment}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Pagar con ${paymentMethods[selectedMethodIndex].name}`
                  )}
                </Button>

                {/* Security Notice */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', textAlign: 'center' }}
                  >
                    🔒 Pago 100% seguro y encriptado
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
