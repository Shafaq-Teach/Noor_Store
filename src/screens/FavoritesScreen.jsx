import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export const FavoritesScreen = () => {
  const { currentTheme, themeColors, t } = useTheme();
  const { favoriteProducts, setCurrentScreen } = useStore();

  return (
    <div className="space-y-4 pb-24 animate-in fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2" style={{ color: themeColors.textPrimary }}>
          <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          {t('favorites')} ({favoriteProducts.length})
        </h2>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {favoriteProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div 
          className="rounded-3xl p-8 sm:p-12 text-center border shadow-sm space-y-4 my-8 max-w-md mx-auto"
          style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
        >
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-rose-500/10 text-rose-500">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>
          <h3 className="text-base font-bold" style={{ color: themeColors.textPrimary }}>
            {t('no_favorites_yet')}
          </h3>
          <button
            onClick={() => setCurrentScreen('PRODUCTS')}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md text-white hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {t('products')}
          </button>
        </div>
      )}
    </div>
  );
};
