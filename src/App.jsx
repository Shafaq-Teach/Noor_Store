import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavBar } from './components/BottomNavBar';
import { AIAssistantModal } from './components/AIAssistantModal';

import { HomeScreen } from './screens/HomeScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { CompareScreen } from './screens/CompareScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ContactScreen } from './screens/ContactScreen';
import { AdminScreen } from './screens/AdminScreen';

import { Smartphone, Monitor } from 'lucide-react';

const MainLayout = () => {
  const { currentTheme, themeColors, isDarkMode, viewMode, toggleViewMode, t } = useTheme();
  const { currentScreen } = useStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME': return <HomeScreen />;
      case 'PRODUCTS': return <ProductsScreen />;
      case 'PRODUCT_DETAIL': return <ProductDetailScreen />;
      case 'CART': return <CartScreen />;
      case 'COMPARE': return <CompareScreen />;
      case 'FAVORITES': return <FavoritesScreen />;
      case 'CONTACT': return <ContactScreen />;
      case 'ADMIN': return <AdminScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start transition-colors duration-300 select-none"
      style={{
        backgroundColor: isDarkMode ? themeColors.bg : themeColors.bg,
        color: themeColors.textPrimary
      }}
    >
      {/* View Mode: Phone Frame Emulator vs Full Web View */}
      {viewMode === 'mobile' ? (
        <div className="w-full flex-1 flex flex-col items-center justify-center p-0 sm:py-6">
          {/* Simulated Smartphone Shell */}
          <div 
            className="w-full sm:max-w-[430px] sm:h-[890px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 dark:sm:border-slate-700 shadow-2xl flex flex-col overflow-hidden relative"
            style={{
              backgroundColor: isDarkMode ? themeColors.bg : themeColors.bg
            }}
          >
            {/* Dynamic Island / Speaker notch for smartphone frame */}
            <div className="hidden sm:flex justify-center pt-2.5 pb-1 relative z-50 pointer-events-none">
              <div className="w-28 h-4 bg-black rounded-full" />
            </div>

            {/* App Header */}
            <HeaderBar />

            {/* Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
              {renderScreen()}
            </main>

            {/* App Bottom Navigation */}
            <BottomNavBar />

            {/* AI Assistant Modal */}
            <AIAssistantModal />
          </div>
        </div>
      ) : (
        /* Full Desktop & Tablet Responsive Web View */
        <div className="w-full min-h-screen flex flex-col">
          <HeaderBar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            {renderScreen()}
          </main>

          <BottomNavBar />
          <AIAssistantModal />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <MainLayout />
      </StoreProvider>
    </ThemeProvider>
  );
}
