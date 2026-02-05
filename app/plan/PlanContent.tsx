'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  alpha,
  Paper,
  Button,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Slide,
  Grow,
  Collapse,
  IconButton,
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StoreButtons from '@/components/StoreButtons';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import CalculateIcon from '@mui/icons-material/Calculate';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ShareIcon from '@mui/icons-material/Share';
import DevicesIcon from '@mui/icons-material/Devices';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SettingsIcon from '@mui/icons-material/Settings';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

interface PlanFeature {
  text: string;
  icon: React.ElementType;
  highlight?: boolean;
}

// Payment method logos data
const paymentMethods = [
  { name: 'Stripe', iconPath: '/assets/icons/stripe.svg', iconBg: '#E8E8E8', hoverBg: '#FFFFFF' },
  { name: 'PayPal', iconPath: '/assets/icons/paypal.svg', iconBg: '#E8E8E8', hoverBg: '#FFFFFF' },
  { name: 'Bold', iconPath: '/assets/icons/bold.png', iconBg: '#E8E8E8', hoverBg: '#FFFFFF' },
  { name: 'ePayco', iconPath: '/assets/icons/epayco.png', iconBg: '#E8E8E8', hoverBg: '#FFFFFF' },
  {
    name: 'Binance Pay',
    iconPath: '/assets/icons/binance.svg',
    iconBg: '#E8E8E8',
    hoverBg: '#F3BA2F',
  },
  {
    name: 'Mastercard',
    iconPath: '/assets/icons/mastercard.svg',
    iconBg: '#E8E8E8',
    hoverBg: '#FFFFFF',
  },
  { name: 'Visa', iconPath: '/assets/icons/visa.svg', iconBg: '#E8E8E8', hoverBg: '#FFFFFF' },
];

