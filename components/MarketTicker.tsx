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

export default function MarketTicker() {
  const theme = useTheme();
  
  const items = [
    { label: 'USD/VES BCV', value: '36.42', trend: 'up' },
    { label: 'BTC/VES', value: '2,415,920.00', trend: 'up' },
    { label: 'USDT P2P', value: '42.15', trend: 'up' },
    { label: 'IBVC Index', value: '92,450.21', trend: 'down' },
    { label: 'USD/VES Parallel', value: '41.98', trend: 'up' },
  ];

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
