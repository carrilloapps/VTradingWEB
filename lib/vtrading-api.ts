
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

/**
 * Fetches the current market status from the rates endpoint.
 */
export async function getMarketStatus() {
  try {
    const data = await getRates();
    
    if (!data || !data.status) {
      throw new Error('Invalid response structure: missing status object');
    }

    const { state, date, lastUpdate } = data.status;

    // Validation
    if (!state || !date || !lastUpdate) {
      throw new Error('Missing required status fields');
    }

    // Basic date format validation (DD-MM-YYYY)
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(date)) {
      console.warn(`Invalid date format received: ${date}`);
    }

    return {
      state,
      date,
      lastUpdate
    };
  } catch (error) {
    console.error('Error fetching market status:', error);
    throw error;
  }
}
export const getCrypto = (asset = '', fiat = 'VES', tradeType = 'BUY') => {
  const params = new URLSearchParams();
  if (asset) params.append('asset', asset);
  if (fiat) params.append('fiat', fiat);
  if (tradeType) params.append('tradeType', tradeType);
  const query = params.toString();
  return fetchVTrading(`/api/crypto${query ? `?${query}` : ''}`);
};

export const getBVCMarket = (symbol = '', page = 1, limit = 30) => 
  fetchVTrading(`/api/bvc/market?symbol=${symbol}&page=${page}&limit=${limit}`);

export const getBankRates = () => fetchVTrading('/api/rates/banks');

export async function fetchMarketData(bvcPage = 1, bvcLimit = 30) {
  const [rates, crypto, bvc] = await Promise.all([
    getRates(),
    getCrypto(''), // Empty asset to get all cryptos
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
  getCrypto,
  getBVCMarket,
  getBankRates,
};
