'use client';

import React from 'react';
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
  { name: 'Binance Pay', iconPath: '/assets/icons/binance.svg', iconBg: '#E8E8E8', hoverBg: '#F3BA2F' },
  { name: 'Mastercard', iconPath: '/assets/icons/mastercard.svg', iconBg: '#E8E8E8', hoverBg: '#FFFFFF' },
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

  return (
    <Paper
      elevation={isPremium ? 8 : 0}
      sx={{
        p: 4,
        height: '100%',
        borderRadius: 6,
        bgcolor: isPremium
          ? alpha(theme.palette.primary.main, 0.02)
          : alpha(theme.palette.background.paper, 0.5),
        border: isPremium
          ? `2px solid ${theme.palette.primary.main}`
          : `1px solid ${theme.palette.divider}`,
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: isPremium
            ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`
            : `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
        },
      }}
    >
      {isPremium && (
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            right: 20,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.palette.primary.dark : 'primary.main',
            color: (theme) => theme.palette.mode === 'dark' ? theme.palette.common.white : 'white',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        >
          <StarIcon sx={{ fontSize: '1rem' }} />
          Recomendado
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            mb: 2,
            color: isPremium ? 'primary.main' : 'text.primary',
          }}
        >
          {title}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h2"
            fontWeight="800"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: isPremium ? 'primary.main' : 'text.primary',
            }}
          >
            {price}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {priceDescription}
        </Typography>
      </Box>

      <List sx={{ mb: 4 }}>
        {features.map((feature, index) => (
          <ListItem
            key={index}
            sx={{
              px: 0,
              py: 1,
              alignItems: 'flex-start',
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <feature.icon
                sx={{
                  fontSize: '1.5rem',
                  color: feature.highlight ? 'primary.main' : 'success.main',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={feature.text}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: feature.highlight ? 600 : 400,
                color: feature.highlight ? 'primary.main' : 'text.primary',
              }}
            />
          </ListItem>
        ))}
      </List>

      {showStoreButtons ? (
        <StoreButtons direction="column" fullWidth sx={{ mt: 2 }} />
      ) : (
        <Button
          variant={isPremium ? 'contained' : 'outlined'}
          size="large"
          fullWidth
          onClick={ctaAction}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'none',
            ...(isPremium && {
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
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

      {/* HERO SECTION */}
      <Box sx={{ pt: { xs: 20, md: 25 }, pb: 8, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 0.8,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  mb: 4,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                  }}
                >
                  Planes de servicio
                </Typography>
              </Box>

              <Typography
                variant="h1"
                fontWeight="800"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4.5rem' },
                  letterSpacing: '-0.03em',
                  mb: 4,
                  lineHeight: 1.1,
                }}
              >
                Elige el plan{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  perfecto para tí
                </Box>
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 800, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}
              >
                Accede a información financiera de calidad, sin importar tu presupuesto. Comienza
                gratis o desbloquea todo el potencial con Premium.
              </Typography>
            </Box>
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
                  background: (theme) => `linear-gradient(to right, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.default, 0.9)} 50%, transparent 100%)`,
                },
                '&::after': {
                  right: 0,
                  background: (theme) => `linear-gradient(to left, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.default, 0.9)} 50%, transparent 100%)`,
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
                {paymentMethods
                  .concat(paymentMethods)
                  .map((method, index) => (
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
              Cada amigo que se suscriba a Premium usando tu enlace o código, te regala un mes gratis completo gratis de Plan Premium.
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
                      <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
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
                          {step.highlight ? (
                            <step.icon sx={{ fontSize: '1.2rem' }} />
                          ) : (
                            index + 1
                          )}
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
                      <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 700 }}>
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
                          {step.highlight ? (
                            <step.icon sx={{ fontSize: '1.2rem' }} />
                          ) : (
                            index + 1
                          )}
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
                          <Typography variant="body2" color="text.secondary" sx={{ mb: step.chips ? 1 : 0 }}>
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
