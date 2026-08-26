import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { NasheedPlayer } from '../components/NasheedPlayer';
import { 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  Send, 
  MessageCircle, 
  MapPin, 
  Smartphone, 
  Tablet, 
  Headphones, 
  Watch, 
  Grid, 
  Flame 
} from 'lucide-react';

export const HomeScreen = () => {
  const { currentTheme, themeColors, language, isDarkMode, t } = useTheme();
  const { 
    featuredProducts, 
    categories, 
    setSelectedCategoryId, 
    setCurrentScreen 
  } = useStore();

  const handleCategorySelect = (catId) => {
    setSelectedCategoryId(catId);
    setCurrentScreen('PRODUCTS');
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Smartphone': return Smartphone;
      case 'Tablet': return Tablet;
      case 'Headphones': return Headphones;
      case 'Watch': return Watch;
      default: return Grid;
    }
  };

  const handleCallClick = () => {
    window.open("tel:0995416715");
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/sensiz09985?text=Hello%20Noor%20Store!", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://api.whatsapp.com/send?phone=+860995416715&text=Hello%20Noor%20Store!", "_blank");
  };

  const handleMapClick = () => {
    const lat = 40.99958;
    const lon = 28.79152;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in">
      {/* Hero Banner Card */}
      <div 
        className="relative w-full rounded-3xl overflow-hidden shadow-xl border min-h-[220px] sm:min-h-[250px] flex flex-col justify-between p-4 sm:p-6 text-white"
        style={{ borderColor: themeColors.border }}
      >
        {/* Background Banner Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('/images/img_east_turkestan_banner_1786190275040.jpg')` }}
        />
        {/* Dark Gradient Overlay for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

        {/* Top Floating Gadgets preview badges */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 p-1 px-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20">
            <img 
              src="/images/img_phones_1786037591338.jpg" 
              alt="Phones" 
              className="w-7 h-7 rounded-lg object-cover"
            />
            <span className="text-[11px] font-bold text-sky-200">{t('phones')}</span>
          </div>

          <div className="flex items-center gap-2 p-1 px-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20">
            <img 
              src="/images/img_tablets_1786037603482.jpg" 
              alt="Tablets" 
              className="w-7 h-7 rounded-lg object-cover"
            />
            <span className="text-[11px] font-bold text-amber-200">{t('tablets')}</span>
          </div>
        </div>

        {/* Middle Headlines */}
        <div className="relative z-10 text-center my-auto py-2">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider mb-1.5 border"
            style={{ 
              backgroundColor: `${currentTheme.primary}CC`,
              borderColor: 'rgba(255,255,255,0.3)'
            }}
          >
            <Sparkles className="w-3 h-3 animate-spin" />
            {t('hero_official_badge')}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md">
            {t('app_title')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-md mx-auto drop-shadow-sm font-medium">
            {t('hero_features_list')}
          </p>
        </div>

        {/* Bottom Banner Actions */}
        <div className="relative z-10 flex items-center justify-between gap-2 pt-2 border-t border-white/20">
          <span className="text-[11px] text-gray-300 font-semibold truncate">
            {t('store_address')}
          </span>
          <button
            onClick={() => setCurrentScreen('PRODUCTS')}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all text-white flex items-center gap-1 flex-shrink-0"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <span>{t('view_details')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Nasheed Audio Player Integration */}
      <NasheedPlayer />

      {/* Categories Horizontal Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm sm:text-base font-bold flex items-center gap-1.5" style={{ color: themeColors.textPrimary }}>
            <Grid className="w-4 h-4" style={{ color: currentTheme.primary }} />
            {t('categories')}
          </h3>
          <button 
            onClick={() => setCurrentScreen('PRODUCTS')}
            className="text-xs font-semibold hover:underline"
            style={{ color: currentTheme.primary }}
          >
            {t('all')}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {categories.map(cat => {
            const Icon = getCategoryIcon(cat.icon);
            const catName = language === 'uyghur' ? cat.nameUg : language === 'arabic' ? cat.nameAr : cat.nameEn;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="group p-3 sm:p-4 rounded-3xl border shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center gap-3 select-none"
                style={{
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border
                }}
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold truncate leading-tight" style={{ color: themeColors.textPrimary }}>
                    {catName}
                  </h4>
                  <span className="text-[10px] opacity-70 mt-0.5" style={{ color: themeColors.textSecondary }}>
                    {t('view_details')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Products Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
            <h3 className="text-sm sm:text-base font-bold" style={{ color: themeColors.textPrimary }}>
              {t('featured_products')}
            </h3>
          </div>
          <button 
            onClick={() => setCurrentScreen('PRODUCTS')}
            className="text-xs font-semibold hover:underline flex items-center gap-1"
            style={{ color: currentTheme.primary }}
          >
            <span>{t('all')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Quick Contact & Store Location Actions */}
      <div 
        className="rounded-3xl p-4 sm:p-5 border shadow-md space-y-3.5"
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border
        }}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: themeColors.textPrimary }}>
            <PhoneCall className="w-4 h-4 text-emerald-500" />
            {t('contact_us')}
          </h4>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: themeColors.textSecondary }}>
            {t('business_hours')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={handleCallClick}
            className="p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs shadow-xs hover:scale-102 active:scale-98 transition-all bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('call_now')}</span>
          </button>

          <button
            onClick={handleWhatsAppClick}
            className="p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs shadow-xs hover:scale-102 active:scale-98 transition-all bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('whatsapp')}</span>
          </button>

          <button
            onClick={handleTelegramClick}
            className="p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs shadow-xs hover:scale-102 active:scale-98 transition-all bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
          >
            <Send className="w-4 h-4" />
            <span>{t('telegram')}</span>
          </button>

          <button
            onClick={handleMapClick}
            className="p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs shadow-xs hover:scale-102 active:scale-98 transition-all bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
          >
            <MapPin className="w-4 h-4" />
            <span>{t('store_address').split(':')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
