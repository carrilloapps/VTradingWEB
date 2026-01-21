'use server';

import { fetchMarketData } from '@/lib/vtrading-api';

/**
 * Server Action to fetch market data without exposing a public API endpoint.
 * This is used for client-side polling while keeping the requests "internal" to Next.js.
 */
export async function getMarketDataAction(type: 'full' | 'ticker' | 'summary' = 'summary') {
  try {
    const data = await fetchMarketData();
    
    if (type === 'ticker') {
      const tickerItems = [];
      
      // BCV
      if (data.rates?.rates) {
        const rates = Array.isArray(data.rates.rates) ? data.rates.rates : Object.values(data.rates.rates);
        const usd = rates.find((r: any) => r.currency === 'USD');
        if (usd) {
          tickerItems.push({ 
            label: 'USD/VES BCV', 
            value: (usd.rate?.buy || usd.rate || 0).toFixed(2), 
            trend: usd.change === 'up' ? 'up' : 'down' 
          });
        }
      }

      // Crypto USDT
      if (data.crypto?.rates) {
        const usdt = data.crypto.rates.find((r: any) => r.currency === 'USDT');
        if (usdt) {
          tickerItems.push({ 
            label: 'USDT P2P', 
            value: (usdt.price || 0).toFixed(2), 
            trend: 'up' 
          });
        }
      }

      // BVC
      if (data.bvc?.summary) {
        tickerItems.push({ 
          label: 'IBVC Index', 
          value: (data.bvc.summary.index || 0).toLocaleString(), 
          trend: data.bvc.summary.change >= 0 ? 'up' : 'down' 
        });
      }

      return tickerItems;
    }

    if (type === 'full') {
      return {
        rates: {
          ...data.rates,
          rates: Array.isArray(data.rates?.rates) ? data.rates.rates : (data.rates?.rates ? Object.values(data.rates.rates) : []),
          banks: Array.isArray(data.rates?.banks) ? data.rates.banks : (data.rates?.banks ? Object.values(data.rates.banks) : []),
          border: Array.isArray(data.rates?.border) ? data.rates.border : (data.rates?.border ? Object.values(data.rates.border) : [])
        },
        crypto: data.crypto,
        bvc: {
          ...data.bvc,
          quotes: Array.isArray(data.bvc?.quotes) ? data.bvc.quotes : (data.bvc?.quotes ? Object.values(data.bvc.quotes) : [])
        }
      };
    }

    return {
      rates: {
        rates: Array.isArray(data.rates?.rates) ? data.rates.rates : (data.rates?.rates ? Object.values(data.rates.rates) : []),
      },
      bvc: {
        quotes: Array.isArray(data.bvc?.quotes) ? data.bvc.quotes : (data.bvc?.quotes ? Object.values(data.bvc.quotes) : []),
        summary: data.bvc?.summary
      }
    };
  } catch (error) {
    console.error('Error in getMarketDataAction:', error);
    throw new Error('Failed to fetch market data');
  }
}
