'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { keyframes } from '@mui/system';

const tickerAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

interface TickerItemProps {
  label: string;
  value: string;
  trend?: 'up' | 'down';
}

const TickerItem = ({ label, value, trend }: TickerItemProps) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
      <Typography 
        variant="caption" 
        sx={{ 
          fontFamily: 'monospace', 
          color: 'text.secondary',
          fontWeight: 'bold',
          fontSize: '0.65rem',
          textTransform: 'uppercase'
        }}
      >
        {label}:
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          fontFamily: 'monospace', 
          color: trend === 'down' ? 'error.main' : 'trendUp',
          fontWeight: 'bold',
          fontSize: '0.65rem',
          textShadow: trend !== 'down' ? `0 0 10px ${alpha(theme.palette.trendUp || '#00FF94', 0.4)}` : 'none'
        }}
      >
        {value} {trend === 'down' ? '▼' : '▲'}
      </Typography>
    </Box>
  );
};

interface MarketTickerProps {
  initialItems?: any[];
}

import { getMarketDataAction } from '@/app/actions/market';

export default function MarketTicker({ initialItems }: MarketTickerProps) {
  const theme = useTheme();
  const [items, setItems] = useState(initialItems || [
    { label: 'USD/VES BCV', value: '...', trend: 'up' },
    { label: 'BTC/VES', value: '...', trend: 'up' },
    { label: 'USDT P2P', value: '...', trend: 'up' },
    { label: 'IBVC Index', value: '...', trend: 'down' },
    { label: 'USD/VES Parallel', value: '...', trend: 'up' },
  ]);

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const data = await getMarketDataAction();
        if (data) {
          const items = [];
          
          // BCV
          const rates = Array.isArray(data.rates) ? data.rates : [];
          const bcv = rates.find((r: any) => r.source === 'BCV' && r.currency === 'USD');
          if (bcv) {
            items.push({ 
              label: 'USD/VES', 
              value: (bcv.rate?.average || 0).toFixed(2), 
              trend: bcv.change?.average?.direction || 'stable'
            });
          }

          // Crypto USDT
          const crypto = Array.isArray(data.crypto) ? data.crypto : [];
          const usdt = crypto.find((r: any) => r.currency === 'USDT');
          if (usdt) {
            items.push({ 
              label: 'USDT', 
              value: (usdt.rate?.buy || 0).toFixed(2), 
              trend: usdt.change?.buy?.direction || 'stable'
            });
          }

          // BVC
          if (data.bvc?.summary) {
            items.push({ 
              label: 'IBVC Index', 
              value: (data.bvc.summary.index || 0).toLocaleString(), 
              trend: data.bvc.summary.change >= 0 ? 'up' : 'down' 
            });
          }

          if (items.length > 0) {
            setItems(items);
          }
        }
      } catch (error) {
        console.error('Error fetching ticker data:', error);
      }
    };

    if (!initialItems) {
      fetchTickerData();
    }
    
    const interval = setInterval(fetchTickerData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [initialItems]);

  return (
    <Box 
      sx={{ 
        width: '100%', 
        bgcolor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 1,
        overflow: 'hidden',
        position: 'fixed',
        top: 80, // Navbar height
        zIndex: 90,
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          width: 'fit-content',
          animation: `${tickerAnimation} 40s linear infinite`,
          '&:hover': {
            animationPlayState: 'paused',
          }
        }}
      >
        {/* Render twice for seamless loop */}
        {[...items, ...items].map((item, index) => (
          <Box key={index} sx={{ px: 6 }}>
            <TickerItem label={item.label} value={item.value} trend={item.trend as any} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