interface PlanCardProps {
  title: string;
  price: string;
  priceDescription: string;
  features: PlanFeature[];
  isPremium?: boolean;
  ctaText?: string;
  ctaAction?: () => void;
  showStoreButtons?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  price,
  priceDescription,
  features,
  isPremium = false,
  ctaText,
  ctaAction,
  showStoreButtons = false,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Paper
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        p: { xs: 2.5, md: 3 },
        height: '100%',
        borderRadius: 4,
        bgcolor: isPremium
          ? alpha(theme.palette.primary.main, 0.04)
          : alpha(theme.palette.background.paper, 0.6),
        border: isPremium
          ? `2px solid ${theme.palette.primary.main}`
          : `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        '&::before': isPremium
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }
          : {},
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: isPremium
            ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.25)}`
            : `0 20px 40px ${alpha(theme.palette.common.black, 0.12)}`,
          borderColor: isPremium ? theme.palette.primary.light : alpha(theme.palette.divider, 0.3),
        },
      }}
    >
      {/* Recommended badge compacto */}
      {isPremium && (
        <Chip
          icon={<StarIcon sx={{ fontSize: '0.9rem' }} />}
          label="Recomendado"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : 'primary.main',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.7rem',
            height: 24,
            '& .MuiChip-icon': {
              color: 'white',
            },
          }}
        />
      )}

      {/* Header compacto */}
      <Box sx={{ textAlign: 'center', mb: 2, pt: isPremium ? 1.5 : 0 }}>
        <Typography
          variant="h5"
          fontWeight="800"
          sx={{
            mb: 1.5,
            fontSize: { xs: '1.5rem', md: '1.65rem' },
            color: isPremium ? 'primary.main' : 'text.primary',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </Typography>

        {/* Precio más compacto */}
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
          <Typography
            variant="h2"
            fontWeight="900"
            sx={{
              fontSize: { xs: '2.25rem', md: '2.75rem' },
              lineHeight: 1,
              background: isPremium
                ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                : theme.palette.text.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transition: 'transform 0.3s',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {price}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          {priceDescription}
        </Typography>
      </Box>

      {/* Features en grid compacto de 2 columnas */}
      <Box
        sx={{
          mb: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr' },
          gap: 1,
          flex: 1,
        }}
      >
        {features.map((feature, index) => (
          <Grow
            key={index}
            in
            timeout={800 + index * 80}
            style={{ transformOrigin: '0 0 0' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.25,
                p: 1,
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                },
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  minWidth: 28,
                  borderRadius: '50%',
                  bgcolor: feature.highlight
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.success.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 0.2,
                }}
              >
                <feature.icon
                  sx={{
                    fontSize: '1.1rem',
                    color: feature.highlight ? 'primary.main' : 'success.main',
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: feature.highlight ? 600 : 500,
                  color: feature.highlight ? 'primary.main' : 'text.primary',
                  lineHeight: 1.5,
                  fontSize: '0.875rem',
                }}
              >
                {feature.text}
              </Typography>
            </Box>
          </Grow>
        ))}
      </Box>

      {/* CTA Button compacto */}
      {showStoreButtons ? (
        <Box sx={{ mt: 'auto' }}>
          <StoreButtons direction="column" fullWidth sx={{ gap: 1 }} />
        </Box>
      ) : (
        <Button
          variant={isPremium ? 'contained' : 'outlined'}
          size="large"
          fullWidth
          onClick={ctaAction}
          sx={{
            py: 1.5,
            borderRadius: 2.5,
            fontWeight: 800,
            fontSize: '0.95rem',
            textTransform: 'none',
            letterSpacing: '0.02em',
            mt: 'auto',
            ...(isPremium && {
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.45)}`,
                transform: 'translateY(-2px)',
              },
            }),
            ...(!isPremium && {
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }),
          }}
        >
          {ctaText}
        </Button>
      )}
    </Paper>
  );
};

export default function PlanContent() {
  const theme = useTheme();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Get price from environment variable
  const pricePerMonth = parseFloat(process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_USD || '1');

  const freePlanFeatures: PlanFeature[] = [
    {
      text: 'Acceso completo a la aplicación móvil',
      icon: DevicesIcon,
    },
    {
      text: 'Hasta 5 alertas personalizables (solo divisas)',
      icon: NotificationsActiveIcon,
    },
    {
      text: 'Anuncios en la aplicación',
      icon: AdsClickIcon,
      highlight: true,
    },
    {
      text: 'Calculadora profesional con 2 divisas',
      icon: CalculateIcon,
    },
    {
      text: 'Código de referido: 1 mes premium por cada referido premium',
      icon: GroupAddIcon,
    },
  ];

  const premiumPlanFeatures: PlanFeature[] = [
    {
      text: 'Acceso completo a la app y plataforma web',
      icon: DevicesIcon,
    },
    {
      text: 'Alertas ilimitadas sobre todos los activos',
      icon: AllInclusiveIcon,
      highlight: true,
    },
    {
      text: 'Experiencia sin anuncios',
      icon: CheckCircleIcon,
      highlight: true,
    },
    {
      text: 'Divisas ilimitadas en calculadora profesional',
      icon: CalculateIcon,
    },
    {
      text: 'Personalización completa de widgets',
      icon: WidgetsIcon,
    },
    {
      text: 'Personalización de imágenes para compartir',
      icon: ShareIcon,
    },
    {
      text: 'Código de referido: 1 mes premium por cada referido premium',
      icon: GroupAddIcon,
    },
  ];

  const handlePremiumPlanAction = () => {
    // Redirigir a la página de pago
    window.location.href = '/plan/pagar';
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      {/* HERO SECTION CON STATS */}
      <Box sx={{ pt: { xs: 20, md: 25 }, pb: 4, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              {/* Badge superior */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 3,
                  py: 1,
                  borderRadius: 50,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  mb: 4,
                }}
              >
                <VerifiedUserIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'primary.main',
                    fontSize: '0.7rem',
                  }}
                >
                  Planes de inversión
                </Typography>
              </Box>

              {/* Título principal mejorado */}
              <Typography
                variant="h1"
                fontWeight="900"
                sx={{
                  fontSize: { xs: '2.75rem', md: '5rem' },
                  letterSpacing: '-0.04em',
                  mb: 3,
                  lineHeight: 1.05,
                }}
              >
                Invierte{' '}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  mejor
                </Box>
                ,{' '}
                <br />
                paga solo lo que necesites
              </Typography>

              {/* Subtítulo */}
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: 750,
                  mx: 'auto',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  fontSize: { xs: '1rem', md: '1.15rem' },
                }}
              >
                Información financiera profesional desde ${pricePerMonth}/mes. Sin contratos, sin
                comisiones ocultas. Cancela cuando quieras.
              </Typography>
            </Box>
          </Fade>

          {/* Stats Row - Trust Indicators */}
          <Fade in timeout={1400}>
            <Grid
              container
              spacing={3}
              sx={{ mt: 6, mb: 2, justifyContent: 'center', maxWidth: 900, mx: 'auto' }}
            >
              {[
                { icon: TrendingUpIcon, value: '50K+', label: 'Usuarios activos' },
                { icon: SecurityIcon, value: '256-bit', label: 'Encriptación SSL' },
                { icon: SpeedIcon, value: '<100ms', label: 'Datos en tiempo real' },
                { icon: StarIcon, value: '4.8/5', label: 'Calificación app' },
              ].map((stat, index) => (
                <Grid size={{ xs: 6, sm: 3 }} key={index}>
                  <Grow in timeout={1600 + index * 100}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        textAlign: 'center',
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.background.paper, 0.6),
                        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      <stat.icon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                      <Typography
                        variant="h6"
                        fontWeight="800"
                        sx={{ mb: 0.5, fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                      >
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Fade>
        </Container>
      </Box>

      {/* PRICING CARDS */}
      <Box sx={{ pb: 15 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {/* Plan Free */}
            <Grid size={{ xs: 12, md: 6, lg: 5 }}>
              <PlanCard
                title="Plan Free"
                price="Gratis"
                priceDescription="Para siempre"
                features={freePlanFeatures}
                showStoreButtons
              />
            </Grid>

            {/* Plan Premium */}
            <Grid size={{ xs: 12, md: 6, lg: 5 }}>
              <PlanCard
                title="Plan Premium"
                price={`$ ${pricePerMonth.toFixed(2)}`}
                priceDescription="Por mes"
                features={premiumPlanFeatures}
                isPremium
                ctaText="Obtener Premium"
                ctaAction={handlePremiumPlanAction}
              />
            </Grid>
          </Grid>

          {/* Payment Methods Section - Infinite Carousel */}
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 4, color: 'text.secondary' }}>
              Métodos de pago aceptados
            </Typography>
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                py: 3,
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: { xs: '60px', md: '120px' },
                  zIndex: 2,
                  pointerEvents: 'none',
                },
                '&::before': {
                  left: 0,
                  background: (theme) =>
                    `linear-gradient(to right, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.default, 0.9)} 50%, transparent 100%)`,
                },
                '&::after': {
                  right: 0,
                  background: (theme) =>
                    `linear-gradient(to left, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.default, 0.9)} 50%, transparent 100%)`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  animation: 'scroll 25s linear infinite',
                  '&:hover': {
                    animationPlayState: 'paused',
                  },
                  '@keyframes scroll': {
                    '0%': {
                      transform: 'translateX(0)',
                    },
                    '100%': {
                      transform: 'translateX(-50%)',
                    },
                  },
                }}
              >
                {/* Duplicamos el array para el efecto de loop infinito */}
                {paymentMethods.concat(paymentMethods).map((method, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: '0 0 auto',
                      width: { xs: '70px', md: '80px' },
                      height: { xs: '70px', md: '80px' },
                      borderRadius: 2.5,
                      bgcolor: method.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
                      '& img': {
                        filter: 'grayscale(1)',
                        transition: 'filter 0.3s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.08)',
                        boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.15)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        bgcolor: method.hoverBg,
                        '& img': {
                          filter: 'grayscale(0)',
                        },
                      },
                    }}
                  >
                    <Image
                      src={method.iconPath}
                      alt={method.name}
                      width={56}
                      height={56}
                      style={{
                        objectFit: 'contain',
                        maxWidth: '80%',
                        maxHeight: '80%',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Referral Program Section - Full Width */}
      <Box
        sx={{
          py: 15,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.03)
              : alpha(theme.palette.primary.main, 0.02),
          borderTop: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2.5,
                py: 1,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.success.main, 0.08),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                mb: 3,
              }}
            >
              <CardGiftcardIcon sx={{ fontSize: '1.3rem', color: 'success.main' }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'success.main',
                  fontSize: '0.7rem',
                }}
              >
                Programa de Referidos
              </Typography>
            </Box>

            <Typography
              variant="h2"
              fontWeight="800"
              sx={{
                fontSize: { xs: '2.2rem', md: '3.5rem' },
                letterSpacing: '-0.03em',
                mb: 3,
                lineHeight: 1.1,
              }}
            >
              Gana meses{' '}
              <Box component="span" sx={{ color: 'success.main' }}>
                Premium gratis
              </Box>
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400, lineHeight: 1.7, mb: 2 }}
            >
              Cada amigo que se suscriba a Premium usando tu enlace o código, te regala un mes
              gratis completo gratis de Plan Premium.
            </Typography>
            <Typography
              variant="body1"
              sx={{ maxWidth: 600, mx: 'auto', fontWeight: 600, color: 'success.main' }}
            >
              Sin límites. Acumula todos los meses que quieras.
            </Typography>
          </Box>

          {/* How it Works */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{ mb: 6, textAlign: 'center', letterSpacing: '-0.02em' }}
            >
              ¿Cómo funciona?
            </Typography>

            <Grid container spacing={4}>
              {/* Opción 1 */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 5,
                    bgcolor: 'background.paper',
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 16px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ShareIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: 'primary.main', fontWeight: 700 }}
                      >
                        Opción 1
                      </Typography>
                      <Typography variant="h5" fontWeight="700">
                        Compartir enlace
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ pl: 2 }}>
                    {[
                      {
                        title: 'Ve a tus ajustes',
                        desc: 'Busca el botón "Referir a un amigo"',
                        icon: SettingsIcon,
                      },
                      {
                        title: 'Comparte tu enlace',
                        desc: 'En redes sociales o apps de mensajería',
                        icon: LinkIcon,
                      },
                      {
                        title: 'Tu amigo se registra',
                        desc: 'Usando tu enlace único y se suscribe a Premium',
                        icon: PersonAddIcon,
                      },
                      {
                        title: '¡Listo!',
                        desc: 'Recibes 1 mes Premium gratis automáticamente',
                        icon: CardGiftcardIcon,
                        highlight: true,
                      },
                    ].map((step, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          mb: index < 3 ? 3 : 0,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: step.highlight
                              ? alpha(theme.palette.success.main, 0.1)
                              : alpha(theme.palette.primary.main, 0.08),
                            color: step.highlight ? 'success.main' : 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                          }}
                        >
                          {step.highlight ? <step.icon sx={{ fontSize: '1.2rem' }} /> : index + 1}
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{
                              mb: 0.5,
                              color: step.highlight ? 'success.main' : 'text.primary',
                            }}
                          >
                            {step.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {step.desc}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Opción 2 */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 5,
                    bgcolor: 'background.paper',
                    border: `2px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 16px 32px ${alpha(theme.palette.secondary.main, 0.12)}`,
                      borderColor: alpha(theme.palette.secondary.main, 0.3),
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PersonAddIcon sx={{ color: 'secondary.main', fontSize: '2rem' }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Opción 2
                      </Typography>
                      <Typography variant="h5" fontWeight="700">
                        Código al registrarse
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ pl: 2 }}>
                    {[
                      {
                        title: 'Tu amigo se registra',
                        desc: 'Crea su cuenta en VTrading normalmente',
                        icon: PersonAddIcon,
                      },
                      {
                        title: 'Ingresa tu código o email',
                        desc: 'Durante el proceso de registro',
                        icon: EmailIcon,
                        chips: true,
                      },
                      {
                        title: 'Se suscribe a Premium',
                        desc: 'La conexión se establece automáticamente',
                        icon: StarIcon,
                      },
                      {
                        title: '¡Listo!',
                        desc: 'Tú recibes 1 mes Premium gratis',
                        icon: CardGiftcardIcon,
                        highlight: true,
                      },
                    ].map((step, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          mb: index < 3 ? 3 : 0,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: step.highlight
                              ? alpha(theme.palette.success.main, 0.1)
                              : alpha(theme.palette.secondary.main, 0.08),
                            color: step.highlight ? 'success.main' : 'secondary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                          }}
                        >
                          {step.highlight ? <step.icon sx={{ fontSize: '1.2rem' }} /> : index + 1}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{
                              mb: 0.5,
                              color: step.highlight ? 'success.main' : 'text.primary',
                            }}
                          >
                            {step.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: step.chips ? 1 : 0 }}
                          >
                            {step.desc}
                          </Typography>
                          {step.chips && (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip
                                icon={<LinkIcon sx={{ fontSize: '0.9rem' }} />}
                                label="Código"
                                size="small"
                                sx={{ fontSize: '0.75rem', height: 24 }}
                              />
                              <Chip
                                icon={<EmailIcon sx={{ fontSize: '0.9rem' }} />}
                                label="Email"
                                size="small"
                                sx={{ fontSize: '0.75rem', height: 24 }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Final CTA */}
          <Box
            sx={{
              textAlign: 'center',
              p: 5,
              borderRadius: 5,
              bgcolor: alpha(theme.palette.success.main, 0.08),
              border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <AllInclusiveIcon sx={{ fontSize: '3rem', color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="700" sx={{ mb: 2, color: 'success.main' }}>
              Sin límites de referidos
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 650, mx: 'auto', lineHeight: 1.8 }}
            >
              Cada referido que se suscriba a Premium te otorga{' '}
              <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                1 mes adicional completamente gratis
              </Box>
              . Invita a todos tus amigos y disfruta VTrading Premium por mucho más tiempo.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
