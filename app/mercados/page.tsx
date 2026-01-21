'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  alpha,
  Paper,
  Button,
  Divider,
  Fade
} from '@mui/material';
import Navbar from '@/components/Navbar';
import MarketTicker from '@/components/MarketTicker';
import Footer from '@/components/Footer';

// Icons
import PaymentsIcon from '@mui/icons-material/Payments';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import LanguageIcon from '@mui/icons-material/Language';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const MarketCard = ({ icon: Icon, title, subtitle, children, color }: any) => {
  const theme = useTheme();
  return (
    <Grid size={{ xs: 12, lg: 6 }}>
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
            borderColor: alpha(color, 0.5),
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${alpha(color, 0.08)}`,
            '& .market-icon': {
              transform: 'scale(1.1)',
              color: color
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box 
              className="market-icon"
              sx={{ 
                p: 1.5, 
                borderRadius: 3, 
                bgcolor: alpha(color, 0.1), 
                color: color,
                display: 'flex',
                transition: 'all 0.3s ease'
              }}
            >
              <Icon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="800" sx={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, fontSize: '0.65rem' }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <Button 
            size="small" 
            variant="outlined"
            sx={{ 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              borderRadius: 2,
              px: 2,
              borderColor: alpha(theme.palette.divider, 0.1),
              color: 'text.secondary',
              '&:hover': { 
                borderColor: color,
                bgcolor: alpha(color, 0.05),
                color: 'text.primary'
              }
            }}
          >
            Ver Todo
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Paper>
    </Grid>
  );
};

const MarketRow = ({ label, value, change, isUp, sublabel }: any) => {
  const theme = useTheme();
  const trendColor = isUp ? (theme.palette.trendUp || '#00FF94') : (theme.palette.trendDown || '#FF3B3B');
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      p: 2.5, 
      mb: 2,
      borderRadius: 4, 
      bgcolor: alpha(theme.palette.text.primary, 0.02),
      border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
      transition: 'all 0.2s ease',
      '&:hover': { 
        bgcolor: alpha(theme.palette.text.primary, 0.04),
        borderColor: alpha(theme.palette.divider, 0.1),
        transform: 'translateX(4px)'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Box sx={{ 
          width: 44, 
          height: 44, 
          borderRadius: '50%', 
          bgcolor: alpha(theme.palette.text.primary, 0.05),
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontWeight: 900, 
          fontSize: '0.75rem', 
          color: 'text.secondary',
          border: `1px solid ${alpha(theme.palette.divider, 0.05)}`
        }}>
          {label.substring(0, 3).toUpperCase()}
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="800" sx={{ letterSpacing: '-0.01em' }}>
            {label}
          </Typography>
          {sublabel && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0, fontWeight: 500 }}>
              {sublabel}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'text.primary', lineHeight: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
          {isUp ? <TrendingUpIcon sx={{ fontSize: 14, color: trendColor }} /> : <TrendingDownIcon sx={{ fontSize: 14, color: trendColor }} />}
          <Typography variant="caption" sx={{ fontWeight: 900, color: trendColor, fontSize: '0.75rem' }}>
            {change}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default function MercadosPage() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      <MarketTicker />

      {/* HEADER SECTION - Similar to Home Hero Spacing */}
      <Box sx={{ pt: { xs: 20, md: 25 }, pb: 10 }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ mb: 8 }}>
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
                  mb: 3
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#00FF94', animation: 'pulse 2s infinite' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'text.secondary', fontSize: '0.65rem' }}>
                  Live Market Intelligence
                </Typography>
              </Box>
              
              <Typography 
                variant="h2" 
                fontWeight="800" 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  letterSpacing: '-0.03em',
                  mb: 2,
                  lineHeight: 1.1
                }}
              >
                Monitor de Mercado
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650, fontWeight: 400, lineHeight: 1.6 }}>
                Seguimiento en tiempo real de los principales indicadores económicos de Venezuela con infraestructura de grado profesional.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {/* Mercado Cambiario */}
            <MarketCard 
              icon={PaymentsIcon} 
              title="Mercado Cambiario" 
              subtitle="Divisas & Tasas Oficiales"
              color={theme.palette.primary.main}
            >
              <MarketRow label="Dólar BCV" value="36.42" change="+0.12%" isUp={true} sublabel="Banco Central de Venezuela" />
              <MarketRow label="Paralelo" value="41.98" change="+0.85%" isUp={true} sublabel="EnParaleloVzla" />
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.02), border: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>Banesco</Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 900 }}>36.52</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.02), border: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>Mercantil</Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 900 }}>36.48</Typography>
                  </Box>
                </Grid>
              </Grid>
            </MarketCard>

            {/* Bolsa de Valores */}
            <MarketCard 
              icon={ShowChartIcon} 
              title="Bolsa de Valores" 
              subtitle="Top Acciones BVC"
              color="#00FF94"
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Instrumento</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Precio</Typography>
              </Box>
              <MarketRow label="Santa Teresa" value="18.50" change="+2.4%" isUp={true} sublabel="RON.A" />
              <MarketRow label="Mercantil A" value="34.20" change="+1.1%" isUp={true} sublabel="MVZ.A" />
              <MarketRow label="Bco. Provincial" value="12.15" change="-0.5%" isUp={false} sublabel="BPV" />
            </MarketCard>

            {/* Ecosistema Cripto */}
            <MarketCard 
              icon={CurrencyBitcoinIcon} 
              title="Ecosistema Cripto" 
              subtitle="P2P & Market Caps"
              color="#F7931A"
            >
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ 
                    p: 4, 
                    borderRadius: 5, 
                    height: '100%',
                    bgcolor: alpha('#00FF94', 0.03), 
                    border: `1px solid ${alpha('#00FF94', 0.1)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: alpha('#00FF94', 0.1), color: '#00FF94', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>₮</Box>
                        <Typography variant="body2" fontWeight="900">USDT P2P</Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        42.15 <Typography component="span" variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>VES</Typography>
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 4, height: 50, display: 'flex', alignItems: 'flex-end', gap: 0.8 }}>
                      {[40, 60, 55, 80, 70, 90, 85].map((h, i) => (
                        <Box key={i} sx={{ flexGrow: 1, bgcolor: alpha('#00FF94', 0.3), height: `${h}%`, borderRadius: '3px 3px 0 0' }} />
                      ))}
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { label: 'Bitcoin', icon: '₿', color: '#F7931A', val: '$68,452', trend: 'up' },
                      { label: 'Ethereum', icon: 'Ξ', color: '#627EEA', val: '$3,421', trend: 'up' },
                      { label: 'BNB', icon: 'B', color: '#F3BA2F', val: '$592', trend: 'down' }
                    ].map((coin) => (
                      <Box key={coin.label} sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.02), border: `1px solid ${alpha(theme.palette.divider, 0.05)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: alpha(coin.color, 0.1), color: coin.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>{coin.icon}</Box>
                          <Typography variant="body2" fontWeight="800">{coin.label}</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 900, color: coin.trend === 'up' ? (theme.palette.trendUp || '#00FF94') : (theme.palette.trendDown || '#FF3B3B') }}>{coin.val}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </MarketCard>

            {/* Divisas Fronterizas */}
            <MarketCard 
              icon={LanguageIcon} 
              title="Divisas Fronterizas" 
              subtitle="Tasas Regionales P2P"
              color="#9C27B0"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Peso Colombiano', code: 'COP', sub: 'Cúcuta Market', val: '0.0104', color: '#9C27B0' },
                  { label: 'Sol Peruano', code: 'PEN', sub: 'Lima / P2P', val: '10.82', color: '#F44336' },
                  { label: 'Real Brasileño', code: 'BRL', sub: 'Santa Elena', val: '7.92', color: '#FFC107' }
                ].map((fiat) => (
                  <Box key={fiat.code} sx={{ p: 2.5, borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.02), border: `1px solid ${alpha(theme.palette.divider, 0.05)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: alpha(fiat.color, 0.1), color: fiat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>{fiat.code}</Box>
                      <Box>
                        <Typography variant="body1" fontWeight="800" sx={{ letterSpacing: '-0.01em' }}>{fiat.label}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{fiat.sub}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 900 }}>{fiat.val}</Typography>
                  </Box>
                ))}
              </Box>
            </MarketCard>
          </Grid>
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
