'use client';

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
  CircularProgress,
  IconButton,
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
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const MarketCard = ({ icon: Icon, title, subtitle, children, color, loading }: any) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        height: '100%',
        borderRadius: 8,
        bgcolor: 'background.paper',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          borderColor: alpha(color || theme.palette.primary.main, 0.3),
          transform: 'translateY(-2px)',
          boxShadow: `0 10px 30px -10px ${alpha('#000', 0.5)}`,
        }
      }}
    >
      {loading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.background.paper, 0.7), zIndex: 1, borderRadius: 8 }}>
          <CircularProgress size={30} color="inherit" />
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              p: 1.2, 
              borderRadius: 3, 
              bgcolor: alpha(color || theme.palette.primary.main, 0.1), 
              color: color || theme.palette.primary.main,
              display: 'flex',
              transition: 'all 0.3s ease'
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2, letterSpacing: '-0.01em', fontSize: '1.1rem' }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, fontSize: '0.6rem' }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
        <Button 
          size="small" 
          sx={{ 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            color: color || theme.palette.primary.main,
            '&:hover': { 
              textDecoration: 'underline',
              bgcolor: 'transparent'
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
  );
};

const TrendChart = ({ title, subtitle, color, data, loading }: any) => {
  const theme = useTheme();
  
  const chartData = useMemo(() => {
    if (!data || data.length < 2) return '';
    
    const width = 100;
    const height = 100;
    const padding = 10;
    
    const prices = data.map((d: any) => d.price).filter(p => typeof p === 'number' && !isNaN(p));
    if (prices.length < 2) return '';
    
    const minVal = Math.min(...prices);
    const maxVal = Math.max(...prices);
    const range = maxVal - minVal || 1;

    return data.map((d: any, i: number) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - padding - ((d.price - minVal) / range) * (height - 2 * padding);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  }, [data]);

  const lastPointY = useMemo(() => {
    if (!data || data.length === 0) return '50%';
    const prices = data.map((d: any) => d.price).filter(p => typeof p === 'number' && !isNaN(p));
    if (prices.length === 0) return '50%';
    
    const minVal = Math.min(...prices);
    const maxVal = Math.max(...prices);
    const range = maxVal - minVal || 1;
    const lastPrice = data[data.length - 1].price;
    const padding = 10;
    const y = 100 - (padding + ((lastPrice - minVal) / range) * (100 - 2 * padding));
    return `${Math.max(padding, Math.min(100 - padding, y))}%`;
  }, [data]);

  const dateLabels = useMemo(() => {
    if (!data || data.length < 2) return null;
    
    const labels = [];
    const count = 4;
    for (let i = 0; i < count; i++) {
      const index = Math.floor((i / (count - 1)) * (data.length - 1));
      const dateStr = data[index]?.date;
      if (dateStr) {
        const date = new Date(dateStr);
        // Format as day name or short date
        const label = i === count - 1 ? 'AHORA' : date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
        labels.push(label);
      }
    }
    return labels;
  }, [data]);

  return (
    <Box 
      sx={{ 
        bgcolor: '#0a0a0a', 
        borderRadius: 6, 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)'
      }}
    >
      {loading && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.3)', zIndex: 20 }}>
          <CircularProgress size={20} color="inherit" />
        </Box>
      )}
      
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Typography variant="subtitle1" fontWeight="800" sx={{ color: 'white', lineHeight: 1.2 }}>{title}</Typography>
        <Typography variant="caption" sx={{ color: 'grey.500', fontWeight: 700 }}>{subtitle}</Typography>
      </Box>
      
      <Box sx={{ height: 160, position: 'relative', mt: 4, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box 
          sx={{ 
            position: 'absolute', 
            inset: 0, 
            background: `linear-gradient(to top, ${alpha(color || '#10b981', 0.15)}, transparent)`,
            zIndex: 1
          }} 
        />
        {(!data || data.length < 2) && !loading ? (
          <Box sx={{ textAlign: 'center', zIndex: 2 }}>
            <Typography variant="caption" sx={{ color: 'grey.700', fontWeight: 700, display: 'block' }}>
              DATOS NO DISPONIBLES
            </Typography>
            <Typography variant="caption" sx={{ color: 'grey.800', fontSize: '0.5rem' }}>
              Items recibidos: {data?.length || 0}
            </Typography>
          </Box>
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'relative', zIndex: 2 }}>
            <path 
              d={chartData} 
              fill="none" 
              stroke={color || '#10b981'} 
              strokeWidth="3" 
              vectorEffect="non-scaling-stroke" 
              strokeLinecap="round"
              style={{ transition: 'd 0.5s ease' }}
            />
          </svg>
        )}
        {!loading && data && data.length > 1 && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: lastPointY, 
              right: 0, 
              width: 10, 
              height: 10, 
              bgcolor: color || '#10b981', 
              borderRadius: '50%', 
              boxShadow: `0 0 20px ${color || '#10b981'}`,
              zIndex: 3,
              transform: 'translate(50%, -50%)',
              transition: 'top 0.5s ease'
            }} 
          />
        )}
      </Box>

      <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', color: 'grey.600', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'monospace' }}>
        {dateLabels ? dateLabels.map((label: string, i: number) => (
          <Box key={i} component="span" sx={{ color: label === 'AHORA' ? (color || '#10b981') : 'inherit' }}>
            {label}
          </Box>
        )) : (
          <>
            <span>LUN</span>
            <span>MIE</span>
            <span>VIE</span>
            <Box component="span" sx={{ color: color || '#10b981' }}>AHORA</Box>
          </>
        )}
      </Box>
    </Box>
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

