import React, { useState } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { Screen, Transaction } from './types';

// Screens
import { LoginScreen } from './screens/Login';
import { HomeScreen } from './screens/Home';
import { PumpDetail } from './screens/PumpDetail';
import { HistoryScreen } from './screens/History';
import { PriceCheckScreen } from './screens/PriceCheck';
import { EOSScreen } from './screens/EOS';
import { FastKeyScreen } from './screens/FastKey';
import { TransactionDetailScreen } from './screens/TransactionDetail';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleLogin = () => {
    setCurrentScreen(Screen.HOME);
  };

  const handlePumpSelect = (pumpId: number) => {
    setSelectedPump(pumpId);
    setCurrentScreen(Screen.PUMP_DETAIL);
  };

  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setCurrentScreen(Screen.TRANSACTION_DETAIL);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    setCurrentScreen(Screen.LOGIN);
    setSelectedPump(null);
  };

  // Render Logic
  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;
      
      case Screen.HOME:
        return (
          <>
            <HomeScreen onNavigate={handleNavigate} onSelectTransaction={handleTransactionSelect} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.FAST_KEY:
        return (
          <>
            <FastKeyScreen onBack={() => setCurrentScreen(Screen.HOME)} />
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
              />
            )}
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.PUMP_DETAIL:
        return (
          <>
            <PumpDetail pumpId={selectedPump || 1} onBack={() => setCurrentScreen(Screen.HOME)} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.HISTORY:
        return (
          <>
            <HistoryScreen onBack={() => setCurrentScreen(Screen.HOME)} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        );

      case Screen.PRICE_CHECK:
        return (
          <>
            <HomeScreen onNavigate={handleNavigate} onSelectTransaction={handleTransactionSelect} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
            {/* Modal sits on top of everything */}
            <PriceCheckScreen onClose={() => setCurrentScreen(Screen.HOME)} />
          </>
        );
      
      case Screen.EOS:
        return (
           <>
            <HomeScreen onNavigate={handleNavigate} onSelectTransaction={handleTransactionSelect} />
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
            {/* Modal sits on top of everything */}
            <EOSScreen onConfirm={handleLogout} onCancel={() => setCurrentScreen(Screen.HOME)} />
          </>
        );

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <DeviceFrame>
      <div className="flex flex-col h-full bg-white text-gray-900 font-sans antialiased overflow-hidden select-none">
        {currentScreen !== Screen.LOGIN && <TopBar />}
        
        {/* Main Content Area - Flex column to allow child screens to expand and nav to sit at bottom */}
        <div className="flex-1 flex flex-col overflow-hidden relative w-full max-w-full">
            {renderScreen()}
        </div>
      </div>
    </DeviceFrame>
  );
};

export default App;