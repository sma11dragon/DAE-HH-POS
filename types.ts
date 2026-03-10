export enum Screen {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  PUMP_DETAIL = 'PUMP_DETAIL',
  HISTORY = 'HISTORY',
  PRICE_CHECK = 'PRICE_CHECK',
  EOS = 'EOS', // End of Shift
  FAST_KEY = 'FAST_KEY',
  TRANSACTION_DETAIL = 'TRANSACTION_DETAIL',
  SETTINGS = 'SETTINGS',
}

export interface TransactionItem {
  id: number;
  name: string;
  qty: number;
  price: number;
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
  paymentMethod?: string;
  additionalItems?: TransactionItem[];
}

export interface FuelProduct {
  name: string;
  price: number;
  currency: string;
  secondPrice: number;
  secondCurrency: string;
}

export type NozzleStatus = 'Idle' | 'Fueling' | 'Payment' | 'Error' | 'Offline' | 'Suspended';

export interface Nozzle {
  id: number;
  product: string;
  volume: string;
  amount: string;
  status: NozzleStatus;
  ppu: string;
  totalizer: string;
  dailyVolume: string;
  dailySales: string;
}

export interface FastKeyItem {
  id: number;
  name: string;
  image: string;
  price: number;
}

export interface Coupon {
  id: string;
  label: string;
  discount: number;
  type: 'percent' | 'fixed';
  auto: boolean;
}