const MarketRow = ({ label, value, buy, sell, buyChange, sellChange, change, isUp, sublabel, compact }: any) => {
  const theme = useTheme();
  const trendColor = isUp ? (theme.palette.trendUp || '#00FF94') : (theme.palette.trendDown || '#FF3B3B');
  
  const hasTradingData = !compact && buy && sell && buy !== '0.00' && sell !== '0.00' && buy !== '0.0000' && sell !== '0.0000';

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: compact ? 0.5 : 1,
      p: compact ? 1.5 : 2, 
      mb: compact ? 1 : 1.5,
      borderRadius: compact ? 3 : 4, 
      bgcolor: alpha(theme.palette.text.primary, 0.02),
      border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        bgcolor: alpha(theme.palette.text.primary, 0.04),
        borderColor: alpha(theme.palette.divider, 0.1),
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: compact ? 1.5 : 2 }}>
          {(!compact || label.includes('/')) && (
            <Box sx={{ 
              width: compact ? 28 : 36, 
              height: compact ? 28 : 36, 
              borderRadius: '50%', 
              bgcolor: alpha(theme.palette.text.primary, 0.05),
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 900, 
              fontSize: compact ? '0.6rem' : '0.7rem', 
              color: 'text.secondary',
              border: `1px solid ${alpha(theme.palette.divider, 0.05)}`
            }}>
              {label.split('/')[0].substring(0, 3).toUpperCase()}
            </Box>
          )}
          <Box>
            <Typography variant="body2" fontWeight="800" sx={{ letterSpacing: '-0.01em', fontSize: compact ? '0.75rem' : '0.85rem', lineHeight: 1.2 }}>{label}</Typography>
            {sublabel && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: compact ? '0.6rem' : '0.7rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.7 }}>{sublabel}</Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right', display: compact ? 'flex' : 'block', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 900, lineHeight: 1, fontSize: compact ? '0.85rem' : '1rem' }}>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: compact ? 0 : 0.2 }}>
            {(() => {
              const changeNum = parseFloat(change);
              const isNeutral = isNaN(changeNum) || Math.abs(changeNum) < 0.0001;
              return (
                <Typography variant="caption" sx={{ color: isNeutral ? 'text.secondary' : trendColor, fontWeight: 900, display: 'flex', alignItems: 'center', fontSize: compact ? '0.65rem' : '0.7rem', minWidth: compact ? 45 : 'auto', justifyContent: 'flex-end' }}>
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
          flexDirection: 'column',
          gap: 1.5, 
          mt: 0.2, 
          pt: 1, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}` 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.55rem' }}>Compra</Typography>
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.55rem' }}>Venta</Typography>
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

const CryptoTile = ({ label, value, change, isUp, color }: any) => {
  const theme = useTheme();
  const trendColor = isUp ? (theme.palette.trendUp || '#00FF94') : (theme.palette.trendDown || '#FF3B3B');

  return (
    <Box 
      sx={{ 
        p: 3, 
        borderRadius: 5, 
        bgcolor: alpha(theme.palette.text.primary, 0.02),
        border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: alpha(theme.palette.text.primary, 0.04),
          borderColor: alpha(color || theme.palette.primary.main, 0.2),
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="caption" fontWeight="800" sx={{ color: 'text.secondary', letterSpacing: '0.05em' }}>{label} / VES</Typography>
        <Box 
          sx={{ 
            px: 1.5, 
            py: 0.4, 
            borderRadius: 10, 
            bgcolor: alpha(trendColor, 0.1), 
            color: trendColor,
            fontSize: '0.65rem',
            fontWeight: 900
          }}
        >
          {isUp ? '+' : ''}{change}%
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" fontWeight="900" sx={{ fontFamily: 'monospace', letterSpacing: '-0.04em', mb: 1, fontSize: '1.4rem' }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label === 'USDT' ? 'P2P MARKET' : 'GLOBAL PRICE'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Typography variant="caption" sx={{ color: trendColor, fontSize: '0.6rem', fontWeight: 900 }}>LIVE</Typography>
             <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: trendColor, animation: 'pulse 2s infinite' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

import { getMarketDataAction, getMarketHistoryAction } from '@/app/actions/market';
import { useState, useEffect, useMemo } from 'react';

export default function MercadosContent({ initialData }: { initialData: any }) {
  const theme = useTheme();
  const [marketData, setMarketData] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [bvcPage, setBvcPage] = useState(1);
  const bvcLimit = 6; // Showing 6 items as per the grid layout

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

  const fetchMarketData = async (page = bvcPage) => {
    setLoading(true);
    try {
      const data = await getMarketDataAction(page, bvcLimit);
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getMarketHistoryAction(1, 30);
      console.log('History data received:', data?.length, 'items');
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching market history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    if (!initialData || bvcPage !== 1) {
      fetchMarketData(bvcPage);
    }

    const interval = setInterval(async () => {
      try {
        const data = await getMarketDataAction(bvcPage, bvcLimit);
        setMarketData(data);
      } catch (error) {
        console.error('Error refreshing market data:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [initialData, bvcPage]);

  const handleBvcPageChange = (newPage: number) => {
    if (newPage < 1) return;
    if (marketData?.bvcMeta?.pages && newPage > marketData.bvcMeta.pages) return;
    setBvcPage(newPage);
  };

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
                  gap: 1, 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: '20px', 
                  bgcolor: alpha('#10b981', 0.1),
                  border: `1px solid ${alpha('#10b981', 0.2)}`,
                  mb: 4
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', animation: 'pulse 2s infinite' }} />
                <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981', fontSize: '0.6rem' }}>
                  Live Market Intelligence
                </Typography>
              </Box>
              
              <Typography 
                variant="h1" 
                fontWeight="900" 
                sx={{ 
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  letterSpacing: '-0.05em',
                  mb: 2,
                  lineHeight: 1,
                  color: 'text.primary'
                }}
              >
                Monitor de Mercado
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 4 }}>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, fontWeight: 500, lineHeight: 1.5, fontSize: '1.1rem', opacity: 0.8 }}>
                  Seguimiento en tiempo real de los principales indicadores económicos de Venezuela con infraestructura de grado profesional.
                </Typography>
                
                {/* Status Bar - Bento Style */}
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 5, 
                  bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : '#fff',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                  gap: { xs: 2, lg: 0 },
                  alignItems: 'center',
                  width: { xs: '100%', md: 'auto' },
                  backdropFilter: 'blur(10px)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? `0 10px 40px -10px ${alpha('#000', 0.5)}`
                    : `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <Box sx={{ px: 3, borderRight: { xs: 'none', lg: `1px solid ${alpha(theme.palette.divider, 0.1)}` } }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.55rem', display: 'block', mb: 0.5, letterSpacing: '0.05em' }}>BOLSA DE VALORES</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: marketData?.status?.state === 'ABIERTO' ? '#00FF94' : '#FF3B3B',
                        boxShadow: `0 0 10px ${marketData?.status?.state === 'ABIERTO' ? '#00FF94' : '#FF3B3B'}`,
                        animation: 'pulse 2s infinite' 
                      }} />
                      <Typography variant="body2" sx={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.02em', color: 'text.primary' }}>
                        {marketData?.status?.state || 'CERRADA'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ px: 3, borderRight: { xs: 'none', lg: `1px solid ${alpha(theme.palette.divider, 0.1)}` } }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.55rem', display: 'block', mb: 0.5, letterSpacing: '0.05em' }}>FECHA</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'text.primary' }}>
                      {marketData?.status?.date || new Date().toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </Typography>
                  </Box>

                  <Box sx={{ px: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.55rem', display: 'block', mb: 0.5, letterSpacing: '0.05em' }}>ACTUALIZACIÓN</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'text.primary', whiteSpace: 'nowrap' }}>
                      {(() => {
                        try {
                          const dateObj = marketData?.status?.lastUpdate ? new Date(marketData.status.lastUpdate) : new Date();
                          return new Intl.DateTimeFormat('es-VE', {
                             day: '2-digit',
                             month: '2-digit',
                             year: '2-digit',
                             hour: '2-digit',
                             minute: '2-digit',
                             hour12: true,
                             timeZone: 'America/Caracas'
                           }).format(dateObj).replace(',', '').replace(/\./g, '').toUpperCase();
                        } catch (e) {
                          return marketData?.status?.lastUpdate || '---';
                        }
                      })()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Fade>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' }, 
            gap: 3,
            gridAutoRows: 'minmax(180px, auto)'
          }}>
            {/* 1. Mercado Cambiario (span 8, row 2) */}
            <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 8' }, gridRow: { md: 'span 2' } }}>
              <MarketCard 
                icon={PaymentsIcon} 
                title="Mercado Cambiario" 
                subtitle="Tasas Oficiales BCV"
                color={theme.palette.primary.main}
                loading={loading}
              >
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {marketData?.rates?.map((rate: any, idx: number) => {
                        const isRateObject = typeof rate.rate === 'object' && rate.rate !== null;
                        const currentAverage = isRateObject 
                          ? (rate.rate.average || rate.rate.buy || rate.rate.sell || 0) 
                          : (rate.rate || 0);
                        
                        const isChangeObject = typeof rate.change === 'object' && rate.change !== null;
                        const avgPercent = isChangeObject 
                          ? (rate.change.average?.percent || rate.change.buy?.percent || rate.change.sell?.percent || 0)
                          : (typeof rate.change === 'number' ? rate.change : 0);
                        
                        const direction = isChangeObject 
                          ? (rate.change.average?.direction || rate.change.buy?.direction || rate.change.sell?.direction || 'stable')
                          : (avgPercent > 0 ? 'up' : avgPercent < 0 ? 'down' : 'stable');

                        return (
                          <MarketRow
                            key={idx}
                            label={`${rate.currency}/VES`}
                            sublabel={rate.source === 'BCV' ? 'Banco Central de Venezuela' : rate.source}
                            value={currentAverage.toFixed(2)}
                            change={`${avgPercent >= 0 ? '+' : ''}${avgPercent.toFixed(2)}`}
                            isUp={direction === 'up'}
                            buy={isRateObject ? rate.rate.buy?.toFixed(2) : undefined}
                            sell={isRateObject ? rate.rate.sell?.toFixed(2) : undefined}
                            buyChange={isChangeObject ? `${rate.change.buy?.percent >= 0 ? '+' : ''}${rate.change.buy?.percent?.toFixed(2)}` : undefined}
                            sellChange={isChangeObject ? `${rate.change.sell?.percent >= 0 ? '+' : ''}${Number(rate.change.sell?.percent || 0).toFixed(2)}` : undefined}
                            compact={idx > 0}
                          />
                        );
                      })}

                      {/* Bancos de la Tasa BCV - Versión compacta para Bento */}
                      <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', mt: 3, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>
                        Referencia Bancaria (BCV)
                      </Typography>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(2, 1fr)' }, 
                        gap: 1.5 
                      }}>
                        {marketData?.banks?.slice(0, 6).map((bank: any) => (
                          <Box key={bank.source} sx={{ 
                            p: 2, 
                            borderRadius: 4, 
                            bgcolor: alpha(theme.palette.text.primary, 0.02), 
                            border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.text.primary, 0.04),
                              borderColor: alpha(theme.palette.primary.main, 0.1),
                            }
                          }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', fontSize: '0.55rem', mb: 0.5, textTransform: 'uppercase' }}>{bank.source}</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: '-0.02em' }}>
                              <Box component="span" sx={{ fontSize: '0.75em', color: 'text.secondary', mr: 0.5 }}>Bs.</Box>
                              {(bank.rate?.average || 0).toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
                      <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                        <TrendChart 
                          title="Tendencia USD/VES" 
                          subtitle="Última semana" 
                          color={theme.palette.primary.main} 
                          data={historyData}
                          loading={loadingHistory}
                        />
                      </Box>
                      
                      {/* More banks to fill space under the chart if it's on desktop */}
                      <Box sx={{ 
                        display: { xs: 'none', lg: 'grid' }, 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: 1.5 
                      }}>
                        {marketData?.banks?.slice(6, 10).map((bank: any) => (
                          <Box key={bank.source} sx={{ 
                            p: 2, 
                            borderRadius: 4, 
                            bgcolor: alpha(theme.palette.text.primary, 0.02), 
                            border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.text.primary, 0.04),
                              borderColor: alpha(theme.palette.primary.main, 0.1),
                            }
                          }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', fontSize: '0.55rem', mb: 0.5, textTransform: 'uppercase' }}>{bank.source}</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: '-0.02em' }}>
                              <Box component="span" sx={{ fontSize: '0.75em', color: 'text.secondary', mr: 0.5 }}>Bs.</Box>
                              {(bank.rate?.average || 0).toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Full width bank list for the bottom space */}
                {marketData?.banks?.length > 10 && (
                  <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>
                      Otras Entidades Bancarias
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }, 
                      gap: 1.5 
                    }}>
                      {marketData?.banks?.slice(10, 30).map((bank: any) => (
                        <Box key={bank.source} sx={{ 
                          p: 1.5, 
                          borderRadius: 3, 
                          bgcolor: alpha(theme.palette.text.primary, 0.01), 
                          border: `1px solid ${alpha(theme.palette.divider, 0.03)}`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.text.primary, 0.03),
                            borderColor: alpha(theme.palette.primary.main, 0.08),
                          }
                        }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', fontSize: '0.5rem', mb: 0.3, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bank.source}</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.85rem' }}>
                            <Box component="span" sx={{ fontSize: '0.75em', color: 'text.secondary', mr: 0.5 }}>Bs.</Box>
                            {(bank.rate?.average || 0).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </MarketCard>
            </Box>

            {/* 2. Divisas Fronterizas (span 4) */}
            <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
              <MarketCard 
                icon={LanguageIcon} 
                title="Divisas Fronterizas" 
                subtitle="Tasas Regionales P2P"
                color="#9C27B0"
                loading={loading}
              >
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                  {marketData?.border?.map((fiat: any, idx: number) => {
                    const isRateObject = typeof fiat.rate === 'object' && fiat.rate !== null;
                    const currentAverage = isRateObject 
                      ? (fiat.rate.average || (fiat.rate.buy + fiat.rate.sell) / 2) 
                      : (fiat.rate || 0);
                    
                    const isChangeObject = typeof fiat.change === 'object' && fiat.change !== null;
                    const avgPercent = isChangeObject 
                      ? (fiat.change.average?.percent || 0)
                      : (typeof fiat.change === 'number' ? fiat.change : 0);
                    
                    const direction = isChangeObject 
                      ? (fiat.change.average?.direction || 'stable')
                      : (avgPercent > 0 ? 'up' : 'down');
                    
                    return (
                      <MarketRow 
                        key={`${fiat.currency}-${idx}`}
                        label={`${fiat.currency}/VES`}
                        value={Number(currentAverage).toFixed(4)}
                        change={`${avgPercent >= 0 ? '+' : ''}${Number(avgPercent).toFixed(2)}`}
                        isUp={direction === 'up'}
                        sublabel={fiat.source}
                        compact
                      />
                    );
                  })}
                </Box>
              </MarketCard>
            </Box>

            {/* 3. Bolsa de Valores (span 4) */}
            <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
              <MarketCard 
                icon={ShowChartIcon} 
                title="Bolsa de Valores" 
                subtitle="Top Acciones BVC"
                color="#00FF94"
                loading={loading}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.6rem' }}>Instrumento</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => handleBvcPageChange(bvcPage - 1)} disabled={bvcPage <= 1 || loading} sx={{ p: 0.2 }}>
                      <NavigateBeforeIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.6rem' }}>{bvcPage}</Typography>
                    <IconButton size="small" onClick={() => handleBvcPageChange(bvcPage + 1)} disabled={(marketData?.bvcMeta?.pages && bvcPage >= marketData.bvcMeta.pages) || loading} sx={{ p: 0.2 }}>
                      <NavigateNextIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                  {marketData?.bvc?.map((quote: any, idx: number) => (
                    <MarketRow 
                      key={idx}
                      label={quote.symbol}
                      value={Number(quote.price || 0).toFixed(2)}
                      change={`${quote.change?.percent >= 0 ? '+' : ''}${Number(quote.change?.percent || 0).toFixed(2)}%`}
                      isUp={quote.change?.direction === 'up'}
                      sublabel={quote.name}
                      compact
                    />
                  ))}
                </Box>
              </MarketCard>
            </Box>

            {/* 4. Ecosistema Cripto (span 12) */}
            <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 12' }, mt: 2 }}>
              <MarketCard 
                icon={CurrencyBitcoinIcon} 
                title="Ecosistema Cripto" 
                subtitle="Indicadores Globales & P2P"
                color="#F7931A"
                loading={loading}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, mt: -2 }}>
                   <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                     P2P & Market Caps • Real-time Feeds
                   </Typography>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', ml: 2 }}>
                        {['BTC', 'ETH', 'USDT'].map((coin, i) => (
                          <Box key={coin} sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            border: `2px solid ${theme.palette.background.paper}`,
                            bgcolor: coin === 'BTC' ? '#F7931A' : coin === 'ETH' ? '#627EEA' : '#26A17B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.6rem',
                            fontWeight: 900,
                            color: 'white',
                            ml: i === 0 ? 0 : -1.5,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                          }}>
                            {coin[0]}
                          </Box>
                        ))}
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          border: `2px solid ${theme.palette.background.paper}`,
                          bgcolor: 'grey.800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6rem',
                          fontWeight: 900,
                          color: 'white',
                          ml: -1.5,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }}>
                          +8
                        </Box>
                      </Box>
                      <Button variant="outlined" size="small" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', px: 2 }}>
                        Explorar Pares
                      </Button>
                   </Box>
                </Box>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
                  gap: 3 
                }}>
                  {marketData?.crypto?.slice(0, 4).map((coin: any, index: number) => {
                    const isRateObject = typeof coin.rate === 'object' && coin.rate !== null;
                    const currentPrice = isRateObject 
                      ? (coin.rate.average || coin.rate.buy || coin.rate.sell || 0) 
                      : (coin.rate || 0);
                    
                    const isChangeObject = typeof coin.change === 'object' && coin.change !== null;
                    const avgPercent = isChangeObject 
                      ? (coin.change.average?.percent || 0)
                      : (typeof coin.change === 'number' ? coin.change : 0);
                      
                    const direction = isChangeObject 
                      ? (coin.change.average?.direction || 'stable')
                      : (avgPercent > 0 ? 'up' : 'down');

                    return (
                      <CryptoTile
                        key={index}
                        label={coin.currency}
                        value={coin.currency === 'BTC' ? `$${Number(currentPrice).toLocaleString()}` : Number(currentPrice).toFixed(2)}
                        change={Number(avgPercent).toFixed(2)}
                        isUp={direction === 'up'}
                        color="#F7931A"
                      />
                    );
                  })}
                </Box>
              </MarketCard>
            </Box>
          </Box>
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
