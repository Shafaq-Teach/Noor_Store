import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { getAssetUrl } from '../utils/assetHelper';
import { 
  PhoneCall, 
  Send, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Building2,
  ExternalLink,
  Smartphone,
  Download
} from 'lucide-react';

export const ContactScreen = () => {
  const { currentTheme, themeColors, t } = useTheme();
  const { openDownloadModal } = useStore();

  const handleCall = () => window.open("tel:0995416715");
  const handleTelegram = () => window.open("https://t.me/sensiz09985", "_blank");
  const handleWhatsApp = () => window.open("https://api.whatsapp.com/send?phone=+860995416715&text=Hello%20Noor%20Store!", "_blank");
  const handleMap = () => {
    const lat = 40.99958;
    const lon = 28.79152;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-3xl mx-auto">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2" style={{ color: themeColors.textPrimary }}>
        <Building2 className="w-5 h-5" style={{ color: currentTheme.primary }} />
        {t('contact_us')}
      </h2>

      {/* Main Store Contact Card */}
      <div 
        className="rounded-3xl p-5 sm:p-6 border shadow-md space-y-4"
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          color: themeColors.textPrimary
        }}
      >
        <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: themeColors.border }}>
          <img 
            src={getAssetUrl("/images/img_app_icon_1786037564036.jpg")} 
            alt="Noor Store" 
            className="w-14 h-14 rounded-2xl object-cover shadow-sm border"
            style={{ borderColor: themeColors.border }}
          />
          <div>
            <h3 className="text-base sm:text-lg font-bold" style={{ color: currentTheme.primary }}>
              {t('app_title')}
            </h3>
            <p className="text-xs opacity-75" style={{ color: themeColors.textSecondary }}>
              {t('app_subtitle')}
            </p>
          </div>
        </div>

        {/* Address & Hours */}
        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{t('store_address')}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>{t('business_hours')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleCall}
            className="p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs shadow-xs hover:scale-102 transition-all bg-emerald-500 text-white"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('call_now')} (0995416715)</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs shadow-xs hover:scale-102 transition-all bg-emerald-600 text-white"
          >
            <img src={getAssetUrl('/icons/whatsapp_3d.jpg')} className="w-5 h-5 rounded-md object-contain" alt="WhatsApp" />
            <span>{t('chat_whatsapp')}</span>
          </button>

          <button
            onClick={handleTelegram}
            className="p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs shadow-xs hover:scale-102 transition-all bg-sky-600 text-white"
          >
            <img src={getAssetUrl('/icons/telegram_3d.png')} className="w-5 h-5 rounded-md object-contain" alt="Telegram" />
            <span>{t('chat_telegram')} (@sensiz09985)</span>
          </button>

          <button
            onClick={handleMap}
            className="p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs shadow-xs hover:scale-102 transition-all bg-amber-500 text-white"
          >
            <MapPin className="w-4 h-4" />
            <span>Google Maps ئارقىلىق كۆرۈش</span>
          </button>
        </div>

        {/* App Download Callout */}
        <div 
          onClick={openDownloadModal}
          className="p-4 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer hover:scale-101 active:scale-99 transition-all"
          style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs">📱 Noor Store رەسمىي يانفون ئەپ دېتالى</h4>
              <p className="text-[10px] opacity-75">Android APK نى بىۋاسىتە تېلېفونىڭىزغا قاچىلاڭ</p>
            </div>
          </div>
          <button 
            className="px-3 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1 shadow-sm"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>چۈشۈرۈش</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Frame */}
      <div 
        className="rounded-3xl border shadow-md overflow-hidden"
        style={{ borderColor: themeColors.border }}
      >
        <iframe
          title="Store Location"
          src="https://maps.google.com/maps?q=40.99958,28.79152&z=15&output=embed"
          className="w-full h-64 border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
};
