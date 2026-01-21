'use client';

import React, { useEffect, useState } from 'react';
import { getMarketDataAction } from '@/app/actions/market';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import MarketTicker from '@/components/MarketTicker';
import Footer from '@/components/Footer';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ManifestoSection from '@/components/home/ManifestoSection';
import { CurrencyRate } from '@/lib/vtrading-types';

export default function HomeContent({ initialData }: { initialData: any }) {
  const [marketData, setMarketData] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData);

  // Derive ticker items from marketData
  const getTickerItems = (data: any) => {
    if (!data) return null;
    const marketcap = data.rates;
    const items: { label: string; value: string; trend: 'up' | 'down' | 'neutral' }[] = [
      // Rates
      ...marketcap.rates.map((r: any) => ({
        label: `${r.currency}/VES`,
        value: (r.rate.average || 0).toFixed(2),
        trend: r.change.average?.direction === 'up' ? 'up' : 'down'
      })) || [],
      // Border
      ...marketcap.border.map((r: any) => ({
        label: `${r.currency}/VES (COMPRA)`,
        value: (r.rate.buy || 0).toFixed(2),
        trend: r.change.buy?.direction === 'up' ? 'up' : 'down'
      })) || [],
      ...marketcap.border.map((r: any) => ({
        label: `${r.currency}/VES (VENTA)`,
        value: (r.rate.sell || 0).toFixed(2),
        trend: r.change.sell?.direction === 'up' ? 'up' : 'down'
      })) || [],
      // Cripto
      ...marketcap.crypto.map((r: any) => ({
        label: `${r.currency}/VES (COMPRA)`,
        value: (r.rate.buy || 0).toFixed(2),  
        trend: r.change.buy?.direction === 'up' ? 'up' : 'down'
      })) || [],
      ...marketcap.crypto.map((r: any) => ({
        label: `${r.currency}/VES (COMPRA)`,
        value: (r.rate.buy || 0).toFixed(2),  
        trend: r.change.buy?.direction === 'up' ? 'up' : 'down'
      })) || [],
      ...marketcap.crypto.map((r: any) => ({
        label: `${r.currency}/VES (VENTA)`,
        value: (r.rate.sell || 0).toFixed(2),  
        trend: r.change.sell?.direction === 'up' ? 'up' : 'down'
      })) || []
    ];
    
    return items.length > 0 ? items : null;
  };

  const tickerItems = getTickerItems(marketData);

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', { page_title: 'Home' });
    }

    if (!initialData) {
      const fetchMarketData = async () => {
        try {
          const data = await getMarketDataAction();
          setMarketData(data);
        } catch (error) {
          console.error('Error fetching market data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMarketData();
    }

    const interval = setInterval(async () => {
      try {
        const data = await getMarketDataAction();
        setMarketData(data);
      } catch (error) {
        console.error('Error refreshing market data:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [initialData]);

  const handleDownloadClick = (platform: string) => {
    if (analytics) {
      logEvent(analytics, 'download_click', { platform });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      <MarketTicker initialItems={tickerItems || undefined} />

      <HeroSection 
        marketData={marketData} 
        loading={loading} 
        onDownload={handleDownloadClick} 
      />

      <FeaturesSection />

      <ManifestoSection />

      <Footer />

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 255, 148, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 255, 148, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 255, 148, 0); }
        }
      `}</style>
    </Box>
  );
}
