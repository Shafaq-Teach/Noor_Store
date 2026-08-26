import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Sparkles,
  ShoppingBag 
} from 'lucide-react';

export const ProductsScreen = () => {
  const { currentTheme, themeColors, language, isDarkMode, t } = useTheme();
  const { 
    filteredProducts, 
    categories, 
    searchQuery, 
    setSearchQuery, 
    selectedCategoryId, 
    setSelectedCategoryId, 
    maxPriceFilter, 
    setMaxPriceFilter 
  } = useStore();

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(null);
    setMaxPriceFilter(null);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Search Input Bar */}
      <div className="relative">
        <div 
          className="rounded-3xl border shadow-sm flex items-center px-4 py-2.5 transition-all focus-within:ring-2"
          style={{
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
            ringColor: currentTheme.primary
          }}
        >
          <Search className="w-5 h-5 opacity-50 flex-shrink-0" style={{ color: currentTheme.primary }} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_hint')}
            className="w-full bg-transparent px-3 text-xs sm:text-sm focus:outline-none placeholder:opacity-50"
            style={{ color: themeColors.textPrimary }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 hover:opacity-75">
              <X className="w-4 h-4 opacity-60" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Price Filter Header */}
      <div className="space-y-2.5">
        {/* Category Horizontal Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-xs border transition-all flex-shrink-0 ${
              selectedCategoryId === null ? 'shadow-md scale-102 text-white' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: selectedCategoryId === null ? currentTheme.primary : themeColors.surface,
              borderColor: selectedCategoryId === null ? currentTheme.primary : themeColors.border,
              color: selectedCategoryId === null ? '#FFFFFF' : themeColors.textPrimary
            }}
          >
            {t('all_categories')}
          </button>

          {categories.map(cat => {
            const isSelected = selectedCategoryId === cat.id;
            const catName = language === 'uyghur' ? cat.nameUg : language === 'arabic' ? cat.nameAr : cat.nameEn;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-xs border transition-all flex-shrink-0 ${
                  isSelected ? 'shadow-md scale-102 text-white' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: isSelected ? currentTheme.primary : themeColors.surface,
                  borderColor: isSelected ? currentTheme.primary : themeColors.border,
                  color: isSelected ? '#FFFFFF' : themeColors.textPrimary
                }}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Price Range Filter Slider */}
        <div 
          className="p-3 rounded-2xl border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{
            backgroundColor: themeColors.surfaceVariant,
            borderColor: themeColors.border,
            color: themeColors.textPrimary
          }}
        >
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <span className="font-bold flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
              {t('filter_by_price')}:
            </span>
            <span className="font-black" style={{ color: currentTheme.primary }}>
              {maxPriceFilter ? `≤ ¥${maxPriceFilter}` : t('all')}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-64">
            <input 
              type="range" 
              min="200" 
              max="12000" 
              step="200"
              value={maxPriceFilter || 12000}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            {maxPriceFilter && (
              <button 
                onClick={() => setMaxPriceFilter(null)}
                className="p-1 rounded-full hover:opacity-75 flex-shrink-0"
                title="Reset Price"
              >
                <RotateCcw className="w-3.5 h-3.5 opacity-60" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {(searchQuery || selectedCategoryId || maxPriceFilter) && (
        <div className="flex items-center gap-2 px-1 text-xs">
          <span className="opacity-60">{filteredProducts.length} {t('products')}</span>
          <button
            onClick={resetFilters}
            className="text-[11px] font-semibold underline hover:opacity-80"
            style={{ color: currentTheme.primary }}
          >
            {t('clear_compare')}
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div 
          className="rounded-3xl p-10 text-center border shadow-sm space-y-3 my-6"
          style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
        >
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-gray-500/10 opacity-70">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold" style={{ color: themeColors.textPrimary }}>
            {t('cart_empty')}
          </h4>
          <p className="text-xs opacity-70 max-w-sm mx-auto" style={{ color: themeColors.textSecondary }}>
            {t('search_hint')}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-2xl font-bold text-xs shadow-md text-white hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {t('all_categories')}
          </button>
        </div>
      )}
    </div>
  );
};
