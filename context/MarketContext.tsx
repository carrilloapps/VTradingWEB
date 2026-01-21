'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMarketDataAction } from '@/app/actions/market';
import { RatesResponse } from '@/lib/vtrading-types';

interface MarketContextType {
  marketData: RatesResponse | null;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

interface MarketProviderProps {
  children: ReactNode;
  initialData: RatesResponse | null;
}

export const MarketProvider: React.FC<MarketProviderProps> = ({ children, initialData }) => {
  const [marketData, setMarketData] = useState<RatesResponse | null>(initialData);
  const [loading, setLoading] = useState(!initialData);

  const refreshData = async () => {
    try {
      const data = await getMarketDataAction();
      
      // Validate data before updating state to prevent UI blanking
      // We check if rates exist and is a non-empty array
      if (data && data.rates && (Array.isArray(data.rates) && data.rates.length > 0)) {
        setMarketData(data);
      } else {
        console.warn('Global MarketContext: Received empty or invalid market data during refresh, keeping previous data.');
      }
    } catch (error) {
      console.error('Global MarketContext: Error refreshing market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Refresh every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      refreshData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MarketContext.Provider value={{ marketData, loading, refreshData }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarketData = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketProvider');
  }
  return context;
};
