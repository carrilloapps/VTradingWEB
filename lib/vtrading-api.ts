import {
  RatesResponse,
  BanksResponse,
  CryptoResponse,
  BVCMarketData,
  HistoryResponse,
  NotificationRequest,
  MarketStatus
} from './vtrading-types';

const API_URL = process.env.VTRADING_API_URL;
const API_KEY = process.env.VTRADING_API_KEY;

/**
 * Generic fetch wrapper for VTrading API
 */
async function fetchVTrading<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL || !API_KEY) {
    throw new Error('VTRADING_API_URL or VTRADING_API_KEY is not configured');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60, ...(options.next || {}) },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

/**
 * Get latest exchange rates (Fiat, Border, Crypto Summary, Status)
 */
export const getRates = () => fetchVTrading<RatesResponse>('/api/rates');

/**
 * Get current market status (State, Date, Last Update)
 */
export async function getMarketStatus(): Promise<MarketStatus> {
  try {
    const data = await getRates();
    
    if (!data || !data.status) {
      throw new Error('Invalid response structure: missing status object');
    }

    const { state, date, lastUpdate } = data.status;

    if (!state || !date || !lastUpdate) {
      throw new Error('Missing required status fields');
    }

    return { state, date, lastUpdate };
  } catch (error) {
    console.error('Error fetching market status:', error);
    throw error;
  }
}

/**
 * Get Crypto P2P rates (Binance/Local)
 */
export const getCrypto = (asset = '', fiat = 'VES', tradeType = 'BUY', page = 1, limit = 10) => {
  const params = new URLSearchParams();
  if (asset) params.append('asset', asset);
  if (fiat) params.append('fiat', fiat);
  if (tradeType) params.append('tradeType', tradeType);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const query = params.toString();
  return fetchVTrading<CryptoResponse>(`/api/crypto${query ? `?${query}` : ''}`);
};

/**
 * Get Caracas Stock Exchange (BVC) Market Data
 */
export const getBVCMarket = (symbol = '', page = 1, limit = 30) => {
  const params = new URLSearchParams();
  if (symbol) params.append('symbol', symbol);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  return fetchVTrading<BVCMarketData>(`/api/bvc/market?${params.toString()}`);
};

/**
 * Get Bank Rates (Paginated)
 */
export const getBankRates = (page = 1, limit = 30) => 
  fetchVTrading<BanksResponse>(`/api/rates/banks?page=${page}&limit=${limit}`);

/**
 * Get Historical Data for a specific symbol (Fiat or Crypto)
 */
export const getAssetHistory = (symbol: string, page = 1, limit = 30) => 
  fetchVTrading<HistoryResponse>(`/api/rates/history/${symbol}?page=${page}&limit=${limit}`, { next: { revalidate: 0 } });

/**
 * Get Historical Data for USD/VES (Legacy compatibility)
 */
export const getRatesHistory = (page = 1, limit = 30) => getAssetHistory('usd', page, limit);

/**
 * Get Historical Data for a specific Bank
 */
export const getBankHistory = (bankName: string, page = 1, limit = 30) => 
  fetchVTrading<HistoryResponse>(`/api/rates/banks/history/${encodeURIComponent(bankName)}?page=${page}&limit=${limit}`);

/**
 * Send Firebase Cloud Messaging Notification
 */
export const sendNotification = (payload: NotificationRequest) => 
  fetchVTrading<void>('/api/notifications/send', {
    method: 'POST',
    body: JSON.stringify(payload),
    next: { revalidate: 0 }
  });

/**
 * Aggregated Market Data Fetcher (Convenience function)
 */
export async function fetchMarketData(bvcPage = 1, bvcLimit = 30) {
  const [rates, crypto, bvc] = await Promise.all([
    getRates(),
    getCrypto('', 'VES', 'BUY', 1, 10), // Default to first page of crypto
    getBVCMarket('', bvcPage, bvcLimit)
  ]);

  return {
    rates,
    crypto,
    bvc
  };
}

export const vtradingApi = {
  getRates,
  getMarketStatus,
  getCrypto,
  getBVCMarket,
  getBankRates,
  getRatesHistory,
  getAssetHistory,
  getBankHistory,
  sendNotification,
  fetchMarketData
};
