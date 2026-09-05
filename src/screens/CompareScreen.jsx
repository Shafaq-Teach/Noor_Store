import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { getAssetUrl } from '../utils/assetHelper';
import { 
  Scale, 
  Trash2, 
  Plus, 
  ShoppingBag, 
  X, 
  Check, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';

export const CompareScreen = () => {
  const { currentTheme, themeColors, language, isDarkMode, t } = useTheme();
  const { 
    comparedProducts, 
    products, 
    removeFromCompare, 
    clearCompare, 
    toggleCompare, 
    addToCart, 
    setSelectedProduct, 
    setCurrentScreen 
  } = useStore();

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('PRODUCT_DETAIL');
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2" style={{ color: themeColors.textPrimary }}>
            <Scale className="w-5 h-5" style={{ color: currentTheme.primary }} />
            {t('compare_title')}
          </h2>
          <p className="text-xs opacity-75" style={{ color: themeColors.textSecondary }}>
            {t('compare_desc')}
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('clear_compare')}</span>
          </button>
        )}
      </div>

      {/* Comparison View */}
      {comparedProducts.length >= 1 ? (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-[320px]">
            {comparedProducts.map(product => {
              const pName = language === 'uyghur' ? product.nameUg : language === 'arabic' ? product.nameAr : product.nameEn;
              const pDesc = language === 'uyghur' ? product.descriptionUg : language === 'arabic' ? product.descriptionAr : product.descriptionEn;
              const pSpecs = language === 'uyghur' ? product.specsUg : language === 'arabic' ? product.specsAr : product.specsEn;

              return (
                <div 
                  key={product.id}
                  className="rounded-3xl p-4 sm:p-5 border shadow-md flex flex-col justify-between space-y-4"
                  style={{
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary
                  }}
                >
                  {/* Top Remove & Image */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span 
                        className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md"
                        style={{ backgroundColor: themeColors.surfaceVariant, color: currentTheme.primary }}
                      >
                        {product.brand}
                      </span>
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="p-1 rounded-full text-gray-400 hover:text-rose-500 hover:bg-black/5"
                        title={t('remove_compare')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div 
                      onClick={() => handleProductSelect(product)}
                      className="w-full aspect-square rounded-2xl overflow-hidden bg-black/5 cursor-pointer flex items-center justify-center"
                    >
                      <img 
                        src={getAssetUrl(product.imageResName || "/images/img_phones_1786037591338.jpg")} 
                        alt={pName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => { e.target.src = getAssetUrl("/images/img_phones_1786037591338.jpg"); }}
                      />
                    </div>

                    <h3 
                      onClick={() => handleProductSelect(product)}
                      className="text-sm font-bold truncate cursor-pointer hover:underline"
                    >
                      {pName}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black" style={{ color: currentTheme.primary }}>
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs line-through opacity-50">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specs Matrix */}
                  <div 
                    className="p-3 rounded-2xl border text-xs space-y-2"
                    style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
                  >
                    <div className="font-bold flex items-center gap-1 opacity-80" style={{ color: currentTheme.primary }}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t('specifications')}:
                    </div>
                    <p className="leading-relaxed opacity-90 text-[11px]">
                      {pSpecs || pDesc}
                    </p>

                    <div className="pt-2 border-t flex justify-between text-[11px] opacity-75" style={{ borderColor: themeColors.border }}>
                      <span>{t('stock_status')}:</span>
                      <span className="font-bold">{product.inStock ? t('in_stock') : t('out_of_stock')}</span>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="w-full py-2.5 rounded-2xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 hover:scale-102 active:scale-98 transition-all disabled:opacity-40"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('add_to_cart')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div 
          className="rounded-3xl p-8 sm:p-12 text-center border shadow-sm space-y-4 my-8 max-w-md mx-auto"
          style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
        >
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-gray-500/10 opacity-70">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold" style={{ color: themeColors.textPrimary }}>
            {t('compare_empty')}
          </h3>
          <p className="text-xs opacity-70" style={{ color: themeColors.textSecondary }}>
            {t('compare_desc')}
          </p>
          <button
            onClick={() => setCurrentScreen('PRODUCTS')}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md text-white hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {t('products')}
          </button>
        </div>
      )}

      {/* Add More Devices Quick Selector */}
      {comparedProducts.length < 3 && (
        <div 
          className="p-4 sm:p-5 rounded-3xl border shadow-sm space-y-3"
          style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
        >
          <h4 className="text-xs font-bold opacity-75">{t('select_product_to_compare')}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {products.filter(p => !comparedProducts.some(cp => cp.id === p.id)).slice(0, 4).map(prod => {
              const prodName = language === 'uyghur' ? prod.nameUg : language === 'arabic' ? prod.nameAr : prod.nameEn;
              return (
                <div
                  key={prod.id}
                  onClick={() => toggleCompare(prod)}
                  className="p-2 rounded-2xl border flex items-center gap-2 cursor-pointer hover:scale-102 transition-all text-xs"
                  style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
                >
                  <img src={prod.imageResName} alt={prodName} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <span className="truncate block font-bold text-[11px]">{prodName}</span>
                    <span className="text-[10px] opacity-70" style={{ color: currentTheme.primary }}>${prod.price}</span>
                  </div>
                  <Plus className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
