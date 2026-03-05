export enum Screen {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  PUMP_DETAIL = 'PUMP_DETAIL',
  HISTORY = 'HISTORY',
  PRICE_CHECK = 'PRICE_CHECK',
  EOS = 'EOS', // End of Shift
  FAST_KEY = 'FAST_KEY',
  TRANSACTION_DETAIL = 'TRANSACTION_DETAIL',
}

export interface Transaction {
  id: string;
  time: string;
  type: string;
  staff: string;
  amount: string;
  status: 'Completed' | 'Pending';
  product?: string;
  nozzleNumber?: number;
  volume?: string;
}

export interface FuelProduct {
  name: string;
  price: number;
  currency: string;
  secondPrice: number;
  secondCurrency: string;
}
