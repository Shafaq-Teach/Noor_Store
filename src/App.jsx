import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavBar } from './components/BottomNavBar';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AppDownloadModal } from './components/AppDownloadModal';

import { HomeScreen } from './screens/HomeScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { CompareScreen } from './screens/CompareScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ContactScreen } from './screens/ContactScreen';
import { AdminScreen } from './screens/AdminScreen';

const MainLayout = () => {
  const { themeColors, isDarkMode } = useTheme();
  const { currentScreen, openDownloadModal } = useStore();

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
      <div className="w-full min-h-screen flex flex-col">
        <HeaderBar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {renderScreen()}
        </main>

        <BottomNavBar />
        <AIAssistantModal />
        <AppDownloadModal />

        {/* Floating Download Button */}
        <div className="fixed bottom-20 start-4 z-40 animate-bounce">
          <button
            onClick={openDownloadModal}
            className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-2xl text-white font-black text-xs sm:text-sm border-2 border-white/40 hover:scale-105 active:scale-95 transition-all"
            style={{
              background: `linear-gradient(135deg, ${themeColors.primary || '#10b981'}, #0284c7)`
            }}
            title="Noor Store ئەپىنى چۈشۈرۈش (APK)"
          >
            <span className="text-amber-300">📲</span>
            <span>ئەپنى چۈشۈرۈش (APK)</span>
          </button>
        </div>
      </div>
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
