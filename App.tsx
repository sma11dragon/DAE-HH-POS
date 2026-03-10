import React, { useState, useRef } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/UI';
import { Screen, Transaction, TransactionItem } from './types';
import { AppProvider } from './AppContext';

// Screens
import { LoginScreen } from './screens/Login';
import { HomeScreen } from './screens/Home';
import { PumpDetail } from './screens/PumpDetail';
import { HistoryScreen } from './screens/History';
import { PriceCheckScreen } from './screens/PriceCheck';
import { EOSScreen } from './screens/EOS';
import { FastKeyScreen } from './screens/FastKey';
import { TransactionDetailScreen } from './screens/TransactionDetail';
import { SettingsScreen } from './screens/Settings';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  // When FastKey is opened from TransactionDetail, we track the source transaction
  const [fastKeySourceTransaction, setFastKeySourceTransaction] = useState<Transaction | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2000);
  };

  const handleLogin = () => setCurrentScreen(Screen.HOME);

  const handlePumpSelect = (pumpId: number) => {
    setSelectedPump(pumpId);
    setCurrentScreen(Screen.PUMP_DETAIL);
  };

  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setCurrentScreen(Screen.TRANSACTION_DETAIL);
  };

  const handleNavigate = (screen: Screen) => setCurrentScreen(screen);

  const handleLogout = () => {
    setCurrentScreen(Screen.LOGIN);
    setSelectedPump(null);
    setSelectedTransaction(null);
  };

  // Called from TransactionDetail → "Add Items" → opens FastKey linked to that transaction
  const handleOpenFastKeyForTransaction = (txn: Transaction) => {
    setFastKeySourceTransaction(txn);
    setCurrentScreen(Screen.FAST_KEY);
  };

  // Called when FastKey confirms items for a transaction
  const handleFastKeyItemsAdded = (items: TransactionItem[]) => {
    if (fastKeySourceTransaction) {
      const updatedTxn: Transaction = {
        ...fastKeySourceTransaction,
        additionalItems: [...(fastKeySourceTransaction.additionalItems || []), ...items],
      };
      setSelectedTransaction(updatedTxn);
      setFastKeySourceTransaction(null);
      setCurrentScreen(Screen.TRANSACTION_DETAIL);
    } else {
      setCurrentScreen(Screen.HOME);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;

      case Screen.HOME:
        return (
          <>
            <HomeScreen onNavigate={handleNavigate} onSelectTransaction={handleTransactionSelect} showToast={showToast} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.FAST_KEY:
        return (
          <>
            <FastKeyScreen
              onBack={() => {
                if (fastKeySourceTransaction) {
                  setFastKeySourceTransaction(null);
                  setCurrentScreen(Screen.TRANSACTION_DETAIL);
                } else {
                  setCurrentScreen(Screen.HOME);
                }
              }}
              sourceTransaction={fastKeySourceTransaction}
              onItemsConfirmed={handleFastKeyItemsAdded}
            />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.TRANSACTION_DETAIL:
        return (
          <>
            {selectedTransaction && (
              <TransactionDetailScreen
                transaction={selectedTransaction}
                onBack={() => setCurrentScreen(Screen.HOME)}
                onPaymentComplete={() => setCurrentScreen(Screen.HOME)}
                onAddItems={() => handleOpenFastKeyForTransaction(selectedTransaction)}
                showToast={showToast}
              />
            )}
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.PUMP_DETAIL:
        return (
          <>
            <PumpDetail pumpId={selectedPump || 1} onBack={() => setCurrentScreen(Screen.HOME)} showToast={showToast} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.HISTORY:
        return (
          <>
            <HistoryScreen onBack={() => setCurrentScreen(Screen.HOME)} showToast={showToast} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.SETTINGS:
        return (
          <>
            <SettingsScreen onSignOut={handleLogout} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.PRICE_CHECK:
        return (
          <>
            <PriceCheckScreen onClose={() => setCurrentScreen(Screen.HOME)} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.EOS:
        return (
          <>
            <HomeScreen onNavigate={handleNavigate} onSelectTransaction={handleTransactionSelect} showToast={showToast} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
            <EOSScreen onConfirm={handleLogout} onCancel={() => setCurrentScreen(Screen.HOME)} />
          </>
        );

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <AppProvider>
      <DeviceFrame>
        <div className="flex flex-col h-full bg-white text-gray-900 font-sans antialiased overflow-hidden select-none">
          {/* No global TopBar — each screen manages its own header */}
          <div className="flex-1 flex flex-col overflow-hidden relative w-full max-w-full">
            {renderScreen()}
            <Toast message={toastMsg} />
          </div>
        </div>
      </DeviceFrame>
    </AppProvider>
  );
};

export default App;
