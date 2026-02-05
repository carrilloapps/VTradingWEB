'use client';

import React from 'react';
import { Box, Paper, Typography, useTheme, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

import Link from 'next/link';

interface StockItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  logo?: string;
}

interface StockListCardProps {
  items?: StockItem[];
}

const StockListCard = ({ items }: StockListCardProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const colors = {
    text: isDark ? '#FFFFFF' : '#191C1A',
    textSecondary: isDark ? 'rgba(226, 227, 223, 0.6)' : 'rgba(25, 28, 26, 0.6)',
    cardBg: isDark ? '#191C1A' : '#FFFFFF',
    cardBorder: isDark ? '#2A302D' : '#E0E6E2',
    trendUp: isDark ? '#6DDBAC' : '#168953',
    trendDown: isDark ? '#FFB4AB' : '#D32F2F',
    trendUpBg: isDark ? 'rgba(109, 219, 172, 0.1)' : 'rgba(22, 137, 83, 0.1)',
    trendDownBg: isDark ? 'rgba(255, 180, 171, 0.1)' : 'rgba(211, 47, 47, 0.1)',
    neutralBg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  };

  // If no items are provided, show empty state or nothing
  if (!items || items.length === 0) {
    return null;
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ fontSize: 12, mr: 0.5 }} />;
      case 'down':
        return <TrendingDownIcon sx={{ fontSize: 12, mr: 0.5 }} />;
      default:
        return <TrendingFlatIcon sx={{ fontSize: 12, mr: 0.5 }} />;
    }
  };

  return (
    <Box sx={{ mt: 2.5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
          px: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 800, color: colors.text, fontSize: '0.9rem', letterSpacing: '0.02em' }}
        >
          Mercado Bursátil
        </Typography>
        <Link href="/cuenta" passHref style={{ textDecoration: 'none' }}>
          <Typography
            variant="caption"
            sx={{
              color: colors.trendUp,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.65rem',
              letterSpacing: '0.05em',
            }}
          >
            VER TODO
          </Typography>
        </Link>
      </Box>

      {items.map((item, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            p: 1.5,
            mb: 1,
            borderRadius: 3,
            bgcolor: colors.cardBg,
            display: 'flex',
            alignItems: 'center',
            border: `1px solid ${colors.cardBorder}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              mr: 1.5,
              bgcolor: 'background.paper',
              color: 'text.primary',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
            src={item.logo}
          >
            {!item.logo && item.symbol.substring(0, 2)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: colors.text,
                lineHeight: 1.2,
                fontSize: '0.85rem',
                letterSpacing: '0.02em',
              }}
            >
              {item.symbol}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colors.textSecondary,
                fontSize: '0.6rem',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {item.name}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: colors.text, lineHeight: 1.2, fontSize: '0.85rem' }}
            >
              {item.price}
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                bgcolor:
                  item.trend === 'down'
                    ? colors.trendDownBg
                    : item.trend === 'up'
                      ? colors.trendUpBg
                      : colors.neutralBg,
                px: 0.8,
                py: 0.2,
                borderRadius: 1,
                mt: 0.3,
              }}
            >
              <Box
                sx={{
                  color:
                    item.trend === 'down'
                      ? colors.trendDown
                      : item.trend === 'up'
                        ? colors.trendUp
                        : colors.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {getTrendIcon(item.trend)}
                <Typography
                  variant="caption"
                  sx={{
                    color: 'inherit',
                    fontWeight: 700,
                    fontSize: '0.6rem',
                  }}
                >
                  {item.change}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default StockListCard;
