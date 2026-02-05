'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, useTheme, alpha, Chip, IconButton } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useMarketData } from '@/context/MarketContext';
import { RatesResponse } from '@/lib/vtrading-types';

interface TickerItemProps {
  symbol: string;
  type?: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

const TickerItem = ({ symbol, type, value, trend }: TickerItemProps) => {
  const theme = useTheme();

  const getIcon = () => {
    if (trend === 'down')
      return <ArrowDropDownIcon fontSize="small" sx={{ color: theme.palette.trendDown }} />;
    if (trend === 'up')
      return <ArrowDropUpIcon fontSize="small" sx={{ color: theme.palette.trendUp }} />;
    return (
      <RemoveIcon fontSize="small" sx={{ color: 'text.secondary', transform: 'scale(0.7)' }} />
    );
  };

  const getBadgeColor = () => {
    // Accessible Blue for BUY
    if (type === 'COMPRA')
      return {
        bg: alpha('#1976D2', 0.1),
        color: theme.palette.mode === 'dark' ? '#64B5F6' : '#1565C0',
        border: theme.palette.mode === 'dark' ? '#64B5F6' : '#1565C0',
      };
    // Accessible Orange for SELL
    if (type === 'VENTA')
      return {
        bg: alpha('#ED6C02', 0.1),
        color: theme.palette.mode === 'dark' ? '#FFB74D' : '#E65100',
        border: theme.palette.mode === 'dark' ? '#FFB74D' : '#E65100',
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
          textTransform: 'uppercase',
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
            '& .MuiChip-label': { px: 1 },
          }}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            color:
              trend === 'down'
                ? theme.palette.trendDown
                : trend === 'up'
                  ? theme.palette.trendUp
                  : 'text.primary',
            fontWeight: 'bold',
            fontSize: '0.9rem', // Increased size
            mr: 0.5,
          }}
        >
          {value}
        </Typography>
        {getIcon()}
      </Box>
    </Box>
  );
};

export default function MarketTicker({
  items,
  hide,
  onClose,
  fadeEdges,
}: {
  items?: TickerItemProps[];
  hide?: boolean;
  onClose?: () => void;
  fadeEdges?: boolean;
}) {
  const theme = useTheme();
  const { marketData } = useMarketData();
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const speedRef = useRef<number>(0.5); // Base speed

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Derive ticker items if not provided
  const getTickerItems = (data: RatesResponse | null) => {
    if (!data) return null;

    // Support both raw (nested) and normalized (flat) structures
    // The type definition says rates is CurrencyRate[], but runtime might be different if not careful.
    // Assuming data follows RatesResponse interface:
    const rates = data.rates || [];
    const border = data.border || [];
    const crypto = data.crypto || [];

    const formatCurrency = (val: number | undefined) => {
      return (val || 0)
        .toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const getTrend = (direction: string | undefined) => {
      if (direction === 'up') return 'up';
      if (direction === 'down') return 'down';
      return 'stable';
    };

    const generatedItems: {
      symbol: string;
      type?: 'COMPRA' | 'VENTA';
      value: string;
      trend: 'up' | 'down' | 'stable';
    }[] = [
      ...(rates.map((r) => {
        // Handle potentially different structures if API is inconsistent, but try to stick to types
        const rateVal = typeof r.rate === 'number' ? r.rate : r.rate?.average;
        const changeDir = typeof r.change === 'number' ? undefined : r.change?.average?.direction;

        return {
          symbol: `${r.currency}/VES`,
          value: formatCurrency(rateVal),
          trend: getTrend(changeDir) as 'up' | 'down' | 'stable',
        };
      }) || []),
      ...(border.map((r) => {
        const rateBuy = typeof r.rate === 'number' ? r.rate : r.rate?.buy;
        const changeDir = typeof r.change === 'number' ? undefined : r.change?.buy?.direction;

        return {
          symbol: `${r.currency}/VES`,
          type: 'COMPRA' as const,
          value: formatCurrency(rateBuy),
          trend: getTrend(changeDir) as 'up' | 'down' | 'stable',
        };
      }) || []),
      ...(border.map((r) => {
        const rateSell = typeof r.rate === 'number' ? r.rate : r.rate?.sell;
        const changeDir = typeof r.change === 'number' ? undefined : r.change?.sell?.direction;

        return {
          symbol: `${r.currency}/VES`,
          type: 'VENTA' as const,
          value: formatCurrency(rateSell),
          trend: getTrend(changeDir) as 'up' | 'down' | 'stable',
        };
      }) || []),
      ...(crypto.map((r) => {
        const rateBuy = typeof r.rate === 'number' ? r.rate : r.rate?.buy;
        const changeDir = typeof r.change === 'number' ? undefined : r.change?.buy?.direction;

        return {
          symbol: `${r.currency}/VES`,
          type: 'COMPRA' as const,
          value: formatCurrency(rateBuy),
          trend: getTrend(changeDir) as 'up' | 'down' | 'stable',
        };
      }) || []),
      ...(crypto.map((r) => {
        const rateSell = typeof r.rate === 'number' ? r.rate : r.rate?.sell;
        const changeDir = typeof r.change === 'number' ? undefined : r.change?.sell?.direction;

        return {
          symbol: `${r.currency}/VES`,
          type: 'VENTA' as const,
          value: formatCurrency(rateSell),
          trend: getTrend(changeDir) as 'up' | 'down' | 'stable',
        };
      }) || []),
    ];

    return generatedItems.length > 0 ? generatedItems : null;
  };

  const displayItems = items || getTickerItems(marketData) || [];

  useEffect(() => {
    const animate = () => {
      if (!isDraggingRef.current && contentRef.current) {
        setOffset((prev) => {
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
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Empty dependency array, using refs for mutable state

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

    setOffset((prev) => {
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

  if (hide || displayItems.length === 0) return null;

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
        bgcolor: alpha(theme.palette.background.default, 0.9),
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 0.8,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 90,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          ...(fadeEdges && {
            maskImage:
              'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
          }),
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
                symbol={item.symbol}
                type={item.type}
                value={item.value}
                trend={item.trend as 'up' | 'down' | 'stable'}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {onClose && (
        <Box
          onMouseDown={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            pr: 1,
            pl: 4,
            background: `linear-gradient(to right, transparent, ${theme.palette.background.default} 30%)`,
            zIndex: 100,
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                bgcolor: alpha(theme.palette.text.primary, 0.05),
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
