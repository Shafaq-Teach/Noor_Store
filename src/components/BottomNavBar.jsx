import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { 
  Home, 
  Layers, 
  Heart, 
  Scale, 
  ShoppingCart 
} from 'lucide-react';

export const BottomNavBar = () => {
  const { currentTheme, themeColors, isDarkMode, t } = useTheme();
  const { currentScreen, setCurrentScreen, cartCount, comparedProductIds, favoriteProducts } = useStore();

  const navItems = [
    { id: 'HOME', label: t('home'), icon: Home },
    { id: 'PRODUCTS', label: t('products'), icon: Layers },
    { id: 'FAVORITES', label: t('favorites'), icon: Heart, badge: favoriteProducts.length },
    { id: 'COMPARE', label: t('compare'), icon: Scale, badge: comparedProductIds.length },
    { id: 'CART', label: t('cart'), icon: ShoppingCart, badge: cartCount },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 w-full backdrop-blur-lg border-t shadow-lg transition-colors duration-300"
      style={{
        backgroundColor: isDarkMode ? `${themeColors.surface}FA` : `${themeColors.surface}FA`,
        borderColor: themeColors.border
      }}
    >
      <div className="max-w-md md:max-w-lg mx-auto flex items-center justify-around px-2 py-1.5 sm:py-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive ? 'scale-105 font-bold' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                color: isActive ? currentTheme.primary : themeColors.textSecondary
              }}
            >
              {/* Active Pill Background */}
              {isActive && (
                <div 
                  className="absolute inset-0 rounded-2xl opacity-15"
                  style={{ backgroundColor: currentTheme.primary }}
                />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${isActive ? '-translate-y-0.5' : ''}`} />
                {item.badge > 0 && (
                  <span 
                    className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              
              <span className="text-[10px] sm:text-[11px] mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
