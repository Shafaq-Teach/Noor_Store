import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { getAssetUrl } from '../utils/assetHelper';
import { CountryFlag } from './CountryFlag';
import { 
  ShoppingCart, 
  ShieldCheck, 
  Sun, 
  Moon, 
  MapPin, 
  Smartphone, 
  Monitor, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const HeaderBar = () => {
  const { currentTheme, cycleTheme, isDarkMode, toggleDarkMode, language, setLanguage, viewMode, toggleViewMode, themeColors, t } = useTheme();
  const { cartCount, setCurrentScreen, openAiAdvisor } = useStore();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleMapClick = () => {
    const lat = 40.99958;
    const lon = 28.79152;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
  };

  return (
    <header 
      className="sticky top-0 z-40 w-full shadow-md backdrop-blur-md transition-colors duration-300 border-b"
      style={{
        backgroundColor: isDarkMode ? `${themeColors.surface}F0` : `${themeColors.surface}F0`,
        borderColor: themeColors.border,
        color: themeColors.textPrimary
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Branding */}
        <div 
          onClick={() => setCurrentScreen('HOME')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <img 
            src={getAssetUrl("/images/img_app_icon_1786037564036.jpg")} 
            alt="Noor Store" 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-sm border"
            style={{ borderColor: themeColors.border }}
          />
          <div className="flex flex-col">
            <h1 
              className="text-base sm:text-lg font-bold leading-tight tracking-tight flex items-center gap-1.5"
              style={{ color: currentTheme.primary }}
            >
              {t('app_title')}
            </h1>
            <p 
              className="text-[10px] sm:text-xs leading-none opacity-80"
              style={{ color: themeColors.textSecondary }}
            >
              {t('app_subtitle')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

          {/* Map Location */}
          <button
            onClick={handleMapClick}
            className="p-2 rounded-full border shadow-sm hover:opacity-80 active:scale-95 transition-all"
            style={{
              backgroundColor: themeColors.surfaceVariant,
              borderColor: themeColors.border,
              color: themeColors.textPrimary
            }}
            title={t('store_address')}
          >
            <MapPin className="w-4 h-4 text-emerald-500" />
          </button>

          {/* Language Flag Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(prev => !prev)}
              className="p-1.5 rounded-full border shadow-sm hover:opacity-80 active:scale-95 transition-all flex items-center justify-center"
              style={{
                backgroundColor: themeColors.surfaceVariant,
                borderColor: themeColors.border
              }}
              title={t('select_language')}
            >
              <CountryFlag language={language} className="w-5 h-3.5 rounded-xs" />
            </button>

            {/* Language Dropdown */}
            {langDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 py-1.5 px-2 rounded-2xl shadow-xl border z-50 flex items-center gap-2 animate-in fade-in zoom-in-95"
                style={{
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border
                }}
              >
                {[
                  { code: 'uyghur', label: 'ئۇيغۇرچە' },
                  { code: 'arabic', label: 'العربية' },
                  { code: 'english', label: 'English' }
                ].map(item => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`p-1.5 px-2 rounded-xl flex items-center gap-1.5 transition-all ${
                      language === item.code ? 'ring-2 ring-offset-1' : 'hover:opacity-75'
                    }`}
                    style={{
                      backgroundColor: language === item.code ? themeColors.primaryContainer : themeColors.surfaceVariant,
                      color: themeColors.textPrimary,
                      ringColor: currentTheme.primary
                    }}
                  >
                    <CountryFlag language={item.code} className="w-5 h-3.5 rounded-xs" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Cycler (4 Luxury Themes) */}
          <button
            onClick={cycleTheme}
            className="p-1.5 sm:px-2 rounded-full border shadow-sm hover:opacity-80 active:scale-95 transition-all flex items-center gap-1"
            style={{
              backgroundColor: themeColors.surfaceVariant,
              borderColor: currentTheme.primary
            }}
            title={currentTheme.nameUg}
          >
            <span className="text-sm">{currentTheme.emoji}</span>
          </button>

          {/* Light / Dark Mode Switch */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border shadow-sm hover:opacity-80 active:scale-95 transition-all"
            style={{
              backgroundColor: themeColors.surfaceVariant,
              borderColor: themeColors.border,
              color: isDarkMode ? '#F59E0B' : '#0284C7'
            }}
            title="Dark/Light Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart Icon & Badge */}
          <button
            onClick={() => setCurrentScreen('CART')}
            className="relative p-2 rounded-full border shadow-sm hover:opacity-80 active:scale-95 transition-all"
            style={{
              backgroundColor: themeColors.surfaceVariant,
              borderColor: themeColors.border,
              color: currentTheme.primary
            }}
            title={t('cart')}
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-sm animate-bounce"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Panel Icon */}
          <button
            onClick={() => setCurrentScreen('ADMIN')}
            className="p-2 rounded-full border shadow-sm hover:opacity-80 active:scale-95 transition-all"
            style={{
              backgroundColor: themeColors.surfaceVariant,
              borderColor: themeColors.border,
              color: themeColors.textPrimary
            }}
            title={t('admin')}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
