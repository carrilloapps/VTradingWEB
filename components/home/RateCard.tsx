'use client';

import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

interface RateCardProps {
  title: string;
  icon: React.ReactNode;
  data: {
    general: { price: string; change: string; trend: 'up' | 'down' | 'neutral' };
    buy: { price: string; change: string; trend: 'up' | 'down' | 'neutral' };
    sell: { price: string; change: string; trend: 'up' | 'down' | 'neutral' };
  };
  chartColor?: string;
  gradient?: string;
}

const RateCard = ({ title, icon, data, chartColor = '#00FF94', gradient }: RateCardProps) => {
  const theme = useTheme();

  const formatPrice = (price: string) => {
    const parts = price.split(',');
    return (
      <>
        {parts[0]}<Typography component="span" sx={{ fontSize: '0.75em' }}>,{parts[1]}</Typography>
      </>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 5,
        mb: 2,
        background: gradient || `linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Left Icon - Large */}
        <Box sx={{ 
          width: 52, 
          height: 52, 
          borderRadius: '50%', 
          bgcolor: '#00FF94', 
          color: '#003366', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mr: 2,
          flexShrink: 0,
          mt: 0.5,
          boxShadow: '0 4px 12px rgba(0,255,148,0.3)'
        }}>
           {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: 32, color: '#003366' } }) : icon}
        </Box>

        {/* Right Content */}
        <Box sx={{ flexGrow: 1, zIndex: 1 }}>
            {/* Header Title */}
            <Typography variant="caption" sx={{ 
                display: 'block', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                fontSize: '0.75rem',
                mb: 1.5,
                opacity: 0.9,
                color: 'white'
            }}>
                {title}
            </Typography>

            {/* 3 Columns Grid */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                
                {/* General - Column 1 */}
                <Box sx={{ pr: 1.5, borderRight: '1px solid rgba(255,255,255,0.15)', mr: 1.5, minWidth: 80 }}>
                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.6rem', opacity: 0.8, mb: 0.5, letterSpacing: '0.05em' }}>GENERAL</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', mb: 0.5, fontSize: '1.1rem' }}>
                        {formatPrice(data.general.price)}
                        <Typography component="span" variant="caption" sx={{ opacity: 0.7, fontSize: '0.6rem', ml: 0.3, verticalAlign: 'top', position: 'relative', top: 3 }}>Bs</Typography>
                    </Typography>
                     <Typography variant="caption" sx={{ color: '#00FF94', fontWeight: 700, fontSize: '0.7rem' }}>
                        {data.general.change}
                    </Typography>
                </Box>

                 {/* Compra - Column 2 */}
                <Box sx={{ pr: 1.5, borderRight: '1px solid rgba(255,255,255,0.15)', mr: 1.5, minWidth: 80 }}>
                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.6rem', opacity: 0.8, mb: 0.5, letterSpacing: '0.05em' }}>COMPRA</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', mb: 0.5, fontSize: '1.1rem' }}>
                        {formatPrice(data.buy.price)}
                        <Typography component="span" variant="caption" sx={{ opacity: 0.7, fontSize: '0.6rem', ml: 0.3, verticalAlign: 'top', position: 'relative', top: 3 }}>Bs</Typography>
                    </Typography>
                     <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.7rem' }}>
                        {data.buy.change}
                    </Typography>
                </Box>

                 {/* Venta - Column 3 */}
                <Box sx={{ minWidth: 80 }}>
                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.6rem', opacity: 0.8, mb: 0.5, letterSpacing: '0.05em' }}>VENTA</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', mb: 0.5, fontSize: '1.1rem' }}>
                         {formatPrice(data.sell.price)}
                        <Typography component="span" variant="caption" sx={{ opacity: 0.7, fontSize: '0.6rem', ml: 0.3, verticalAlign: 'top', position: 'relative', top: 3 }}>Bs</Typography>
                    </Typography>
                     <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.7rem' }}>
                        {data.sell.change}
                    </Typography>
                </Box>

            </Box>
        </Box>
      </Box>

      {/* Chart Decoration */}
      <Box sx={{ position: 'absolute', bottom: 15, left: 0, right: 0, height: 40, opacity: 0.9, zIndex: 0, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 320 40" preserveAspectRatio="none">
           {/* Solid horizontal line */}
           <line x1="20" y1="28" x2="300" y2="28" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
           {/* Dashed wave line */}
           <path d="M20,35 Q90,35 160,20 T300,5" fill="none" stroke={chartColor} strokeWidth="3" strokeDasharray="8,5" strokeLinecap="round" />
        </svg>
      </Box>
    </Paper>
  );
};

export default RateCard;
