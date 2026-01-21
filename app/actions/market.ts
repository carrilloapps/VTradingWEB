'use server';

import { fetchMarketData, getRatesHistory } from '@/lib/vtrading-api';

/**
 * Server Action to fetch historical market data.
 */
export async function getMarketHistoryAction(page = 1, limit = 30) {
  try {
    const rawHistory = await getRatesHistory(page, limit);
    console.log('DEBUG: rawHistory structure:', JSON.stringify(rawHistory).substring(0, 200));
    
    // API might return { data: [...] }, { history: [...] }, { rates: [...] }, or just [...]
    let historyArray: any[] = [];
    if (Array.isArray(rawHistory)) {
      historyArray = rawHistory;
    } else if (rawHistory && typeof rawHistory === 'object') {
      // Look for any array property
      const arrayProp = Object.values(rawHistory).find(val => Array.isArray(val));
      if (arrayProp) {
        historyArray = arrayProp as any[];
      } else if (rawHistory.data && Array.isArray(rawHistory.data)) {
        historyArray = rawHistory.data;
      } else if (rawHistory.history && Array.isArray(rawHistory.history)) {
        historyArray = rawHistory.history;
      } else if (rawHistory.rates && Array.isArray(rawHistory.rates)) {
        historyArray = rawHistory.rates;
      }
    }

    if (historyArray.length === 0) {
      console.log('DEBUG: No array found in rawHistory keys:', Object.keys(rawHistory || {}));
      return [];
    }

    // Process and normalize history data
    return historyArray.map((entry: any) => {
      // API might return price directly or inside a rate object
      let rawPrice = 0;
      
      if (typeof entry === 'number') {
        rawPrice = entry;
      } else if (typeof entry === 'object' && entry !== null) {
        if (entry.rate && typeof entry.rate === 'object') {
          rawPrice = entry.rate.average || entry.rate.buy || entry.rate.sell || 0;
        } else if (entry.rate && (typeof entry.rate === 'number' || typeof entry.rate === 'string')) {
          rawPrice = Number(entry.rate);
        } else if (entry.average) {
          rawPrice = Number(entry.average);
        } else if (entry.price) {
          rawPrice = Number(entry.price);
        } else if (entry.rate_average) {
          rawPrice = Number(entry.rate_average);
        } else if (entry.value) {
          rawPrice = Number(entry.value);
        }
      }
      
      const price = Number(rawPrice) || 0;
      const buy = Number(entry.rate?.buy || entry.buy || 0) || 0;
      const sell = Number(entry.rate?.sell || entry.sell || 0) || 0;
      
      return {
        date: entry.createdAt || entry.date || entry.timestamp || new Date().toISOString(),
        price,
        buy,
        sell
      };
    }).filter((entry: any) => entry.price > 0) // Filter out invalid entries
    .reverse(); // Reverse to have chronological order (oldest to newest)
  } catch (error) {
    console.error('Error in getMarketHistoryAction:', error);
    return [];
  }
}

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
    bvcMeta: bvcMeta,
    status: data.rates?.status || data.status || null
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
