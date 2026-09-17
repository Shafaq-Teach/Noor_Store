import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { getAssetUrl } from '../utils/assetHelper';
import { 
  Download, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Smartphone, 
  Info,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AppUpdateModal = () => {
  const { currentTheme, themeColors } = useTheme();
  const { storeSettings } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Only show if the store admin has explicitly commanded: updatePublished === true
  const isPublished = storeSettings?.updatePublished === true;
  if (!isPublished || isDismissed) return null;

  const versionStr = storeSettings?.appVersion || '1.0.0';
  const releaseNotes = storeSettings?.appReleaseNotes || 'يېڭى ئىقتىدارلار قوشۇلدى، كۆرۈنمە يۈز ئەلالاشتۇرۇلدى ۋە سۈرئەت تېزلىتىلدى.';
  const downloadUrl = storeSettings?.appDownloadUrl || 'https://github.com/Shafaq-Teach/NoorStore_apk/releases/download/v1.0.0/app-debug.apk';

  const handleUpdateClick = () => {
    setDownloading(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    // 1-Click direct APK download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'NoorStore.apk';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
      <div 
        className="relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          color: themeColors.textPrimary
        }}
      >
        {/* Header Banner */}
        <div 
          className="relative p-5 text-white flex items-center justify-between overflow-hidden flex-shrink-0"
          style={{ background: `linear-gradient(135deg, #10B981, ${currentTheme.primary})` }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <img 
                src={getAssetUrl("/images/img_app_icon_1786037564036.jpg")} 
                alt="Noor Store Logo" 
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">يېڭى نەشر تارقىتىلدى!</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[11px] font-mono font-black">v{versionStr}</span>
              </div>
              <p className="text-xs text-white/90 font-medium">Noor Store ئەپ دېتالىنى يېڭىلاڭ</p>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="relative z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            title="تاقاش"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Release Notes */}
          <div 
            className="p-3.5 rounded-2xl border space-y-1.5"
            style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-500">
              <Sparkles className="w-4 h-4" />
              <span>يېڭىلانغان مەزمۇنلار:</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90 whitespace-pre-line">
              {releaseNotes}
            </p>
          </div>

          {/* Conflict-Free Assurance */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>توقۇنۇشسىز بىر كۇنۇپكا بىلەن يېڭىلاش:</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              كونا نەشرىنى ئۆچۈرۈشنىڭ ھاجىتى يوق. تۆۋەندىكى كۇنۇپكىنى باسسىڭىزلا يېڭى ھۆججەت چۈشۈپ كونا نەشرىنىڭ ئۈستىگە بىۋاسىتە يېڭىلىنىدۇ.
            </p>
          </div>

          {/* 1-Click Update Action Button */}
          <button
            onClick={handleUpdateClick}
            className="w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            style={{ background: `linear-gradient(135deg, #10B981, ${currentTheme.primary})` }}
          >
            <Download className="w-5 h-5 animate-bounce" />
            <span>⬇️ بىر كۇنۇپكا بىلەن دەرھال يېڭىلاش</span>
          </button>

          {downloading && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>يېڭى نەشر چۈشۈرۈلۈۋاتىدۇ! چۈشكەندىن كېيىن تېلېفونىڭىزدا قاچىلاشنى بېسىڭ.</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div 
          className="p-3 sm:p-4 border-t flex items-center justify-between flex-shrink-0"
          style={{ borderColor: themeColors.border, backgroundColor: themeColors.surfaceVariant }}
        >
          <span className="text-[11px] text-slate-400">
            رەسمىي بىخەتەر نەشرى
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
          >
            كېيىن ئەسكەرتىش
          </button>
        </div>
      </div>
    </div>
  );
};
