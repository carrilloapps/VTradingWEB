'use client';

import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ManifestoSection from '@/components/home/ManifestoSection';
import { useMarketData } from '@/context/MarketContext';

export default function HomeContent() {
  const { marketData, loading } = useMarketData();

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
