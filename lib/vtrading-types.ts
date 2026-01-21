
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MarketStatus {
  state: 'ABIERTO' | 'CERRADO';
  date: string;
  lastUpdate: string;
}

export interface RateValue {
  average: number;
  buy: number;
  sell: number;
}

export interface ChangeValue {
  value: number;
  percent: number;
  direction: 'up' | 'down' | 'stable';
}

export interface RateChange {
  average?: ChangeValue;
  buy?: ChangeValue;
  sell?: ChangeValue;
}

export interface CurrencyRate {
  currency: string;
  source: string;
  rate: RateValue | number;
  previousRate?: RateValue | number;
  date: string;
  previousDate?: string;
  change?: RateChange | number;
}

export interface BankRate extends CurrencyRate {
  // Specific fields for banks if any
}

export interface CryptoP2POffer {
  currency: string;
  fiat: string;
  tradeType: 'BUY' | 'SELL';
  merchantName: string;
  price: number;
  minAmount: number;
  maxAmount: number;
  paymentMethods: string[];
  timestamp: string;
}

export interface BVCQuote {
  symbol: string;
  name: string;
  category: string;
  price: number;
  change: {
    amount: number;
    percent: number;
    direction?: 'up' | 'down' | 'stable';
  };
  volume: {
    shares: number;
    amount: number;
  };
  lastUpdate?: string;
}

export interface BVCMarketData {
  status: MarketStatus;
  quotes: BVCQuote[];
  pagination: Pagination;
}

export interface RatesResponse {
  status: MarketStatus;
  rates: CurrencyRate[];
  border: CurrencyRate[];
  crypto: CurrencyRate[]; // Summary crypto rates
  banks?: CurrencyRate[]; // Sometimes included or separate
}

export interface BanksResponse {
  banks: BankRate[];
  pagination?: Pagination;
}

export interface CryptoResponse {
  rates: CryptoP2POffer[];
  pagination: Pagination;
}

export interface HistoryEntry {
  date: string;
  rate: number | RateValue;
  price?: number; // Alias for simple rate
}

export interface HistoryResponse {
  history: HistoryEntry[];
  pagination?: Pagination;
}

export interface NotificationRequest {
  token?: string;
  topic?: string;
  to?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface ApiError {
  error: string;
}
