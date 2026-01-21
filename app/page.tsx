import React from 'react';
import { getMarketDataAction } from '@/app/actions/market';
import HomeContent from './HomeContent';

export default async function Home() {
  // Fetch initial data on the server
  const initialData = await getMarketDataAction();
  
  return <HomeContent initialData={initialData} />;
}
