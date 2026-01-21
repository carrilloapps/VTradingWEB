'use client';

import React from 'react';
import { Box, Paper, Typography, CircularProgress, useTheme, alpha, Grow } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import RateCard from './RateCard';
import StockListCard from './StockListCard';

interface PhoneMockupProps {
  marketData: any;
  loading: boolean;
}

const PhoneMockup = ({ marketData, loading }: PhoneMockupProps) => {
  const theme = useTheme();

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pt: 1 }}>
              <Box sx={{ 
                border: '1px solid #FF8A80', 
                borderRadius: 5, 
                px: 1.5, 
                py: 0.5,
                bgcolor: 'rgba(255, 138, 128, 0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#FF8A80' }} />
                  <Typography variant="caption" sx={{ color: '#FF8A80', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                    MERCADO CERRADO
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
                  Actualizado: 3:35 p. m.
                </Typography>
                <RefreshIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }} />
              </Box>
            </Box>
            
            {/* Rate Cards */}
            <RateCard 
              title="USD/VES • BCV"
              icon={<AttachMoneyIcon />}
              data={{
                general: { price: '347,26', change: '0.80%', trend: 'up' },
                buy: { price: '358,81', change: '0.00%', trend: 'neutral' },
                sell: { price: '356,61', change: '0.00%', trend: 'neutral' }
              }}
              gradient="linear-gradient(180deg, #003366 0%, #001a33 100%)"
              chartColor="#00FF94"
            />

            <RateCard 
              title="TETHER • P2P"
              icon={<CurrencyExchangeIcon />}
              data={{
                general: { price: '464,09', change: '0.01%', trend: 'up' },
                buy: { price: '463,45', change: '+0.04%', trend: 'up' },
                sell: { price: '464,72', change: '-0.02%', trend: 'down' }
              }}
              gradient="linear-gradient(180deg, #003366 0%, #001a33 100%)"
              chartColor="#FF4444"
            />
            
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
