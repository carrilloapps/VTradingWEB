'use client';

import React from 'react';
import { Box, Paper, Typography, CircularProgress, useTheme, alpha, Grow } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import RateCard from './RateCard';
import StockListCard from './StockListCard';

interface PhoneMockupProps {
  marketData: any;
  loading: boolean;
}

const PhoneMockup = ({ marketData, loading }: PhoneMockupProps) => {
  const theme = useTheme();

  const { state, lastUpdate } = marketData?.status || { state: 'CERRADO', lastUpdate: null };
  const isMarketOpen = state === 'ABIERTO';
  
  // Format date if needed, assuming ISO or similar.
  const formatTime = (dateStr: string | null | undefined) => {
    if (!dateStr || dateStr === '...') return '...';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return new Intl.DateTimeFormat('es-VE', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
    } catch (e) {
        console.error('Date formatting error:', e);
        return dateStr || '...';
    }
  };

  const displayTime = formatTime(lastUpdate);
  
  // Debug log
  React.useEffect(() => {
    if (marketData?.status) {
      console.log('PhoneMockup marketData.status:', marketData.status);
    } else {
      console.log('PhoneMockup marketData.status is missing', marketData);
    }
  }, [marketData]);

  const statusColor = isMarketOpen ? '#00FF94' : '#FF8A80';
  const statusBg = isMarketOpen ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255, 138, 128, 0.1)';

  return (
    <Grow in timeout={1500}>
      <Box sx={{ position: 'relative' }}>
        <Paper
          elevation={24}
          sx={{
            width: 360,
            height: 720,
            mx: 0,
            borderRadius: 12,
            border: `12px solid ${theme.palette.mode === 'dark' ? '#1A1A1A' : '#E0E0E0'}`,
            bgcolor: '#121212', // Force dark background as per image
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)'
          }}
        >
          {/* Mockup Content */}
          <Box sx={{ p: 2.5, position: 'relative', height: '100%', overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
            {loading && (
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#121212', 0.8), zIndex: 10 }}>
                <CircularProgress size={24} color="primary" />
              </Box>
            )}
            
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pt: 1 }}>
              <Box sx={{ 
                border: `1px solid ${statusColor}`, 
                borderRadius: 5, 
                px: 1, 
                py: 0.3,
                bgcolor: statusBg
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <FiberManualRecordIcon sx={{ fontSize: 8, color: statusColor }} />
                  <Typography variant="caption" sx={{ color: statusColor, fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                    MERCADO {state}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
                  Actualizado: {displayTime}
                </Typography>
                <RefreshIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }} />
              </Box>
            </Box>
            
            {/* Rate Cards - Now matching RN ExchangeCard style */}
            <Box sx={{ mb: 2 }}>
              <RateCard 
                title="USD/VES • BCV"
                icon={<AttachMoneyIcon />}
                data={{
                  general: { price: '347,26', change: '0.80%', trend: 'up' },
                  buy: { price: '358,81', change: '0.00%', trend: 'neutral' },
                  sell: { price: '356,61', change: '0.00%', trend: 'neutral' }
                }}
                // Gradient is now handled internally by RateCard to match code.txt
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <RateCard 
                title="Tether • P2P"
                icon={<ShowChartIcon />}
                data={{
                  general: { price: '380,50', change: '-1.20%', trend: 'down' },
                  buy: { price: '378,00', change: '-0.50%', trend: 'down' },
                  sell: { price: '383,00', change: '-1.50%', trend: 'down' }
                }}
                // Gradient is now handled internally by RateCard to match code.txt
              />
            </Box>
            
            <StockListCard />
            
          </Box>
        </Paper>
        {/* Decorative Blobs */}
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, bgcolor: alpha(theme.palette.primary.main, 0.2), borderRadius: '50%', filter: 'blur(60px)', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, bgcolor: alpha(theme.palette.trendUp || '#00FF94', 0.1), borderRadius: '50%', filter: 'blur(60px)', zIndex: 1 }} />
      </Box>
    </Grow>
  );
};

export default PhoneMockup;
