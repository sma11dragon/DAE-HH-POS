import { Nozzle, Transaction, FuelProduct, FastKeyItem, Coupon } from './types';

// --- Nozzles (6 pumps × 4 nozzles = 3 physical dispensers × 2 sides A/B) ---
// ID scheme: pump × 100 + position (e.g. 102 = Pump 1, Nozzle 2)
// Dispenser 1: Pump 1 (Side A) + Pump 2 (Side B)
// Dispenser 2: Pump 3 (Side A) + Pump 4 (Side B)
// Dispenser 3: Pump 5 (Side A) + Pump 6 (Side B)
export const MOCK_NOZZLES: Nozzle[] = [
  // Pump 1 — Dispenser 1, Side A (R90 × 2, R92 × 2)
  { id: 101, product: 'R90',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.88/L', totalizer: '14,820.3L', dailyVolume: '342.5L', dailySales: '$301.4' },
  { id: 102, product: 'R90',    volume: '12.50L', amount: '$11.00', status: 'Fueling',   ppu: '$0.88/L', totalizer: '9,304.7L',  dailyVolume: '218.0L', dailySales: '$191.8' },
  { id: 103, product: 'R92',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.97/L', totalizer: '6,112.0L',  dailyVolume: '95.4L',  dailySales: '$92.5'  },
  { id: 104, product: 'Diesel', volume: '45.20L', amount: '$42.04', status: 'Payment',   ppu: '$0.93/L', totalizer: '22,445.6L', dailyVolume: '580.8L', dailySales: '$540.1' },
  // Pump 2 — Dispenser 1, Side B (R90, R92, R95, Diesel)
  { id: 201, product: 'R90',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.88/L', totalizer: '11,234.5L', dailyVolume: '287.3L', dailySales: '$252.8' },
  { id: 202, product: 'R92',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.97/L', totalizer: '7,890.1L',  dailyVolume: '176.6L', dailySales: '$171.3' },
  { id: 203, product: 'R95',    volume: '5.20L',  amount: '$5.82',  status: 'Payment',   ppu: '$1.12/L', totalizer: '5,567.3L',  dailyVolume: '88.1L',  dailySales: '$98.7'  },
  { id: 204, product: 'Diesel', volume: '0.00L',  amount: '$0.00',  status: 'Error',     ppu: '$0.93/L', totalizer: '18,002.9L', dailyVolume: '110.4L', dailySales: '$102.7' },
  // Pump 3 — Dispenser 2, Side A (R92 × 2, R95 × 2)
  { id: 301, product: 'R92',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.97/L', totalizer: '9,100.6L',  dailyVolume: '193.7L', dailySales: '$187.9' },
  { id: 302, product: 'R92',    volume: '0.00L',  amount: '$0.00',  status: 'Suspended', ppu: '$0.97/L', totalizer: '5,430.2L',  dailyVolume: '141.0L', dailySales: '$136.8' },
  { id: 303, product: 'R95',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$1.12/L', totalizer: '4,218.7L',  dailyVolume: '72.3L',  dailySales: '$81.0'  },
  { id: 304, product: 'R95',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$1.12/L', totalizer: '2,110.5L',  dailyVolume: '44.0L',  dailySales: '$49.3'  },
  // Pump 4 — Dispenser 2, Side B (R90 × 2, Diesel × 2)
  { id: 401, product: 'R90',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.88/L', totalizer: '8,750.0L',  dailyVolume: '165.2L', dailySales: '$145.4' },
  { id: 402, product: 'R90',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.88/L', totalizer: '6,321.4L',  dailyVolume: '98.6L',  dailySales: '$86.8'  },
  { id: 403, product: 'Diesel', volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.93/L', totalizer: '16,770.3L', dailyVolume: '430.5L', dailySales: '$400.4' },
  { id: 404, product: 'Diesel', volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.93/L', totalizer: '1,995.5L',  dailyVolume: '38.6L',  dailySales: '$35.9'  },
  // Pump 5 — Dispenser 3, Side A (R92 × 2, Diesel × 2)
  { id: 501, product: 'R92',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.97/L', totalizer: '6,344.0L',  dailyVolume: '44.8L',  dailySales: '$43.5'  },
  { id: 502, product: 'R92',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.97/L', totalizer: '7,654.1L',  dailyVolume: '121.9L', dailySales: '$118.2' },
  { id: 503, product: 'Diesel', volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.93/L', totalizer: '2,780.4L',  dailyVolume: '52.2L',  dailySales: '$48.5'  },
  { id: 504, product: 'Diesel', volume: '0.00L',  amount: '$0.00',  status: 'Offline',   ppu: '$0.93/L', totalizer: '1,200.0L',  dailyVolume: '0.0L',   dailySales: '$0.00'  },
  // Pump 6 — Dispenser 3, Side B (R90 × 2, R95 × 2)
  { id: 601, product: 'R90',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.88/L', totalizer: '5,210.8L',  dailyVolume: '87.4L',  dailySales: '$76.9'  },
  { id: 602, product: 'R90',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$0.88/L', totalizer: '3,900.2L',  dailyVolume: '61.3L',  dailySales: '$54.0'  },
  { id: 603, product: 'R95',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$1.12/L', totalizer: '2,560.1L',  dailyVolume: '34.5L',  dailySales: '$38.6'  },
  { id: 604, product: 'R95',    volume: '0.00L',  amount: '$0.00',  status: 'Idle',      ppu: '$1.12/L', totalizer: '1,830.7L',  dailyVolume: '22.1L',  dailySales: '$24.8'  },
];

// --- Pending (unpaid) transactions shown on Home ---
export const MOCK_PENDING_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-104', time: '10:42 AM', type: 'Fuel', staff: 'Admin', amount: '$42.04', status: 'Pending', product: 'Diesel', nozzleNumber: 4, volume: '45.20L' },
  { id: 'TXN-203', time: '10:45 AM', type: 'Fuel', staff: 'Admin', amount: '$5.82',  status: 'Pending', product: 'R95',    nozzleNumber: 3, volume: '5.20L'  },
];

// --- Transaction history ---
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '13825', time: '13:39', type: 'Sale', staff: 'Dara Chan',   amount: '1.37',  status: 'Completed', product: 'Revvo 95',          volume: '1.22L',  paymentMethod: 'Cash'       },
  { id: '13824', time: '12:15', type: 'Sale', staff: 'Dara Chan',   amount: '20.00', status: 'Completed', product: 'Primus Diesel Plus', volume: '21.51L', paymentMethod: 'Bank Card'  },
  { id: '13823', time: '11:42', type: 'Sale', staff: 'Sopheak Ros', amount: '5.50',  status: 'Completed', product: 'Revvo 92',          volume: '5.67L',  paymentMethod: 'QR Code'    },
  { id: '13822', time: '10:05', type: 'Void', staff: 'Sopheak Ros', amount: '0.00',  status: 'Pending',   product: 'Revvo 90'                                                          },
  { id: '13821', time: '09:30', type: 'Sale', staff: 'Sopheak Ros', amount: '10.00', status: 'Completed', product: 'Revvo 95',          volume: '8.93L',  paymentMethod: 'Fleet Card' },
  { id: '13820', time: '09:15', type: 'Sale', staff: 'Dara Chan',   amount: '45.00', status: 'Completed', product: 'Primus Diesel Plus', volume: '48.39L', paymentMethod: 'Cash'       },
  { id: '13819', time: '08:55', type: 'Sale', staff: 'Dara Chan',   amount: '18.00', status: 'Pending',   product: 'Revvo 92',          volume: '18.56L'                              },
  { id: '13818', time: '08:30', type: 'Sale', staff: 'Sopheak Ros', amount: '33.50', status: 'Completed', product: 'Primus Diesel Plus', volume: '36.02L', paymentMethod: 'QR Code'   },
];

// --- Fuel products for PriceCheck ---
export const MOCK_FUEL_PRODUCTS: FuelProduct[] = [
  { name: 'Revvo 90',           price: 0.88, currency: 'USD', secondPrice: 3520, secondCurrency: 'KHR' },
  { name: 'Revvo 92',           price: 0.97, currency: 'USD', secondPrice: 3900, secondCurrency: 'KHR' },
  { name: 'Revvo 95',           price: 1.12, currency: 'USD', secondPrice: 4500, secondCurrency: 'KHR' },
  { name: 'Primus Diesel Plus', price: 0.93, currency: 'USD', secondPrice: 3750, secondCurrency: 'KHR' },
];

// --- Fast Key product catalogue ---
export const MOCK_FAST_KEY_ITEMS: FastKeyItem[] = [
  { id: 1, name: 'Water',      price: 0.50,  image: '/fast-keys/vital-water.png' },
  { id: 2, name: 'Lubricants', price: 9.00,  image: '/fast-keys/lubricant.png'   },
  { id: 3, name: 'Coffee',     price: 1.50,  image: '/fast-keys/latte.jpg'        },
  { id: 4, name: 'Snacks',     price: 1.60,  image: '/fast-keys/potato-chips.jpg' },
  { id: 5, name: 'Car Wash',   price: 5.00,  image: '/fast-keys/car-wash.jpg'     },
];

// --- Coupons (used in TransactionDetail) ---
export const MOCK_COUPONS: Coupon[] = [
  { id: 'CPN-001', label: '5% Fuel Discount',     discount: 0.05, type: 'percent', auto: false },
  { id: 'CPN-002', label: 'RM2 Off Next Purchase', discount: 2.00, type: 'fixed',   auto: true  },
];

// --- EOS shift summary ---
export const MOCK_SHIFT_SUMMARY = [
  { label: 'Total Transactions', value: '47',       unit: ''    },
  { label: 'Total Revenue',      value: '1,284.50', unit: 'USD' },
  { label: 'Fuel Dispensed',     value: '1,382.4',  unit: 'L'   },
  { label: 'Unpaid',             value: '2',        unit: '', highlight: true },
];

// --- Cashier shift summary (shown in Cashier info drawer) ---
export interface CashierProductStat {
  code: string;   // short code for color lookup
  name: string;   // full display name
  sales: number;
  volume: number;
}

export interface CashierMOPStat {
  method: string;
  sales: number;
  count: number;
}

export interface CashierSummaryData {
  cashier: string;
  shift: string;
  startTime: string;
  totalSales: number;
  totalVolume: number;
  currency: string;
  byProduct: CashierProductStat[];
  byMOP: CashierMOPStat[];
}

export const MOCK_CASHIER_SUMMARY: CashierSummaryData = {
  cashier:     'Dara Chan',
  shift:       'Morning',
  startTime:   '06:00',
  totalSales:  1284.50,
  totalVolume: 1382.4,
  currency:    'USD',
  byProduct: [
    { code: 'R90',    name: 'Revvo 90',           sales: 198.20, volume: 284.3 },
    { code: 'R92',    name: 'Revvo 92',           sales: 412.30, volume: 424.8 },
    { code: 'R95',    name: 'Revvo 95',           sales: 400.20, volume: 249.9 },
    { code: 'Diesel', name: 'Primus Diesel Plus', sales: 273.80, volume: 423.4 },
  ],
  byMOP: [
    { method: 'Cash',       sales: 534.20, count: 18 },
    { method: 'QR Code',    sales: 312.50, count: 12 },
    { method: 'Bank Card',  sales: 286.80, count: 9  },
    { method: 'Fleet Card', sales: 151.00, count: 8  },
  ],
};
