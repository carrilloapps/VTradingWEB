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
  Fade,
  CircularProgress
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

const MarketCard = ({ icon: Icon, title, subtitle, children, color, loading }: any) => {
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
          position: 'relative',
          overflow: 'hidden',
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
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.background.paper, 0.7), zIndex: 1, borderRadius: 6 }}>
            <CircularProgress size={30} color="inherit" />
          </Box>
        )}
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

import { getMarketDataAction } from '@/app/actions/market';
import { useState, useEffect } from 'react';

export default function MercadosContent({ initialData }: { initialData: any }) {
  const theme = useTheme();
  const [marketData, setMarketData] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData);

  // Derive ticker items from marketData
  const getTickerItems = (data: any) => {
    if (!data) return null;
    const items = [];
    
    // BCV
    if (data.rates?.rates) {
      const usd = data.rates.rates.find((r: any) => r.currency === 'USD');
      if (usd) {
        items.push({ 
          label: 'USD/VES BCV', 
          value: (usd.rate?.buy || usd.rate || 0).toFixed(2), 
          trend: usd.change === 'up' ? 'up' : 'down' 
        });
      }
    }

    // Crypto
    if (data.crypto?.rates) {
      const usdt = data.crypto.rates.find((r: any) => r.currency === 'USDT');
      if (usdt) {
        items.push({ 
          label: 'USDT P2P', 
          value: (usdt.price || 0).toFixed(2), 
          trend: 'up' 
        });
      }
    }

    // BVC
    if (data.bvc?.summary) {
      items.push({ 
        label: 'IBVC Index', 
        value: (data.bvc.summary.index || 0).toLocaleString(), 
        trend: data.bvc.summary.change >= 0 ? 'up' : 'down' 
      });
    }

    return items.length > 0 ? items : null;
  };

  const tickerItems = getTickerItems(marketData);

  useEffect(() => {
    if (!initialData) {
      const fetchMarketData = async () => {
        try {
          const data = await getMarketDataAction('full');
          setMarketData(data);
        } catch (error) {
          console.error('Error fetching market data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMarketData();
    }

    const interval = setInterval(async () => {
      try {
        const data = await getMarketDataAction('full');
        setMarketData(data);
      } catch (error) {
        console.error('Error refreshing market data:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [initialData]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      <MarketTicker initialItems={tickerItems || undefined} />

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
              loading={loading}
            >
              {marketData?.rates?.rates?.map((rate: any) => (
                <MarketRow 
                  key={rate.currency}
                  label={`Dólar ${rate.currency === 'USD' ? 'BCV' : rate.currency}`}
                  value={rate.rate.buy.toFixed(2)}
                  change={`${(rate.rate.buy - rate.previousRate.buy).toFixed(2)}`}
                  isUp={rate.change === 'up'}
                  sublabel={rate.currency === 'USD' ? 'Banco Central de Venezuela' : `Referencia ${rate.currency}`}
                />
              ))}
              {!marketData && !loading && <Typography variant="caption" color="error">Error al cargar datos oficiales</Typography>}
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {marketData?.rates?.banks?.slice(0, 2).map((bank: any) => (
                  <Grid key={bank.bank} size={{ xs: 6 }}>
                    <Box sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.02), border: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>{bank.bank}</Typography>
                      <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 900 }}>{bank.rate.buy.toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </MarketCard>

            {/* Bolsa de Valores */}
            <MarketCard 
              icon={ShowChartIcon} 
              title="Bolsa de Valores" 
              subtitle="Top Acciones BVC"
              color="#00FF94"
              loading={loading}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Instrumento</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Precio</Typography>
              </Box>
              {marketData?.bvc?.quotes?.slice(0, 4).map((quote: any) => (
                <MarketRow 
                  key={quote.symbol}
                  label={quote.symbol}
                  value={quote.price.toFixed(2)}
                  change={`${quote.changePercent.toFixed(2)}%`}
                  isUp={quote.change >= 0}
                  sublabel={quote.symbol}
                />
              ))}
              {!marketData?.bvc && !loading && <Typography variant="caption" color="error">Error al cargar datos BVC</Typography>}
            </MarketCard>

            {/* Ecosistema Cripto */}
            <MarketCard 
              icon={CurrencyBitcoinIcon} 
              title="Ecosistema Cripto" 
              subtitle="P2P & Market Caps"
              color="#F7931A"
              loading={loading}
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
                        {marketData?.crypto?.rates?.find((r: any) => r.currency === 'USDT')?.price.toFixed(2) || '...'} <Typography component="span" variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>VES</Typography>
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
                    {marketData?.crypto?.rates?.slice(0, 3).map((coin: any) => (
                      <Box key={coin.currency} sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.02), border: `1px solid ${alpha(theme.palette.divider, 0.05)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: alpha('#F7931A', 0.1), color: '#F7931A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>
                            {coin.currency === 'BTC' ? '₿' : coin.currency === 'ETH' ? 'Ξ' : 'C'}
                          </Box>
                          <Typography variant="body2" fontWeight="800">{coin.currency}</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 900, color: theme.palette.trendUp }}>
                          {coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
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
              loading={loading}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {marketData?.rates?.border?.slice(0, 3).map((fiat: any) => (
                  <Box key={fiat.currency} sx={{ p: 2.5, borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.02), border: `1px solid ${alpha(theme.palette.divider, 0.05)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: alpha('#9C27B0', 0.1), color: '#9C27B0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>{fiat.currency}</Box>
                      <Box>
                        <Typography variant="body1" fontWeight="800" sx={{ letterSpacing: '-0.01em' }}>{fiat.currency}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{fiat.source}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 900 }}>{fiat.rate.buy.toFixed(4)}</Typography>
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
