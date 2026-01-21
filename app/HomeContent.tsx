'use client';

import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import MarketTicker from '@/components/MarketTicker';
import Footer from '@/components/Footer';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ManifestoSection from '@/components/home/ManifestoSection';
import { useMarketData } from '@/context/MarketContext';

export default function HomeContent() {
  const { marketData, loading } = useMarketData();

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

    const getTrend = (direction: string) => {
      if (direction === 'up') return 'up';
      if (direction === 'down') return 'down';
      return 'stable';
    };

    const items: { symbol: string; type?: 'COMPRA' | 'VENTA'; value: string; trend: 'up' | 'down' | 'stable' }[] = [
      // Rates
      ...rates.map((r: any) => ({
        symbol: `${r?.currency}/VES`,
        value: formatCurrency(r?.rate?.average),
        trend: getTrend(r?.change?.average?.direction)
      })) || [],
      // Border
      ...border.map((r: any) => ({
        symbol: `${r?.currency}/VES`,
        type: 'COMPRA',
        value: formatCurrency(r?.rate?.buy),
        trend: getTrend(r?.change?.buy?.direction)
      })) || [],
      ...border.map((r: any) => ({
        symbol: `${r?.currency}/VES`,
        type: 'VENTA',
        value: formatCurrency(r?.rate?.sell),
        trend: getTrend(r?.change?.sell?.direction)
      })) || [],
      // Cripto
      ...crypto.map((r: any) => ({
        symbol: `${r?.currency}/VES`,
        type: 'COMPRA',
        value: formatCurrency(r?.rate?.buy),  
        trend: getTrend(r?.change?.buy?.direction)
      })) || [],
      ...crypto.map((r: any) => ({
        symbol: `${r?.currency}/VES`,
        type: 'VENTA',
        value: formatCurrency(r?.rate?.sell),  
        trend: getTrend(r?.change?.sell?.direction)
      })) || []
    ];
    
    return items.length > 0 ? items : null;
  };

  const tickerItems = getTickerItems(marketData);

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', { page_title: 'Home' });
    }
  }, []);

  const handleDownloadClick = (platform: string) => {
    if (analytics) {
      logEvent(analytics, 'download_click', { platform });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      <MarketTicker items={tickerItems || undefined} />

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
