import React from 'react';
import { fetchMarketData } from '@/lib/vtrading-api';
import { normalizeMarketData } from '@/app/actions/market';
import MercadosContent from './MercadosContent';

export default async function MercadosPage() {
  // Fetch initial data on the server
  const initialBvcLimit = 6;
  const rawData = await fetchMarketData(1, initialBvcLimit);
  const initialData = await normalizeMarketData(rawData);

  return <MercadosContent initialData={initialData} />;
}
