'use client';

import { Box, Typography, useTheme, alpha, Chip } from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';

const tickerAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

interface TickerItemProps {
  symbol: string;
  type?: 'COMPRA' | 'VENTA';
  value: string;
  trend?: 'up' | 'down' | 'stable';
}

const TickerItem = ({ symbol, type, value, trend }: TickerItemProps) => {
  const theme = useTheme();
  
  const getIcon = () => {
    if (trend === 'down') return <ArrowDropDownIcon fontSize="small" color="error" />;
    if (trend === 'up') return <ArrowDropUpIcon fontSize="small" sx={{ color: 'trendUp' }} />;
    return <RemoveIcon fontSize="small" sx={{ color: 'text.secondary', transform: 'scale(0.7)' }} />;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, whiteSpace: 'nowrap' }}>
      <Typography 
        variant="caption" 
        sx={{ 
          fontFamily: 'monospace', 
          color: 'text.secondary',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          textTransform: 'uppercase'
        }}
      >
        {symbol}
      </Typography>

      {type && (
        <Chip
          label={type}
          size="small"
          variant="filled"
          color={type === 'COMPRA' ? 'info' : 'warning'}
          sx={{ 
            height: 20, 
            fontSize: '0.7rem', 
            fontWeight: 'bold',
            fontFamily: 'monospace',
            '& .MuiChip-label': { px: 1 }
          }}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            fontFamily: 'monospace', 
            color: trend === 'down' ? 'error.main' : (trend === 'up' ? 'trendUp' : 'text.primary'),
            fontWeight: 'bold',
            fontSize: '0.85rem',
            textShadow: trend === 'up' ? `0 0 10px ${alpha(theme.palette.trendUp || '#00FF94', 0.4)}` : 'none',
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
  
  const displayItems = items || [];

  if (displayItems.length === 0) return null;

  // Adjust duration based on item count to maintain readable speed
  // Base duration 60s, add 8s per item
  const duration = Math.max(60, displayItems.length * 8);

  return (
    <Box 
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
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          width: 'fit-content',
          animation: `${tickerAnimation} ${duration}s linear infinite`,
          '&:hover': {
            animationPlayState: 'paused',
          }
        }}
      >
        {/* Render twice for seamless loop */}
        {[...displayItems, ...displayItems].map((item, index) => (
          <Box key={index} sx={{ px: 8 }}>
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
