import React, { createContext, useContext, useState } from 'react';
import { Nozzle, Transaction } from './types';
import { MOCK_NOZZLES, MOCK_PENDING_TRANSACTIONS, MOCK_TRANSACTIONS } from './mockData';

interface AppContextType {
  nozzles: Nozzle[];
  setNozzles: React.Dispatch<React.SetStateAction<Nozzle[]>>;
  pendingTransactions: Transaction[];
  setPendingTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nozzles, setNozzles] = useState<Nozzle[]>(MOCK_NOZZLES);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>(MOCK_PENDING_TRANSACTIONS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  return (
    <AppContext.Provider value={{ nozzles, setNozzles, pendingTransactions, setPendingTransactions, transactions, setTransactions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
