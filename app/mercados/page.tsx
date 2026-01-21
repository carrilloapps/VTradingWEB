import React from 'react';
import { fetchMarketData } from '@/lib/vtrading-api';
import MercadosContent from './MercadosContent';

export default async function MercadosPage() {
  // Fetch initial data on the server
  const initialData = await fetchMarketData();

  return <MercadosContent initialData={initialData} />;
}
