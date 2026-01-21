'use client';

import React from 'react';
import { Box, Paper, Typography, useTheme, Avatar } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';

interface StockItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  logo?: string;
}

interface StockListCardProps {
  items?: StockItem[];
}

const StockListCard = ({ items }: StockListCardProps) => {
  const theme = useTheme();

  const defaultItems: StockItem[] = [
    { symbol: 'ABC.A', name: 'BCO. CARIBE A', price: '900,00 Bs', change: '↘ -9.09%', trend: 'down' },
    { symbol: 'ALZ.B', name: 'ALALZA INV. B', price: '37,00 Bs', change: '= 0.00%', trend: 'neutral' },
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>Mercado Bursátil</Typography>
        <Typography variant="caption" sx={{ color: '#00FF94', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          VER TODO
        </Typography>
      </Box>

      {displayItems.map((item, index) => (
        <Paper 
          key={index}
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 1.5, 
            borderRadius: 4, 
            bgcolor: '#1A1A1A', 
            display: 'flex', 
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              mr: 2, 
              bgcolor: 'background.paper', 
              color: 'text.primary',
              fontSize: '0.8rem',
              fontWeight: 800
            }}
          >
            {item.logo ? <img src={item.logo} alt={item.symbol} style={{ width: '100%' }} /> : item.symbol.substring(0, 2)}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{item.symbol}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>
              {item.name}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
              {item.price}
            </Typography>
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              bgcolor: item.trend === 'down' ? 'rgba(255, 68, 68, 0.1)' : item.trend === 'up' ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255,255,255,0.1)',
              px: 0.8,
              py: 0.2,
              borderRadius: 1,
              mt: 0.5
            }}>
              <Typography variant="caption" sx={{ 
                color: item.trend === 'down' ? '#FF4444' : item.trend === 'up' ? '#00FF94' : 'rgba(255,255,255,0.6)', 
                fontWeight: 700, 
                fontSize: '0.65rem' 
              }}>
                {item.change}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default StockListCard;
