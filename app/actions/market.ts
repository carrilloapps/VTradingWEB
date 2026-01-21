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
    : (Array.isArray(data.rates?.rates) ? data.rates.rates : (Array.isArray(data.rates?.data) ? data.rates.data : []));
    
  const banksArr = Array.isArray(data.rates?.banks) 
    ? data.rates.banks 
    : (Array.isArray(data.banks) ? data.banks : []);
    
  const borderArr = Array.isArray(data.rates?.border) 
    ? data.rates.border 
    : (Array.isArray(data.border) ? data.border : []);
    
  // Extract crypto safely from multiple possible locations
  const cryptoData = data.crypto;
  const ratesCryptoData = data.rates?.crypto;
  
  let cryptoArr: any = [];
  
  const processCrypto = (source: any) => {
    if (!source) return;
    
    if (Array.isArray(source)) {
      source.forEach(item => {
        if (item) cryptoArr.push(item);
      });
    } else if (typeof source === 'object') {
      if (Array.isArray(source.crypto)) {
        source.crypto.forEach((item: any) => cryptoArr.push(item));
      } else if (Array.isArray(source.rates)) {
        source.rates.forEach((item: any) => cryptoArr.push(item));
      } else if (Array.isArray(source.data)) {
        source.data.forEach((item: any) => cryptoArr.push(item));
      } else {
        // Objeto de objetos (monedas como claves)
        Object.entries(source).forEach(([key, val]: [string, any]) => {
          if (Array.isArray(val)) {
            val.forEach((item: any) => {
              cryptoArr.push({ ...item, currency: item.currency || key });
            });
          } else if (val && typeof val === 'object') {
            cryptoArr.push({ ...val, currency: val.currency || key });
          }
        });
      }
    }
  };

  processCrypto(cryptoData);
  processCrypto(ratesCryptoData);

  // Remove duplicates by currency and source
  const seen = new Set();
  cryptoArr = cryptoArr.filter((item: any) => {
    if (!item || !item.currency) return false;
    const key = `${item.currency}-${item.source || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const bvcData = data.bvc;
  let bvcNormalized: any = [];
  let bvcMeta: any = null;

  if (Array.isArray(bvcData)) {
    bvcNormalized = bvcData;
  } else if (bvcData && typeof bvcData === 'object') {
    if (Array.isArray(bvcData.data)) {
      bvcNormalized = bvcData.data;
      bvcMeta = bvcData.meta || bvcData.pagination || null;
    } else if (Array.isArray(bvcData.quotes)) {
      bvcNormalized = bvcData.quotes;
      bvcMeta = bvcData.meta || bvcData.pagination || null;
    } else {
      bvcNormalized = bvcData;
    }
  }

  return {
    rates: ratesArr,
    banks: banksArr,
    border: borderArr,
    crypto: cryptoArr,
    bvc: bvcNormalized,
    bvcMeta: bvcMeta
  };
}

/**
 * Server Action to fetch market data without exposing a public API endpoint.
 * This is used for client-side polling while keeping the requests "internal" to Next.js.
 */
export async function getMarketDataAction(bvcPage = 1, bvcLimit = 30) {
  try {
    const rawData = await fetchMarketData(bvcPage, bvcLimit);
    console.log('--- DEBUG MARKET DATA ---');
    console.log('Crypto data structure keys:', Object.keys(rawData.crypto || {}));
    if (rawData.crypto && !Array.isArray(rawData.crypto)) {
      console.log('Crypto keys:', Object.keys(rawData.crypto));
    }
    const data = await normalizeMarketData(rawData);
    
    if (!data) throw new Error('No data received from API');

    return data;
  } catch (error) {
    console.error('Error in getMarketDataAction:', error);
    throw new Error('Failed to fetch market data');
  }
}
