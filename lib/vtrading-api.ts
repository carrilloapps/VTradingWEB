
const API_URL = process.env.VTRADING_API_URL;
const API_KEY = process.env.VTRADING_API_KEY;

async function fetchVTrading(endpoint: string, options: RequestInit = {}) {
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
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const getRates = () => fetchVTrading('/api/rates');
export const getCrypto = (asset = 'USDT', fiat = 'VES', tradeType = 'BUY') => 
  fetchVTrading(`/api/crypto?asset=${asset}&fiat=${fiat}&tradeType=${tradeType}`);
export const getBVCMarket = (symbol = '', page = 1, limit = 30) => 
  fetchVTrading(`/api/bvc/market?symbol=${symbol}&page=${page}&limit=${limit}`);
export const getBankRates = () => fetchVTrading('/api/rates/banks');

export async function fetchMarketData() {
  const [rates, crypto, bvc] = await Promise.all([
    getRates(),
    getCrypto('USDT', 'VES'),
    getBVCMarket()
  ]);

  return {
    rates,
    crypto,
    bvc
  };
}

export const vtradingApi = {
  getRates,
  getCrypto,
  getBVCMarket,
  getBankRates,
};
