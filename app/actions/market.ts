'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchMarketData, getRatesHistory } from '@/lib/vtrading-api';
import { RatesResponse, CurrencyRate, BVCQuote } from '@/lib/vtrading-types';

/**
 * Server Action to fetch historical market data.
 */
export async function getMarketHistoryAction(page = 1, limit = 30) {
  try {
    const rawHistory = await getRatesHistory(page, limit);

    // API might return { data: [...] }, { history: [...] }, { rates: [...] }, or just [...]
    let historyArray: any[] = [];
    if (Array.isArray(rawHistory)) {
      historyArray = rawHistory;
    } else if (rawHistory && typeof rawHistory === 'object') {
      // Cast to any to access dynamic properties
      const rawObj = rawHistory as any;

      // Look for any array property
      const arrayProp = Object.values(rawObj).find(val => Array.isArray(val));
      if (arrayProp) {
        historyArray = arrayProp as any[];
      } else if (rawObj.data && Array.isArray(rawObj.data)) {
        historyArray = rawObj.data;
      } else if (rawObj.history && Array.isArray(rawObj.history)) {
        historyArray = rawObj.history;
      } else if (rawObj.rates && Array.isArray(rawObj.rates)) {
        historyArray = rawObj.rates;
      }
    }

    if (historyArray.length === 0) {
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
export async function normalizeMarketData(data: any): Promise<RatesResponse | null> {
  if (!data) return null;

  // Extract arrays safely
  const ratesArr: CurrencyRate[] = Array.isArray(data.rates)
    ? data.rates
    : (Array.isArray(data.rates?.rates) ? data.rates.rates : (Array.isArray(data.rates?.data) ? data.rates.data : []));

  const banksArr: CurrencyRate[] = Array.isArray(data.rates?.banks)
    ? data.rates.banks
    : (Array.isArray(data.banks) ? data.banks : []);

  const borderArr: CurrencyRate[] = Array.isArray(data.rates?.border)
    ? data.rates.border
    : (Array.isArray(data.border) ? data.border : []);

  // Extract crypto safely from multiple possible locations
  const cryptoData = data.crypto;
  const ratesCryptoData = data.rates?.crypto;

  let cryptoArr: CurrencyRate[] = [];

  const processCrypto = (source: any) => {
    if (!source) return;

    if (Array.isArray(source)) {
      source.forEach((item: any) => {
        if (item && typeof item === 'object') {
          cryptoArr.push(item as CurrencyRate);
        }
      });
    } else if (typeof source === 'object') {
      // Priority: Check nested arrays first (from different API versions/endpoints)
      const dataSources = [source.crypto, source.rates, source.data];
      const foundArray = dataSources.find(ds => Array.isArray(ds));

      if (foundArray) {
        foundArray.forEach((item: any) => {
          if (item) {
            // Tag P2P data if it's from the /api/crypto endpoint
            const isP2P = source.rates === foundArray;
            cryptoArr.push({ ...item, isP2P: item.isP2P ?? isP2P });
          }
        });
      } else {
        // Handle object of objects (currencies as keys)
        Object.entries(source).forEach(([key, val]: [string, any]) => {
          if (key === 'pagination' || key === 'meta' || key === 'status') return;

          if (Array.isArray(val)) {
            val.forEach((item: any) => {
              cryptoArr.push({ ...item, currency: item.currency || key });
            });
          } else if (val && typeof val === 'object') {
            cryptoArr.push({ ...val, currency: val.currency || key } as CurrencyRate);
          }
        });
      }
    }
  };

  // We want to prioritize the "Summary" crypto rates (from rates.crypto) over the P2P offers (from crypto.rates)
  // because the summary rates have the average/buy/sell structure we use in the UI cards.

  // 1. First process rates.crypto (Summary)
  processCrypto(ratesCryptoData);

  // 2. Then process crypto (P2P Offers) - append them
  processCrypto(cryptoData);

  // Remove duplicates by currency and source, preferring stability
  const seen = new Set<string>();
  cryptoArr = cryptoArr.filter((item) => {
    if (!item || !item.currency) return false;
    const key = `${item.currency}-${item.source || 'default'}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const bvcData = data.bvc;
  let bvcNormalized: BVCQuote[] = [];
  // unused
  // let bvcMeta: any = null;

  if (Array.isArray(bvcData)) {
    bvcNormalized = bvcData;
  } else if (bvcData && typeof bvcData === 'object') {
    if (Array.isArray(bvcData.data)) {
      bvcNormalized = bvcData.data;
      // bvcMeta = bvcData.meta || bvcData.pagination || null;
    } else if (Array.isArray(bvcData.quotes)) {
      bvcNormalized = bvcData.quotes;
      // bvcMeta = bvcData.meta || bvcData.pagination || null;
    } else {
      // Cast to BVCQuote[] if it looks like one, otherwise []
      bvcNormalized = [];
      // If bvcData is just a single object or unknown structure, we skip for safety unless we know
    }
  }

  return {
    rates: ratesArr,
    banks: banksArr,
    border: borderArr,
    crypto: cryptoArr,
    bvc: bvcNormalized,
    // bvcMeta: bvcMeta,
    // Prefer the top-level status which contains the request timestamp from fetchMarketData
    status: data.status || data.rates?.status || null
  };
}

/**
 * Server Action to fetch market data without exposing a public API endpoint.
 * This is used for client-side polling while keeping the requests "internal" to Next.js.
 */
export async function getMarketDataAction(bvcPage = 1, bvcLimit = 30) {
  try {
    const rawData = await fetchMarketData(bvcPage, bvcLimit);

    // Check if status exists in rawData (from fetchMarketData modification) or in rates
    // const statusFound = rawData.status || rawData.rates?.status;

    const data = await normalizeMarketData(rawData);

    if (!data) throw new Error('No data received from API');

    return data;
  } catch (error) {
    console.error('Error in getMarketDataAction:', error);
    throw new Error('Failed to fetch market data');
  }
}
