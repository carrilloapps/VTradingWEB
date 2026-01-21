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
          p: { xs: 2.5, md: 3 },
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
            transform: 'translateY(-4px)',
            boxShadow: `0 15px 30px ${alpha(color, 0.08)}`,
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              className="market-icon"
              sx={{ 
                p: 1.2, 
                borderRadius: 2.5, 
                bgcolor: alpha(color, 0.1), 
                color: color,
                display: 'flex',
                transition: 'all 0.3s ease'
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, fontSize: '0.6rem' }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <Button 
            size="small" 
            variant="outlined"
            sx={{ 
              fontSize: '0.6rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              borderRadius: 2,
              px: 1.5,
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

  const getTrendIcon = (val: string) => {
    if (!val) return '●';
    const num = parseFloat(val);
    if (isNaN(num) || Math.abs(num) < 0.01) return '●';
    return val.startsWith('+') ? '▲' : val.startsWith('-') ? '▼' : '●';
  };

  const getTrendColor = (val: string, theme: any) => {
    if (!val) return 'text.secondary';
    const num = parseFloat(val);
    if (isNaN(num) || Math.abs(num) < 0.01) return 'text.secondary';
    return val.startsWith('+') ? (theme.palette.trendUp || '#00FF94') : val.startsWith('-') ? (theme.palette.trendDown || '#FF3B3B') : 'text.secondary';
  };

const MarketRow = ({ label, value, buy, sell, buyChange, sellChange, change, isUp, sublabel }: any) => {
  const theme = useTheme();
  const trendColor = isUp ? (theme.palette.trendUp || '#00FF94') : (theme.palette.trendDown || '#FF3B3B');
  
  const hasTradingData = buy && sell && buy !== '0.00' && sell !== '0.00' && buy !== '0.0000' && sell !== '0.0000';

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 1,
      p: 2, 
      mb: 1.5,
      borderRadius: 4, 
      bgcolor: alpha(theme.palette.text.primary, 0.02),
      border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: alpha(theme.palette.text.primary, 0.04),
        borderColor: alpha(theme.palette.divider, 0.1),
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 36, 
            height: 36, 
            borderRadius: '50%', 
            bgcolor: alpha(theme.palette.text.primary, 0.05),
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 900, 
            fontSize: '0.7rem', 
            color: 'text.secondary',
            border: `1px solid ${alpha(theme.palette.divider, 0.05)}`
          }}>
            {label.split('/')[0].substring(0, 3).toUpperCase()}
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="800" sx={{ letterSpacing: '-0.01em', fontSize: '0.85rem' }}>{label}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>{sublabel}</Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 900, lineHeight: 1 }}>
            <Box component="span" sx={{ fontSize: '0.7em', color: 'text.secondary', mr: 0.5 }}>Bs.</Box>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.2 }}>
            {(() => {
              const changeNum = parseFloat(change);
              const isNeutral = isNaN(changeNum) || Math.abs(changeNum) < 0.0001;
              return (
                <Typography variant="caption" sx={{ color: isNeutral ? 'text.secondary' : trendColor, fontWeight: 900, display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
                  {isNeutral ? '●' : (isUp ? '▲' : '▼')} {isNeutral ? '0.00' : Math.abs(changeNum).toFixed(2)}%
                </Typography>
              );
            })()}
          </Box>
        </Box>
      </Box>

      {hasTradingData && (
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: 0.2, 
          pt: 1, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}` 
        }}>
          <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.55rem', display: 'block', mb: 0.1 }}>Compra</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.75rem' }}>
                  <Box component="span" sx={{ fontSize: '0.8em', color: 'text.secondary', mr: 0.2 }}>Bs.</Box>
                  {buy}
                </Typography>
                {buyChange && (() => {
                  const num = parseFloat(buyChange);
                  const isNeutral = isNaN(num) || Math.abs(num) < 0.01;
                  return (
                    <Typography variant="caption" sx={{ color: getTrendColor(buyChange, theme), fontWeight: 900, fontSize: '0.6rem' }}>
                      {getTrendIcon(buyChange)} {isNeutral ? '0.00' : Math.abs(num).toFixed(2)}%
                    </Typography>
                  );
                })()}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.55rem', display: 'block', mb: 0.1 }}>Venta</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.75rem' }}>
                  <Box component="span" sx={{ fontSize: '0.8em', color: 'text.secondary', mr: 0.2 }}>Bs.</Box>
                  {sell}
                </Typography>
                {sellChange && (() => {
                  const num = parseFloat(sellChange);
                  const isNeutral = isNaN(num) || Math.abs(num) < 0.01;
                  return (
                    <Typography variant="caption" sx={{ color: getTrendColor(sellChange, theme), fontWeight: 900, fontSize: '0.6rem' }}>
                      {getTrendIcon(sellChange)} {isNeutral ? '0.00' : Math.abs(num).toFixed(2)}%
                    </Typography>
                  );
                })()}
              </Box>
            </Box>
        </Box>
      )}
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
    const rates = Array.isArray(data.rates) ? data.rates : [];
    if (rates.length > 0) {
      const bcv = rates.find((r: any) => r.source === 'BCV' && r.currency === 'USD');
      if (bcv) {
        items.push({ 
          label: 'USD/VES BCV', 
          value: (bcv.rate?.average || 0).toFixed(2), 
          trend: bcv.change?.average?.direction || 'stable'
        });
      }
    }

    // Crypto
    const crypto = Array.isArray(data.crypto) ? data.crypto : [];
    if (crypto.length > 0) {
      const usdt = crypto.find((r: any) => r.currency === 'USDT');
      if (usdt) {
        items.push({ 
          label: 'USDT P2P', 
          value: (usdt.rate?.buy || 0).toFixed(2), 
          trend: usdt.change?.buy?.direction || 'stable'
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
          const data = await getMarketDataAction();
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
        const data = await getMarketDataAction();
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
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650, fontWeight: 400, lineHeight: 1.6, fontSize: '1rem' }}>
                Seguimiento en tiempo real de los principales indicadores económicos de Venezuela con infraestructura de grado profesional.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={3}>
            {/* Mercado Cambiario */}
            <MarketCard 
              icon={PaymentsIcon} 
              title="Mercado Cambiario" 
              subtitle="Divisas & Tasas Oficiales"
              color={theme.palette.primary.main}
              loading={loading}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                {marketData?.rates?.map((rate: any) => {
                  const currentBuy = rate.rate?.buy || 0;
                  const currentSell = rate.rate?.sell || 0;
                  const currentAverage = rate.rate?.average || currentBuy;
                  
                  const avgPercent = rate.change?.average?.percent || 0;
                  const buyPercent = rate.change?.buy?.percent || 0;
                  const sellPercent = rate.change?.sell?.percent || 0;
                  
                  const direction = rate.change?.average?.direction || 'stable';
                  const showTrading = rate.currency === 'USD' && (currentBuy > 0 || currentSell > 0);
                  
                  return (
                    <MarketRow 
                      key={rate.currency + rate.source}
                      label={`${rate.currency}/VES`}
                      value={currentAverage.toFixed(2)}
                      buy={showTrading ? currentBuy.toFixed(2) : undefined}
                      sell={showTrading ? currentSell.toFixed(2) : undefined}
                      buyChange={showTrading ? `${buyPercent >= 0 ? '+' : ''}${buyPercent.toFixed(2)}` : undefined}
                      sellChange={showTrading ? `${sellPercent >= 0 ? '+' : ''}${sellPercent.toFixed(2)}` : undefined}
                      change={`${avgPercent >= 0 ? '+' : ''}${avgPercent.toFixed(2)}`}
                      isUp={direction === 'up'}
                      sublabel={rate.source === 'BCV' ? 'Banco Central de Venezuela' : rate.source}
                    />
                  );
                })}
              </Box>
              {!marketData && !loading && <Typography variant="caption" color="error">Error al cargar datos oficiales</Typography>}
              
                {/* Bancos de la Tasa BCV */}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {marketData?.banks
                    ?.slice(0, 4)
                    .map((bank: any) => (
                      <Grid key={bank.source} size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 3, 
                          bgcolor: alpha(theme.palette.text.primary, 0.02), 
                          border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.text.primary, 0.04),
                            borderColor: alpha(theme.palette.divider, 0.1),
                          }
                        }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5, fontSize: '0.55rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {bank.source}
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 900, lineHeight: 1, fontSize: '0.9rem' }}>
                            <Box component="span" sx={{ fontSize: '0.7em', color: 'text.secondary', mr: 0.5 }}>Bs.</Box>
                            {(bank.rate?.average || 0).toFixed(2)}
                          </Typography>
                          {bank.change?.average && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: getTrendColor(bank.change.average.direction === 'up' ? '+' : (bank.change.average.direction === 'down' ? '-' : '0'), theme), 
                                  fontWeight: 900,
                                  fontSize: '0.6rem'
                                }}
                              >
                                {bank.change.average.direction === 'up' ? '▲' : (bank.change.average.direction === 'down' ? '▼' : '●')} {Math.abs(bank.change.average.percent || 0).toFixed(2)}%
                              </Typography>
                            </Box>
                          )}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.6rem' }}>Instrumento</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.6rem' }}>Precio</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                 {Array.isArray(marketData?.bvc) ? marketData.bvc.slice(0, 6).map((quote: any) => (
                   <MarketRow 
                     key={quote.symbol}
                     label={quote.symbol}
                     value={(quote.price || 0).toFixed(2)}
                     change={`${(quote.change?.percent || 0).toFixed(2)}%`}
                     isUp={(quote.change?.percent || 0) >= 0}
                     sublabel={quote.name || quote.symbol}
                   />
                 )) : (
                   marketData?.bvc?.quotes?.slice(0, 6).map((quote: any) => (
                     <MarketRow 
                       key={quote.symbol}
                       label={quote.symbol}
                       value={(quote.price || 0).toFixed(2)}
                       change={`${(quote.changePercent || 0).toFixed(2)}%`}
                       isUp={(quote.change || 0) >= 0}
                       sublabel={quote.symbol}
                     />
                   ))
                 )}
               </Box>
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
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    height: '100%',
                    bgcolor: alpha('#F7931A', 0.03), 
                    border: `1px solid ${alpha('#F7931A', 0.1)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: alpha('#F7931A', 0.1), color: '#F7931A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>₮</Box>
                        <Typography variant="caption" fontWeight="900">USDT/VES P2P</Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        <Box component="span" sx={{ fontSize: '0.5em', color: 'text.secondary', mr: 0.5 }}>Bs.</Box>
                        {(() => {
                          const usdtRate = marketData?.crypto?.find((r: any) => r.currency === 'USDT');
                          return (usdtRate?.rate?.buy || 0).toFixed(2);
                        })()}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2, height: 40, display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
                      {[40, 60, 55, 80, 70, 90, 85].map((h, i) => (
                        <Box key={i} sx={{ flexGrow: 1, bgcolor: alpha('#F7931A', 0.3), height: `${h}%`, borderRadius: '2px 2px 0 0' }} />
                      ))}
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                    {marketData?.crypto?.map((coin: any) => {
                       const currentBuy = coin.rate?.buy || 0;
                       const currentSell = coin.rate?.sell || 0;
                       const currentPrice = coin.rate?.average || coin.rate?.buy || 0;
                       
                       const avgPercent = coin.change?.average?.percent || coin.change?.buy?.percent || 0;
                       const buyPercent = coin.change?.buy?.percent || 0;
                       const sellPercent = coin.change?.sell?.percent || 0;
                       const direction = coin.change?.average?.direction || coin.change?.buy?.direction || 'stable';
                       
                       return (
                         <MarketRow 
                           key={coin.currency}
                           label={`${coin.currency}/VES`}
                           value={currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           buy={coin.currency === 'USDT' ? currentBuy.toFixed(2) : undefined}
                           sell={coin.currency === 'USDT' ? currentSell.toFixed(2) : undefined}
                           buyChange={coin.currency === 'USDT' ? `${buyPercent >= 0 ? '+' : ''}${buyPercent.toFixed(2)}` : undefined}
                           sellChange={coin.currency === 'USDT' ? `${sellPercent >= 0 ? '+' : ''}${sellPercent.toFixed(2)}` : undefined}
                           change={`${avgPercent >= 0 ? '+' : ''}${avgPercent.toFixed(2)}`}
                           isUp={direction === 'up'}
                           sublabel={coin.source}
                         />
                       );
                     })}
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
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                {marketData?.border?.map((fiat: any) => {
                   const currentBuy = fiat.rate?.buy || 0;
                   const currentSell = fiat.rate?.sell || 0;
                   const currentAverage = fiat.rate?.average || (currentBuy + currentSell) / 2;
                   
                   const buyPercent = fiat.change?.buy?.percent || 0;
                   const sellPercent = fiat.change?.sell?.percent || 0;
                   const avgPercent = (buyPercent + sellPercent) / 2;
                   const direction = fiat.change?.buy?.direction || 'stable';
                   
                   return (
                     <MarketRow 
                       key={fiat.currency}
                       label={`${fiat.currency}/VES`}
                       value={currentAverage.toFixed(4)}
                       buy={currentBuy.toFixed(4)}
                       sell={currentSell.toFixed(4)}
                       buyChange={`${buyPercent >= 0 ? '+' : ''}${buyPercent.toFixed(2)}`}
                       sellChange={`${sellPercent >= 0 ? '+' : ''}${sellPercent.toFixed(2)}`}
                       change={`${avgPercent >= 0 ? '+' : ''}${avgPercent.toFixed(2)}`}
                       isUp={direction === 'up'}
                       sublabel={fiat.source}
                     />
                   );
                 })}
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
