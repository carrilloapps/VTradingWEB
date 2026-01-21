'use client';

import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

interface RateCardProps {
  title: string;
  icon: React.ReactNode;
  data: {
    general: { price: string; change: string; trend: 'up' | 'down' | 'stable' };
    buy: { price: string; change: string; trend: 'up' | 'down' | 'stable' };
    sell: { price: string; change: string; trend: 'up' | 'down' | 'stable' };
  };
  chartColor?: string;
  gradient?: string;
}

const RateCard = ({ title, icon, data, chartColor = '#00FF94', gradient }: RateCardProps) => {
  const theme = useTheme();

  // Helper for trend color matching the RN code logic
  const getTrendColor = (percent: string) => {
    if (!percent || percent.includes('0.00') || percent === '0%') return 'rgba(255, 255, 255, 0.5)';
    return percent.includes('-') ? '#FF4444' : '#00FF94';
  };

  const formatPrice = (price: string) => {
    const parts = price.split(',');
    return (
      <>
        {parts[0]}<Typography component="span" sx={{ fontSize: '0.7em' }}>,{parts[1]}</Typography>
      </>
    );
  };

  // Helper to parse percentage string to number
  const parsePercentage = (percentStr: string): number => {
    if (!percentStr) return 0;
    // Remove % and replace comma with dot if needed, though usually format is 0.80% or -1.20%
    // Assuming format like "0.80%" or "-1.20%" or "0,80%"
    const cleanStr = percentStr.replace('%', '').replace(',', '.');
    const val = parseFloat(cleanStr);
    return isNaN(val) ? 0 : val;
  };

  // Dynamic path generation logic adapted from mobile version
  const getChartPath = (percentStr: string) => {
    const percent = parsePercentage(percentStr);

    // If practically zero, flat line
    if (Math.abs(percent) < 0.001) return 'M0 25 L 300 25';
    
    // Dynamic curve intensity based on percentage
    // We amplify small percentages to make them visible
    // 0.5% is treated as "high intensity" (1.0) for visual purposes
    const scaleFactor = 200; // Multiplier: 0.005 * 200 = 1.0
    const intensity = Math.min(Math.abs(percent / 100) * scaleFactor, 1.0); // divide by 100 because input is like 0.80 not 0.0080
    
    // Base amplitude (how far from center Y=25)
    // Min deviation 4 (flat-ish), Max 22 (steep, keeping within 50px height padding)
    const minAmp = 4;
    const maxAmp = 22;
    const amplitude = minAmp + ((maxAmp - minAmp) * intensity);
    const center = 25;
    
    if (percent > 0) {
        // Up Trend: Start Low (Y > 25), End High (Y < 25)
        const startY = center + amplitude;
        const endY = center - amplitude;
        // Bezier control points for smooth S-curve, scaled for width 300
        // Original: M0 startY C 40 startY, 60 endY, 100 endY
        // Scaled x3: M0 startY C 120 startY, 180 endY, 300 endY
        return `M0 ${startY} C 120 ${startY}, 180 ${endY}, 300 ${endY}`; 
    } else {
        // Down Trend: Start High (Y < 25), End Low (Y > 25)
        const startY = center - amplitude;
        const endY = center + amplitude;
        return `M0 ${startY} C 120 ${startY}, 180 ${endY}, 300 ${endY}`;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 4, // Approx theme.roundness * 6
        mb: 2,
        background: gradient || `linear-gradient(135deg, #0e4981 0%, #0b3a67 50%, #082f54 100%)`, // Matches RN colors
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)', // theme.colors.exchangeCardBorder approx
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      {/* Background Blur Effect Circle */}
      <Box sx={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: '50%',
        bgcolor: 'rgba(255,255,255,0.05)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Main Layout: Icon Left, Content Right */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        
        {/* Icon Container */}
        <Box sx={{ 
          width: 40, 
          height: 40, 
          borderRadius: 2.5, // rounded-xl approx
          bgcolor: 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mr: 1.5,
          flexShrink: 0,
        }}>
           {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { sx: { fontSize: 24, color: '#FFFFFF' } }) : icon}
        </Box>

        {/* Right Content Column */}
        <Box sx={{ flexGrow: 1 }}>
            
            {/* Title */}
            <Typography variant="caption" sx={{ 
                display: 'block', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px', 
                fontSize: '0.75rem',
                mb: 0.5,
                color: 'rgba(255, 255, 255, 1)'
            }}>
                {title}
            </Typography>

            {/* Values Container (3 Columns) */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: -0.8 }}>
                
                {/* General - Column 1 */}
                <Box sx={{ pr: 1.5, borderRight: '1px solid rgba(255,255,255,0.2)', mr: 1.5 }}>
                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', mb: 0.2 }}>GENERAL</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1, fontSize: '1rem', color: '#FFFFFF' }}>
                          {formatPrice(data.general.price)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 0.5, fontSize: '0.65rem' }}>Bs</Typography>
                    </Box>
                     <Typography variant="caption" sx={{ color: getTrendColor(data.general.change), fontWeight: 700, fontSize: '0.7rem' }}>
                        {data.general.change}
                    </Typography>
                </Box>

                 {/* Compra - Column 2 */}
                <Box sx={{ pr: 1.5, borderRight: '1px solid rgba(255,255,255,0.2)', mr: 1.5 }}>
                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', mb: 0.2 }}>COMPRA</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1, fontSize: '1rem', color: '#FFFFFF' }}>
                          {formatPrice(data.buy.price)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 0.5, fontSize: '0.65rem' }}>Bs</Typography>
                    </Box>
                     <Typography variant="caption" sx={{ color: getTrendColor(data.buy.change), fontWeight: 700, fontSize: '0.7rem' }}>
                        {data.buy.change}
                    </Typography>
                </Box>

                 {/* Venta - Column 3 */}
                <Box>
                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', mb: 0.2 }}>VENTA</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1, fontSize: '1rem', color: '#FFFFFF' }}>
                          {formatPrice(data.sell.price)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 0.5, fontSize: '0.65rem' }}>Bs</Typography>
                    </Box>
                     <Typography variant="caption" sx={{ color: getTrendColor(data.sell.change), fontWeight: 700, fontSize: '0.7rem' }}>
                        {data.sell.change}
                    </Typography>
                </Box>

            </Box>
        </Box>
      </Box>

      {/* Chart Decoration (Bottom) */}
      <Box sx={{ height: 50, mt: 1, position: 'relative', zIndex: 0, opacity: 0.9 }}>
        <svg width="100%" height="100%" viewBox="0 0 300 50" preserveAspectRatio="none">
             {/* General/Average Line (Dashed) */}
             <path 
               d={getChartPath(data.general.change)} 
               fill="none" 
               stroke={getTrendColor(data.general.change)}
               strokeWidth="3" 
               strokeDasharray="10,8" 
               strokeLinecap="round" 
             />
             {/* Buy Line */}
             <path 
               d={getChartPath(data.buy.change)} 
               fill="none" 
               stroke={getTrendColor(data.buy.change)} 
               strokeWidth="2" 
               strokeLinecap="round" 
             />
             {/* Sell Line */}
             <path 
               d={getChartPath(data.sell.change)} 
               fill="none" 
               stroke={getTrendColor(data.sell.change)} 
               strokeWidth="2" 
               strokeLinecap="round" 
             />
          </svg>
      </Box>
    </Paper>
  );
};

export default RateCard;
