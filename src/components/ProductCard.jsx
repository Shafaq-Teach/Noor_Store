import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { getAssetUrl } from '../utils/assetHelper';
import { 
  Heart, 
  ThumbsUp, 
  Plus, 
  Scale, 
  Check, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { currentTheme, themeColors, language, isDarkMode, t } = useTheme();
  const { 
    setSelectedProduct, 
    setCurrentScreen, 
    addToCart, 
    toggleHeart, 
    incrementLikes, 
    toggleCompare, 
    isCompared 
  } = useStore();

  const name = language === 'uyghur' ? product.nameUg : language === 'arabic' ? product.nameAr : product.nameEn;
  const description = language === 'uyghur' ? product.descriptionUg : language === 'arabic' ? product.descriptionAr : product.descriptionEn;
  const specs = language === 'uyghur' ? product.specsUg : language === 'arabic' ? product.specsAr : product.specsEn;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const compared = isCompared(product.id);
  const isFavorite = product.heartsCount > 0;

  const handleCardClick = () => {
    setSelectedProduct(product);
    setCurrentScreen('PRODUCT_DETAIL');
  };

  return (
    <div 
      className="group relative rounded-3xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border"
      style={{
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
        color: themeColors.textPrimary
      }}
    >
      {/* Top Media & Tags */}
      <div>
        <div 
          onClick={handleCardClick}
          className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-pointer bg-black/5 flex items-center justify-center mb-2.5"
        >
          <img 
            src={getAssetUrl(product.imageResName || "/images/img_phones_1786037591338.jpg")} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = getAssetUrl("/images/img_phones_1786037591338.jpg"); }}
          />

          {/* Featured Ribbon / Discount Tag */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isFeatured && (
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md flex items-center gap-1"
                style={{ backgroundColor: currentTheme.secondary }}
              >
                <Sparkles className="w-2.5 h-2.5" />
                {t('featured')}
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all ${
              compared ? 'text-white' : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            style={{
              backgroundColor: compared ? currentTheme.primary : undefined
            }}
            title={compared ? t('remove_compare') : t('add_to_compare')}
          >
            {compared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
          </button>

          {/* Stock Status Pill */}
          <div className="absolute bottom-2 right-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs ${
              product.inStock ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
            }`}>
              {product.inStock ? t('in_stock') : t('out_of_stock')}
            </span>
          </div>
        </div>

        {/* Brand & Category Header */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span 
            className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md"
            style={{ 
              backgroundColor: themeColors.surfaceVariant,
              color: currentTheme.primary
            }}
          >
            {product.brand}
          </span>
          
          {/* Likes & Hearts Interactive Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                incrementLikes(product.id);
              }}
              className="flex items-center gap-0.5 text-[11px] opacity-70 hover:opacity-100 hover:text-blue-500 transition-colors"
            >
              <ThumbsUp className="w-3 h-3" />
              <span>{product.likesCount || 0}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleHeart(product.id);
              }}
              className={`flex items-center gap-0.5 text-[11px] transition-colors ${
                isFavorite ? 'text-rose-500 font-bold' : 'opacity-70 hover:opacity-100 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-3 h-3 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{product.heartsCount || 0}</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={handleCardClick}
          className="text-sm font-bold leading-snug line-clamp-1 cursor-pointer hover:underline"
        >
          {name}
        </h3>

        {/* Specs snippet */}
        <p 
          className="text-[11px] line-clamp-1 mt-1 opacity-75"
          style={{ color: themeColors.textSecondary }}
        >
          {specs || description}
        </p>
      </div>

      {/* Bottom Price & Add to Cart Action */}
      <div className="mt-3 pt-2.5 border-t flex items-center justify-between gap-2" style={{ borderColor: themeColors.border }}>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span 
              className="text-base sm:text-lg font-black tracking-tight"
              style={{ color: currentTheme.primary }}
            >
              ${product.price}
            </span>
            {hasDiscount && (
              <span className="text-[11px] line-through opacity-50">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all ${
            product.inStock 
              ? 'text-white hover:opacity-90' 
              : 'opacity-40 cursor-not-allowed bg-gray-400 text-white'
          }`}
          style={{
            backgroundColor: product.inStock ? currentTheme.primary : undefined
          }}
          title={t('add_to_cart')}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('add_to_cart')}</span>
        </button>
      </div>
    </div>
  );
};
