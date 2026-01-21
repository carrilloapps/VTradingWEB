'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, useTheme, alpha, Chip } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';

interface TickerItemProps {
  symbol: string;
  type?: 'COMPRA' | 'VENTA';
  value: string;
  trend?: 'up' | 'down' | 'stable';
}

const TickerItem = ({ symbol, type, value, trend }: TickerItemProps) => {
  const theme = useTheme();
  
  const getIcon = () => {
    if (trend === 'down') return <ArrowDropDownIcon fontSize="small" sx={{ color: theme.palette.trendDown }} />;
    if (trend === 'up') return <ArrowDropUpIcon fontSize="small" sx={{ color: theme.palette.trendUp }} />;
    return <RemoveIcon fontSize="small" sx={{ color: 'text.secondary', transform: 'scale(0.7)' }} />;
  };

  const getBadgeColor = () => {
    // Accessible Blue for BUY
    if (type === 'COMPRA') return { 
      bg: alpha('#1976D2', 0.1), 
      color: theme.palette.mode === 'dark' ? '#64B5F6' : '#1565C0', 
      border: theme.palette.mode === 'dark' ? '#64B5F6' : '#1565C0' 
    };
    // Accessible Orange for SELL
    if (type === 'VENTA') return { 
      bg: alpha('#ED6C02', 0.1), 
      color: theme.palette.mode === 'dark' ? '#FFB74D' : '#E65100', 
      border: theme.palette.mode === 'dark' ? '#FFB74D' : '#E65100' 
    };
    return { bg: 'transparent', color: 'text.secondary', border: 'transparent' };
  };

  const badgeStyle = getBadgeColor();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, whiteSpace: 'nowrap' }}>
      <Typography 
        variant="caption" 
        sx={{ 
          fontFamily: 'monospace', 
          color: 'text.primary', // Improved contrast
          fontWeight: 'bold',
          fontSize: '0.9rem', // Increased size
          textTransform: 'uppercase'
        }}
      >
        {symbol}
      </Typography>

      {type && (
        <Chip
          label={type}
          size="small"
          sx={{ 
            height: 22, // Slightly taller
            fontSize: '0.75rem', // Increased size
            fontWeight: 'bold',
            fontFamily: 'monospace',
            bgcolor: badgeStyle.bg,
            color: badgeStyle.color,
            border: `1px solid ${alpha(badgeStyle.border, 0.3)}`,
            '& .MuiChip-label': { px: 1 }
          }}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            fontFamily: 'monospace', 
            color: trend === 'down' ? theme.palette.trendDown : (trend === 'up' ? theme.palette.trendUp : 'text.primary'),
            fontWeight: 'bold',
            fontSize: '0.9rem', // Increased size
            mr: 0.5
          }}
        >
          {value}
        </Typography>
        {getIcon()}
      </Box>
    </Box>
  );
};

export default function MarketTicker({ items }: { items?: any[] }) {
  const theme = useTheme();
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const speedRef = useRef<number>(0.5); // Base speed
  
  const displayItems = items || [];

  const animate = useCallback(() => {
    if (!isDragging && contentRef.current) {
      setOffset(prev => {
        const contentWidth = contentRef.current?.offsetWidth || 0;
        const halfWidth = contentWidth / 2;
        let newOffset = prev - speedRef.current;
        
        // Reset when first set moves out of view
        if (Math.abs(newOffset) >= halfWidth) {
          newOffset = 0;
        }
        return newOffset;
      });
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isDragging]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    lastXRef.current = clientX;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const delta = clientX - lastXRef.current;
    lastXRef.current = clientX;

    setOffset(prev => {
      const contentWidth = contentRef.current?.offsetWidth || 0;
      const halfWidth = contentWidth / 2;
      let newOffset = prev + delta;
      
      // Allow dragging back and forth seamlessly
      if (newOffset > 0) newOffset = -halfWidth;
      if (Math.abs(newOffset) >= halfWidth) newOffset = 0;
      
      return newOffset;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (displayItems.length === 0) return null;

  return (
    <Box 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      sx={{ 
        width: '100%', 
        bgcolor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 1.5,
        overflow: 'hidden',
        position: 'fixed',
        top: 80, // Navbar height
        zIndex: 90,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
    >
      <Box 
        ref={contentRef}
        sx={{ 
          display: 'flex', 
          width: 'fit-content',
          transform: `translateX(${offset}px)`,
          willChange: 'transform',
        }}
      >
        {/* Render twice for seamless loop */}
        {[...displayItems, ...displayItems].map((item, index) => (
          <Box key={index} sx={{ px: 4, display: 'inline-block' }}>
            <TickerItem 
              symbol={item.symbol || item.label} 
              type={item.type} 
              value={item.value} 
              trend={item.trend as any} 
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
