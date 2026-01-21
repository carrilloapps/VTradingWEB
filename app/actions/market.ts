'use server';

import { fetchMarketData } from '@/lib/vtrading-api';

/**
 * Normalizes the raw API response into a consistent format.
 * The API sometimes returns nested 'rates' or 'crypto' objects.
 */
export async function normalizeMarketData(data: any) {
  if (!data) return null;

  // Extract arrays safely
  const ratesArr = Array.isArray(data.rates) 
    ? data.rates 
    : (Array.isArray(data.rates?.rates) ? data.rates.rates : []);
    
  const banksArr = Array.isArray(data.rates?.banks) 
    ? data.rates.banks 
    : [];
    
  const borderArr = Array.isArray(data.rates?.border) 
    ? data.rates.border 
    : [];
    
  const cryptoArr = Array.isArray(data.crypto) 
    ? data.crypto 
    : (Array.isArray(data.crypto?.rates) ? data.crypto.rates : []);

  return {
    rates: ratesArr,
    banks: banksArr,
    border: borderArr,
    crypto: cryptoArr,
    bvc: Array.isArray(data.bvc) ? data.bvc : (Array.isArray(data.bvc?.data) ? data.bvc.data : data.bvc)
  };
}

/**
 * Server Action to fetch market data without exposing a public API endpoint.
 * This is used for client-side polling while keeping the requests "internal" to Next.js.
 */
export async function getMarketDataAction() {
  try {
    const rawData = await fetchMarketData();
    const data = await normalizeMarketData(rawData);
    
    if (!data) throw new Error('No data received from API');

    return data;
  } catch (error) {
    console.error('Error in getMarketDataAction:', error);
    throw new Error('Failed to fetch market data');
  }
}
