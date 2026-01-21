'use client';

import React, { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  useTheme, 
  alpha, 
  Paper,
  Fade,
  Grow
} from '@mui/material';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import MarketTicker from '@/components/MarketTicker';
import Footer from '@/components/Footer';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import LanguageIcon from '@mui/icons-material/Language';
import TerminalIcon from '@mui/icons-material/Terminal';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';

// Componente reutilizable para Feature Cards
const FeatureCard = ({ icon: Icon, title, description, color, xs = 12, sm = 6, md = 4 }: any) => {
  const theme = useTheme();
  return (
    <Grid size={{ xs, sm, md }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          height: '100%',
          borderRadius: 6,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: alpha(color || theme.palette.primary.main, 0.5),
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${alpha(color || theme.palette.primary.main, 0.08)}`,
            '& .feature-icon': {
              transform: 'scale(1.1)',
              color: color
            }
          }
        }}
      >
        <Box 
          className="feature-icon"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: 64, 
            height: 64, 
            borderRadius: 4, 
            bgcolor: alpha(color || theme.palette.primary.main, 0.1), 
            color: color || theme.palette.primary.main,
            mb: 3,
            transition: 'all 0.3s ease'
          }}
        >
          <Icon sx={{ fontSize: 32 }} />
        </Box>
        
        <Typography variant="h5" fontWeight="800" gutterBottom sx={{ letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3, flexGrow: 1 }}>
          {description}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 1, 
            px: 1.5, 
            py: 0.5, 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.text.primary, 0.03), 
            border: `1px solid ${theme.palette.divider}` 
          }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
              Real-time Feed
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default function Home() {
  const theme = useTheme();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', { page_title: 'Home' });
    }
  }, []);

  const handleDownloadClick = (platform: string) => {
    if (analytics) {
      logEvent(analytics, 'download_click', { platform });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      <MarketTicker />

      {/* HERO SECTION */}
      <Box 
        component="section" 
        sx={{ 
          pt: { xs: 25, md: 30 }, 
          pb: 20, 
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: theme.palette.mode === 'dark' 
            ? `linear-gradient(${alpha(theme.palette.divider, 0.1)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.divider, 0.1)} 1px, transparent 1px)`
            : 'none',
          backgroundSize: '40px 40px',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, lg: 7 }} sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
              <Fade in timeout={1000}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', lg: 'flex-start' } }}>
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
                      mb: 4
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'text.secondary', fontSize: '0.65rem' }}>
                      Sistema Operativo de Grado Profesional
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' }, 
                      fontWeight: 800, 
                      lineHeight: 1.1,
                      mb: 4,
                      letterSpacing: '-0.03em'
                    }}
                  >
                    El monitor financiero<Box component="span" sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.trendUp} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}> de Venezuela.</Box>
                  </Typography>

                  <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 550, fontWeight: 400, lineHeight: 1.6 }}>
                    Precisión absoluta en tiempo real. Bolsa de Valores de Caracas, Banco Central de Venezuela, Mercado P2P y divisas en una sola interfaz diseñada para la máxima eficiencia.
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', lg: 'flex-start' } }}>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<AndroidIcon />}
                      onClick={() => handleDownloadClick('android')}
                      sx={{ 
                        borderRadius: 4, 
                        px: { xs: 3, md: 4 }, 
                        py: 2, 
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 },
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}
                    >
                      Play Store
                    </Button>
                    <Button
                      disabled
                      variant="outlined"
                      size="large"
                      startIcon={<AppleIcon />}
                      sx={{ 
                        borderRadius: 4, 
                        px: { xs: 3, md: 4 }, 
                        py: 2, 
                        textTransform: 'none',
                        fontWeight: 700,
                        opacity: 0.4,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}
                    >
                      Próximamente iOS
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            {/* Visual Phone Mockup */}
            <Grid size={{ xs: 12, lg: 5 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Grow in timeout={1500}>
                <Box sx={{ position: 'relative' }}>
                  <Paper
                    elevation={24}
                    sx={{
                      width: 320,
                      height: 640,
                      mx: 'auto',
                      borderRadius: 12,
                      border: `12px solid ${theme.palette.mode === 'dark' ? '#1A1A1A' : '#E0E0E0'}`,
                      bgcolor: 'background.default',
                      overflow: 'hidden',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    {/* Mockup Content */}
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>Dashboard</Typography>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption">👤</Typography>
                        </Box>
                      </Box>
                      
                      <Paper sx={{ p: 2, borderRadius: 4, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 800 }}>USD BCV</Typography>
                          <Typography variant="caption" sx={{ color: 'trendUp', fontWeight: 800 }}>+0.12%</Typography>
                        </Box>
                        <Typography variant="h4" fontWeight="800">36,42 <Box component="span" sx={{ fontSize: '1rem', color: 'text.secondary' }}>Bs</Box></Typography>
                      </Paper>

                      <Paper sx={{ p: 2, borderRadius: 4, bgcolor: 'background.paper' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, mb: 2, display: 'block', opacity: 0.6 }}>BVC TOP ACTIONS</Typography>
                        {[
                          { name: 'Mercantil A', val: '34,50', trend: 'up' },
                          { name: 'Bco. Provincial', val: '12,20', trend: 'down' }
                        ].map((item) => (
                          <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography variant="caption" fontWeight="700">{item.name}</Typography>
                            <Typography variant="caption" sx={{ color: item.trend === 'up' ? 'trendUp' : 'error.main', fontWeight: 800 }}>{item.val} {item.trend === 'up' ? '▲' : '▼'}</Typography>
                          </Box>
                        ))}
                      </Paper>
                    </Box>
                  </Paper>
                  {/* Decorative Blobs */}
                  <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, bgcolor: alpha(theme.palette.primary.main, 0.2), borderRadius: '50%', filter: 'blur(60px)', zIndex: 1 }} />
                  <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, bgcolor: alpha(theme.palette.trendUp || '#00FF94', 0.1), borderRadius: '50%', filter: 'blur(60px)', zIndex: 1 }} />
                </Box>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box id="caracteristicas" sx={{ py: 20, bgcolor: alpha(theme.palette.background.paper, 0.3) }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 10 }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', mb: 2, display: 'block' }}>
              Arquitectura de Datos
            </Typography>
            <Typography variant="h3" fontWeight="800" sx={{ mb: 3 }}>
              Omnipresencia de Mercado
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              Infraestructura conectada a las fuentes más críticas para garantizar transparencia y velocidad en cada decimal.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <FeatureCard 
              xs={12}
              md={8}
              icon={AnalyticsIcon}
              title="Bolsa de Valores de Caracas"
              description="Acceso directo a la API de la Bolsa. Monitorización de acciones, bonos de deuda privada y el Índice Bursátil Caracas (IBC) actualizado cada sesión con datos oficiales y análisis técnico integrado."
              color={theme.palette.trendUp}
            />
            <FeatureCard 
              xs={12}
              md={4}
              icon={AccountBalanceIcon}
              title="BCV & Bancos"
              description="Tasas oficiales y mesas de cambio de las principales entidades bancarias nacionales con actualización instantánea."
              color={theme.palette.primary.main}
            />
            <FeatureCard 
              xs={12}
              sm={6}
              md={6}
              icon={CurrencyBitcoinIcon}
              title="Crypto P2P Marketplace"
              description="Cálculo en tiempo real de Tether (USDT) vs VES basado en el volumen real de transacciones P2P de los exchanges más importantes."
              color={theme.palette.trendUp}
            />
            <FeatureCard 
              xs={12}
              sm={6}
              md={6}
              icon={LanguageIcon}
              title="P2P Border Cross"
              description="Cotizaciones cruzadas para operaciones fronterizas (COP, PEN, BRL, ARS) con tasas ajustadas a la realidad local."
              color="#9C27B0"
            />
          </Grid>
        </Container>
      </Box>

      {/* MANIFESTO SECTION */}
      <Box id="desarrollador" sx={{ py: { xs: 10, md: 20 } }}>
        <Container maxWidth="lg">
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 4, sm: 6, md: 12 }, 
              borderRadius: { xs: 6, md: 10 }, 
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h5" color="trendUp" fontWeight="800" gutterBottom sx={{ mb: 4, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                  El Manifiesto
                </Typography>
                <Typography variant="h2" fontWeight="800" sx={{ mb: 6, lineHeight: 1.1, fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }, letterSpacing: '-0.02em' }}>
                  "Cuando algo no te gusta, lo construyes mejor."
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 8, fontWeight: 400, lineHeight: 1.7, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  VTrading no es solo una app; es una respuesta. Cansado de herramientas lentas y datos fragmentados, construí la plataforma que yo mismo, como trader, necesitaba. Velocidad sin concesiones, precisión sin dudas.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'background.default', border: `1px solid ${theme.palette.divider}` }}>
                    <TerminalIcon color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="800">Lead Developer</Typography>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'text.secondary' }}>
                      Senior Software Engineer
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  mt: { xs: 4, md: 0 }
                }}>
                  <Box sx={{ 
                    display: 'inline-block', 
                    p: 0.5, 
                    borderRadius: 8, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.trendUp} 100%)` 
                  }}>
                    <Box sx={{ bgcolor: 'background.paper', p: { xs: 4, md: 6 }, borderRadius: 7.5, textAlign: 'center' }}>
                      <Typography variant="h2" fontWeight="900" sx={{ mb: 1, fontSize: { xs: '3rem', md: '4rem' } }}>99.9%</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.secondary' }}>
                        Uptime Guaranteed
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Footer />

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 255, 148, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 255, 148, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 255, 148, 0); }
        }
      `}</style>
    </Box>
  );
}
