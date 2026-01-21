import React from 'react';
import { fetchMarketData } from '@/lib/vtrading-api';
import HomeContent from './HomeContent';

export default async function Home() {
  // Fetch initial data on the server
  const initialData = await fetchMarketData();
  
  return <HomeContent initialData={initialData} />;
}
