'use client';

import React from 'react';
import { Box, Paper, Typography, CircularProgress, useTheme, alpha, Grow } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import WifiIcon from '@mui/icons-material/Wifi';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import RateCard from './RateCard';
import StockListCard from './StockListCard';
import { CurrencyRate, BVCQuote, RateValue, RateChange, RatesResponse } from '@/lib/vtrading-types';
import { logger } from '@/lib/logger';

interface PhoneMockupProps {
  marketData: RatesResponse | null;
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
      return new Intl.DateTimeFormat('es-VE', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(date);
    } catch (e) {
      logger.error('Date formatting error in PhoneMockup', e);
      return dateStr || '...';
    }
  };

  // Track when the data was last received (client-side timestamp)
  const [lastFetchTime, setLastFetchTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (marketData) {
      setLastFetchTime(new Date().toISOString());
    }
  }, [marketData]);

  const displayTime = formatTime(lastFetchTime || lastUpdate);

  // Extract BCV Data from API
  const rates = marketData && Array.isArray(marketData.rates) ? marketData.rates : [];
  const bcvRate = rates.find((r) => r.currency === 'USD' && r.source === 'BCV');

  const fmt = (num: number) =>
    num?.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00';
  const fmtPct = (num: number) => `${(num || 0).toFixed(2)}%`;

  const getGeneralData = (item: CurrencyRate) => {
    if (!item?.rate) {
      return { price: '0,00', change: '0.00%', trend: 'stable' as const };
    }

    const rate = item.rate;
    const change = item.change;

    const avgPrice = typeof rate === 'number' ? rate : rate.average || ((rate.buy || 0) + (rate.sell || 0)) / 2;

    let avgChange = 0;
    if (typeof change === 'number') {
      avgChange = change;
    } else if (change) {
      const changeObj = change as RateChange;
      avgChange = changeObj.average?.percent !== undefined
        ? changeObj.average.percent
        : ((changeObj.buy?.percent || 0) + (changeObj.sell?.percent || 0)) / 2;
    }

    let trend = typeof change === 'object' && change ? (change as RateChange).average?.direction : undefined;
    if (!trend) {
      if (avgChange > 0) trend = 'up';
      else if (avgChange < 0) trend = 'down';
      else trend = 'stable';
    }

    return {
      price: fmt(avgPrice),
      change: fmtPct(avgChange),
      trend: trend as 'up' | 'down' | 'stable',
    };
  };

  const bcvData = bcvRate
    ? {
      general: getGeneralData(bcvRate),
      buy: {
        price: fmt((bcvRate.rate as RateValue)?.buy),
        change: fmtPct((bcvRate.change as RateChange)?.buy?.percent ?? 0),
        trend: ((bcvRate.change as RateChange)?.buy?.direction || 'stable') as 'up' | 'down' | 'stable',
      },
      sell: {
        price: fmt((bcvRate.rate as RateValue)?.sell),
        change: fmtPct((bcvRate.change as RateChange)?.sell?.percent ?? 0),
        trend: ((bcvRate.change as RateChange)?.sell?.direction || 'stable') as 'up' | 'down' | 'stable',
      },
    }
    : {
      general: { price: '0,00', change: '0.00%', trend: 'stable' as const },
      buy: { price: '0,00', change: '0.00%', trend: 'stable' as const },
      sell: { price: '0,00', change: '0.00%', trend: 'stable' as const },
    };

  const cryptoList = (Array.isArray(marketData?.crypto) ? marketData.crypto : []) || [];
  const firstCrypto = cryptoList.find((c: CurrencyRate) => c.rate && ((c.rate as RateValue).average || (c.rate as RateValue).buy || (c.rate as RateValue).sell)) || (cryptoList.length > 0 ? cryptoList[0] : null);

  const cryptoData = firstCrypto
    ? {
      general: getGeneralData(firstCrypto),
      buy: {
        price: fmt((firstCrypto.rate as RateValue)?.buy),
        change: fmtPct((firstCrypto.change as RateChange)?.buy?.percent ?? 0),
        trend: ((firstCrypto.change as RateChange)?.buy?.direction || 'stable') as 'up' | 'down' | 'stable',
      },
      sell: {
        price: fmt((firstCrypto.rate as RateValue)?.sell),
        change: fmtPct((firstCrypto.change as RateChange)?.sell?.percent ?? 0),
        trend: ((firstCrypto.change as RateChange)?.sell?.direction || 'stable') as 'up' | 'down' | 'stable',
      },
    }
    : {
      general: { price: '0,00', change: '0.00%', trend: 'stable' as const },
      buy: { price: '0,00', change: '0.00%', trend: 'stable' as const },
      sell: { price: '0,00', change: '0.00%', trend: 'stable' as const },
    };

  const bvcQuotes = Array.isArray(marketData?.bvc) ? marketData.bvc : [];
  const stockItems = bvcQuotes.slice(0, 3).map((quote: BVCQuote) => {
    const percent = quote.change?.percent || 0;
    let trend = quote.change?.direction;
    if (percent < 0) trend = 'down';
    else if (percent > 0) trend = 'up';
    else trend = 'stable';

    return {
      symbol: quote.symbol,
      name: quote.name,
      price: `${fmt(quote.price)} Bs`,
      change: fmtPct(percent),
      trend: trend as 'up' | 'down' | 'stable',
      logo: quote.meta?.iconUrl || quote.image,
    };
  });

  const isDark = theme.palette.mode === 'dark';

  const mockColors = {
    bg: isDark ? '#191C1A' : '#FBFDF9',
    frame: isDark ? '#2A302D' : '#E0E6E2',
    text: isDark ? '#FFFFFF' : '#191C1A',
    textSecondary: isDark ? '#C0C9C2' : '#404944',
    trendUp: isDark ? '#6DDBAC' : '#168953',
    trendDown: isDark ? '#FFB4AB' : '#D32F2F',
    primary: isDark ? '#6DDBAC' : '#006C4C',
  };

  const statusColor = isMarketOpen ? mockColors.trendUp : mockColors.trendDown;
  const statusBg = isMarketOpen ? alpha(mockColors.trendUp, 0.1) : alpha(mockColors.trendDown, 0.1);

  const [currentTime, setCurrentTime] = React.useState('9:41 AM');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Caracas',
      }).format(now);
      setCurrentTime(timeString);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const BASE_WIDTH = 340;
  const BASE_HEIGHT = 700;

  const scalingStyles = {
    xs: 0.75,
    sm: 0.85,
    md: 0.9,
    lg: 1,
  };

  return (
    <Grow in timeout={1500}>
      <Box
        sx={{
          position: 'relative',
          mx: 'auto',
          width: {
            xs: BASE_WIDTH * scalingStyles.xs,
            sm: BASE_WIDTH * scalingStyles.sm,
            md: BASE_WIDTH * scalingStyles.md,
            lg: BASE_WIDTH * scalingStyles.lg,
          },
          height: {
            xs: BASE_HEIGHT * scalingStyles.xs,
            sm: BASE_HEIGHT * scalingStyles.sm,
            md: BASE_HEIGHT * scalingStyles.md,
            lg: BASE_HEIGHT * scalingStyles.lg,
          },
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            transform: {
              xs: `scale(${scalingStyles.xs})`,
              sm: `scale(${scalingStyles.sm})`,
              md: `scale(${scalingStyles.md})`,
              lg: `scale(${scalingStyles.lg})`,
            },
            transformOrigin: 'center center',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'absolute',
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
          }}
        >
          {/* Physical Buttons */}
          <Box sx={{ position: 'absolute', right: -3, top: 100, width: 4, height: 40, bgcolor: isDark ? '#4A504D' : '#C0C9C2', borderTopRightRadius: 2, borderBottomRightRadius: 2, zIndex: 1, boxShadow: '-1px 0 2px rgba(0,0,0,0.2)' }} />
          <Box sx={{ position: 'absolute', right: -3, top: 150, width: 4, height: 70, bgcolor: isDark ? '#4A504D' : '#C0C9C2', borderTopRightRadius: 2, borderBottomRightRadius: 2, zIndex: 1, boxShadow: '-1px 0 2px rgba(0,0,0,0.2)' }} />

          <Paper
            elevation={24}
            sx={{
              width: BASE_WIDTH,
              height: BASE_HEIGHT,
              borderRadius: '42px',
              border: `10px solid ${mockColors.frame}`,
              bgcolor: mockColors.bg,
              overflow: 'hidden',
              position: 'relative',
              zIndex: 2,
              boxShadow: `0 50px 100px -20px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.1)`,
            }}
          >
            {/* Status Bar */}
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 20,
                right: 20,
                height: 24,
                zIndex: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pointerEvents: 'none',
                color: isDark ? '#fff' : '#191C1A',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.02em' }}>
                {currentTime}
              </Typography>
              <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, bgcolor: '#101010', borderRadius: '50%', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)' }} />
              <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
                <SignalCellularAltIcon sx={{ fontSize: 16 }} />
                <WifiIcon sx={{ fontSize: 16 }} />
                <BatteryFullIcon sx={{ fontSize: 16 }} />
              </Box>
            </Box>

            {/* Content Container */}
            <Box
              sx={{
                p: 2.5,
                pt: 5,
                position: 'relative',
                height: '100%',
                overflowY: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
              }}
            >
              {loading && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(mockColors.bg, 0.8), zIndex: 10 }}>
                  <CircularProgress size={24} color="primary" />
                </Box>
              )}

              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pt: 1 }}>
                <Box sx={{ border: `1px solid ${statusColor}`, borderRadius: 5, px: 1, py: 0.3, bgcolor: statusBg }}>
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

              {/* Cards */}
              <Box sx={{ mb: 2 }}>
                <RateCard title="USD/VES • BCV" icon={<AttachMoneyIcon />} data={bcvData} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <RateCard title={firstCrypto ? `${firstCrypto.currency} • ${firstCrypto.source}` : 'Tether • P2P'} icon={<ShowChartIcon />} data={cryptoData} />
              </Box>
              <StockListCard items={stockItems} />
            </Box>

            {/* Home Indicator */}
            <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', width: 108, height: 4, bgcolor: isDark ? '#ffffff' : '#191C1A', borderRadius: 4, opacity: 0.4, zIndex: 20, pointerEvents: 'none' }} />
          </Paper>

          {/* Blobs */}
          <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, bgcolor: alpha(mockColors.primary, 0.2), borderRadius: '50%', filter: 'blur(60px)', zIndex: 1 }} />
          <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, bgcolor: alpha(mockColors.trendUp, 0.1), borderRadius: '50%', filter: 'blur(60px)', zIndex: 1 }} />
        </Box>
      </Box>
    </Grow>
  );
};

export default PhoneMockup;
