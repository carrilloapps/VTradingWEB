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
    
    // Support both raw (nested) and normalized (flat) structures
    // Raw: data.rates.rates array
    // Normalized: data.rates array
    const rates = Array.isArray(data.rates) ? data.rates : (data.rates?.rates || []);
    const border = Array.isArray(data.border) ? data.border : (data.rates?.border || []);
    const crypto = Array.isArray(data.crypto) ? data.crypto : (data.rates?.crypto || []);

    // Helper to format currency: 1.000,00
    const formatCurrency = (val: number) => {
      return (val || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const items: { label: string; value: string; trend: 'up' | 'down' | 'neutral' }[] = [
      // Rates
      ...rates.map((r: any) => ({
        label: `${r.currency}/VES`,
        value: formatCurrency(r.rate.average),
        trend: r.change.average?.direction === 'up' ? 'up' : 'down'
      })) || [],
      // Border
      ...border.map((r: any) => ({
        label: `${r.currency}/VES • COMPRA`,
        value: formatCurrency(r.rate.buy),
        trend: r.change.buy?.direction === 'up' ? 'up' : 'down'
      })) || [],
      ...border.map((r: any) => ({
        label: `${r.currency}/VES • VENTA`,
        value: formatCurrency(r.rate.sell),
        trend: r.change.sell?.direction === 'up' ? 'up' : 'down'
      })) || [],
      // Cripto
      ...crypto.map((r: any) => ({
        label: `${r.currency}/VES • COMPRA`,
        value: formatCurrency(r.rate.buy),  
        trend: r.change.buy?.direction === 'up' ? 'up' : 'down'
      })) || [],
      ...crypto.map((r: any) => ({
        label: `${r.currency}/VES • VENTA`,
        value: formatCurrency(r.rate.sell),  
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
