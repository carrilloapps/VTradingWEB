'use client';

import React from 'react';
import { Box, Paper, Typography, CircularProgress, useTheme, alpha, Grow } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import RateCard from './RateCard';
import StockListCard from './StockListCard';

interface PhoneMockupProps {
  marketData: any;
  loading: boolean;
}

const PhoneMockup = ({ marketData, loading }: PhoneMockupProps) => {
  const theme = useTheme();

  const { state, lastUpdate } = marketData?.status || { state: 'CERRADO', lastUpdate: null };
  const isMarketOpen = state === 'ABIERTO';
  
  // Format date if needed, assuming ISO or similar.
  const formatTime = (dateStr: string | null | undefined) => {
    if (!dateStr || dateStr === '...') return '...';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return new Intl.DateTimeFormat('es-VE', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
    } catch (e) {
        console.error('Date formatting error:', e);
        return dateStr || '...';
    }
  };

  const displayTime = formatTime(lastUpdate);

  // Extract BCV Data from API
  const rates = Array.isArray(marketData?.rates) ? marketData.rates : (marketData?.rates?.rates || []);
  const bcvRate = rates.find((r: any) => r.currency === 'USD' && r.source === 'BCV');

  const fmt = (num: number) => num?.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00';
  const fmtPct = (num: number) => `${(num || 0).toFixed(2)}%`;

  const getGeneralData = (item: any) => {
    // Safety check: ensure item and item.rate exist
    if (!item?.rate) {
        return { price: '0,00', change: '0.00%', trend: 'stable' as const };
    }

    const rate = item.rate;
    const change = item.change || {};

    // Calculate Average Price
    const avgPrice = typeof rate === 'number' 
        ? rate 
        : (rate.average || ((rate.buy || 0) + (rate.sell || 0)) / 2);

    // Calculate Average Change
    let avgChange = 0;
    if (typeof change === 'number') {
        avgChange = change;
    } else {
        avgChange = change.average?.percent !== undefined 
            ? change.average.percent 
            : ((change.buy?.percent || 0) + (change.sell?.percent || 0)) / 2;
    }
    
    // Determine Trend
    let trend = typeof change === 'object' ? change.average?.direction : undefined;
    if (!trend) {
        if (avgChange > 0) trend = 'up';
        else if (avgChange < 0) trend = 'down';
        else trend = 'stable';
    }
    
    return {
        price: fmt(avgPrice),
        change: fmtPct(avgChange),
        trend: trend as 'up' | 'down' | 'stable'
    };
  };

  const bcvData = bcvRate ? {
      general: getGeneralData(bcvRate),
      buy: { 
          price: fmt(bcvRate.rate?.buy), 
          change: fmtPct(bcvRate.change?.buy?.percent), 
          trend: (bcvRate.change?.buy?.direction || 'stable') as 'up' | 'down' | 'stable'
      },
      sell: { 
          price: fmt(bcvRate.rate?.sell), 
          change: fmtPct(bcvRate.change?.sell?.percent), 
          trend: (bcvRate.change?.sell?.direction || 'stable') as 'up' | 'down' | 'stable'
      }
  } : {
      general: { price: '0,00', change: '0.00%', trend: 'stable' as const },
      buy: { price: '0,00', change: '0.00%', trend: 'stable' as const },
      sell: { price: '0,00', change: '0.00%', trend: 'stable' as const }
  };
  
  const cryptoList = Array.isArray(marketData?.crypto) ? marketData.crypto : (marketData?.rates?.crypto || []);
  // Find first crypto with valid rate structure (summary) or fallback to first item
  const firstCrypto = cryptoList.find((c: any) => c.rate && (c.rate.average || c.rate.buy || c.rate.sell)) || (cryptoList.length > 0 ? cryptoList[0] : null);

  const cryptoData = firstCrypto ? {
      general: getGeneralData(firstCrypto),
      buy: { 
          price: fmt(firstCrypto.rate?.buy), 
          change: fmtPct(firstCrypto.change?.buy?.percent), 
          trend: (firstCrypto.change?.buy?.direction || 'stable') as 'up' | 'down' | 'stable'
      },
      sell: { 
          price: fmt(firstCrypto.rate?.sell), 
          change: fmtPct(firstCrypto.change?.sell?.percent), 
          trend: (firstCrypto.change?.sell?.direction || 'stable') as 'up' | 'down' | 'stable'
      }
  } : {
      general: { price: '0,00', change: '0.00%', trend: 'stable' as const },
      buy: { price: '0,00', change: '0.00%', trend: 'stable' as const },
      sell: { price: '0,00', change: '0.00%', trend: 'stable' as const }
  };
  
  const bvcQuotes = Array.isArray(marketData?.bvc) ? marketData.bvc : [];
  // Take first 2 items for the mockup
  const stockItems = bvcQuotes.slice(0, 2).map((quote: any) => {
    const percent = quote.change?.percent || 0;
    let trend = quote.change?.direction;
    
    // Ensure trend matches the sign of the percentage
    if (percent < 0) trend = 'down';
    else if (percent > 0) trend = 'up';
    else trend = 'stable';

    return {
      symbol: quote.symbol,
      name: quote.name,
      price: `${fmt(quote.price)} Bs`,
      change: fmtPct(percent),
      trend: trend as 'up' | 'down' | 'stable',
      logo: quote.meta?.iconUrl || quote.image
    };
  });

  // Debug log
  React.useEffect(() => {
    if (marketData?.status) {
      console.log('PhoneMockup marketData.status:', marketData.status);
    } else {
      console.log('PhoneMockup marketData.status is missing', marketData);
    }
  }, [marketData]);

  const isDark = theme.palette.mode === 'dark';
  
  // Colors based on the provided palette
  const mockColors = {
    bg: isDark ? '#191C1A' : '#FBFDF9',
    frame: isDark ? '#2A302D' : '#E0E6E2',
    text: isDark ? '#E2E3DF' : '#191C1A',
    textSecondary: isDark ? '#C0C9C2' : '#404944',
    trendUp: isDark ? '#6DDBAC' : '#168953',
    trendDown: isDark ? '#FFB4AB' : '#D32F2F',
    primary: isDark ? '#6DDBAC' : '#006C4C',
  };

  const statusColor = isMarketOpen ? mockColors.trendUp : mockColors.trendDown;
  const statusBg = isMarketOpen ? alpha(mockColors.trendUp, 0.1) : alpha(mockColors.trendDown, 0.1);

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
            border: `12px solid ${mockColors.frame}`,
            bgcolor: mockColors.bg,
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)'
          }}
        >
          {/* Mockup Content */}
          <Box sx={{ p: 2.5, position: 'relative', height: '100%', overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
            {loading && (
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(mockColors.bg, 0.8), zIndex: 10 }}>
                <CircularProgress size={24} color="primary" />
              </Box>
            )}
            
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pt: 1 }}>
              <Box sx={{ 
                border: `1px solid ${statusColor}`, 
                borderRadius: 5, 
                px: 1, 
                py: 0.3,
                bgcolor: statusBg
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <FiberManualRecordIcon sx={{ fontSize: 8, color: statusColor }} />
                  <Typography variant="caption" sx={{ color: statusColor, fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                    MERCADO {state}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: mockColors.textSecondary, fontSize: '0.65rem' }}>
                  Actualizado: {displayTime}
                </Typography>
                <RefreshIcon sx={{ color: mockColors.textSecondary, fontSize: 14 }} />
              </Box>
            </Box>
            
            {/* Rate Cards - Now matching RN ExchangeCard style */}
            <Box sx={{ mb: 2 }}>
              <RateCard 
                title="USD/VES • BCV"
                icon={<AttachMoneyIcon />}
                data={bcvData}
                // Gradient is now handled internally by RateCard to match code.txt
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <RateCard 
                title={firstCrypto ? `${firstCrypto.currency} • ${firstCrypto.source}` : "Tether • P2P"}
                icon={<ShowChartIcon />}
                data={cryptoData}
                // Gradient is now handled internally by RateCard to match code.txt
              />
            </Box>
            
            <StockListCard items={stockItems} />
            
          </Box>
        </Paper>
        {/* Decorative Blobs */}
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, bgcolor: alpha(mockColors.primary, 0.2), borderRadius: '50%', filter: 'blur(60px)', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, bgcolor: alpha(mockColors.trendUp, 0.1), borderRadius: '50%', filter: 'blur(60px)', zIndex: 1 }} />
      </Box>
    </Grow>
  );
};

export default PhoneMockup;
