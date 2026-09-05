import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { getAssetUrl } from '../utils/assetHelper';
import { 
  Smartphone, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ExternalLink,
  Apple,
  Share2,
  PlusSquare,
  HelpCircle,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AppDownloadModal = () => {
  const { currentTheme, themeColors, isDarkMode, language, t } = useTheme();
  const { isDownloadModalOpen, closeDownloadModal } = useStore();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('android'); // 'android' | 'ios'

  if (!isDownloadModalOpen) return null;

  const handleDownloadClick = () => {
    setDownloadStarted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    // Trigger download
    const link = document.createElement('a');
    link.href = getAssetUrl('/NoorStore.apk');
    link.download = 'NoorStore.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          color: themeColors.textPrimary
        }}
      >
        {/* Header with decorative background */}
        <div 
          className="relative p-5 sm:p-6 text-white flex items-center justify-between overflow-hidden flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
        >
          {/* Subtle background glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/15 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex items-center gap-3">
            <img 
              src={getAssetUrl("/images/img_app_icon_1786037564036.jpg")} 
              alt="Noor Store App" 
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">Noor Store ئەپ دېتالى</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">v1.0.32</span>
              </div>
              <p className="text-xs text-white/90 font-medium">نۇر دۇكىنى يانفون ئەپ دېتالىنى چۈشۈرۈش مەركىزى</p>
            </div>
          </div>

          <button
            onClick={closeDownloadModal}
            className="relative z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Android (APK) vs iPhone (iOS PWA) */}
        <div className="p-3 bg-slate-900/40 border-b flex items-center gap-2" style={{ borderColor: themeColors.border }}>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'android' ? 'shadow-md scale-102 text-white' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'android' ? currentTheme.primary : themeColors.surfaceVariant,
              color: activeTab === 'android' ? '#FFFFFF' : themeColors.textPrimary
            }}
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 Android (APK چۈشۈرۈش)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'ios' ? 'shadow-md scale-102 text-white' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'ios' ? currentTheme.primary : themeColors.surfaceVariant,
              color: activeTab === 'ios' ? '#FFFFFF' : themeColors.textPrimary
            }}
          >
            <Apple className="w-4 h-4" />
            <span>🍎 iPhone (ئېكرانغا قوشۇش)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {activeTab === 'android' ? (
            <div className="space-y-4">
              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl border flex items-center gap-2.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs">چاقماق تېز سۈرئەت</h5>
                    <p className="text-[10px] opacity-80">سېستىما بىلەن بىۋاسىتە باغلانغان</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl border flex items-center gap-2.5 bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs">كاپالەتلىك & بىخەتەر</h5>
                    <p className="text-[10px] opacity-80">رەسمىي كود ۋە ۋىرۇسسىز</p>
                  </div>
                </div>
              </div>

              {/* Main Download Button */}
              <div className="p-4 rounded-3xl border text-center space-y-3" style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}>
                <p className="text-xs text-slate-400 font-medium">
                  ھۆججەت نامى: <strong className="text-emerald-400">NoorStore.apk</strong> | سىغىمى: <strong>53.9 MB</strong>
                </p>
                
                <button
                  onClick={handleDownloadClick}
                  className="w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 hover:scale-102 active:scale-98 transition-all"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
                >
                  <Download className="w-5 h-5 animate-bounce" />
                  <span>⬇️ بىۋاسىتە چۈشۈرۈش (NoorStore.apk)</span>
                </button>

                {downloadStarted && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>چۈشۈرۈش باشلاندى! تېلېفونىڭىزدىكى چۈشۈرۈلگەن ھۆججەتنى ئېچىپ قاچىلاڭ.</span>
                  </div>
                )}
              </div>

              {/* 3-Step Installation Guide */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-black/20 border" style={{ borderColor: themeColors.border }}>
                <h4 className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>📖 ئاندىروئىد تېلېفونغا قاچىلاش باسقۇچلىرى:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                  <li>يۇقىرىدىكى <strong>«بىۋاسىتە چۈشۈرۈش»</strong> كۇنۇپكىسىنى بېسىپ APK ھۆججىتىنى چۈشۈرۈڭ.</li>
                  <li>چۈشۈرۈش پۈتكەندىن كېيىن ھۆججەتنى ئېچىپ <strong>«قاچىلاش (Install)»</strong> نى بېسىڭ.</li>
                  <li>ئەگەر تېلېفون <em>«نامەلۇم مەنبە»</em> دەپ سورىسا، <strong>«رۇخسەت بېرىش (Allow from this source)»</strong> نى تاللاپ بەرسىڭىزلا دەرھال قاچىلىنىدۇ.</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl border space-y-3" style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-xl">
                    🍎
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">iPhone ۋە iPad ئۈچۈن تور ئەپ دېتالى (PWA)</h4>
                    <p className="text-[11px] text-slate-400">قاچىلاش ھۆججىتى چۈشۈرمەيلا بىر سېكۇنتتا يانفون ئېكرانىغا قوشۇۋېلىڭ</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t text-xs leading-relaxed text-slate-200" style={{ borderColor: themeColors.border }}>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                    <p>iPhone تېلېفونىڭىزدىكى <strong>Safari</strong> تور كۆرگۈچ بىلەن تور بېكىتىمىزنى ئېچىڭ.</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                    <p className="flex items-center gap-1.5 flex-wrap">
                      ئاستىدىكى <strong>«ئورتاقلىشىش»</strong> <Share2 className="w-3.5 h-3.5 text-sky-400 inline" /> كۇنۇپكىسىنى بېسىڭ.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                    <p className="flex items-center gap-1.5 flex-wrap">
                      تاللانمىلاردىن <strong>«ئاساسىي ئېكرانغا قوشۇش (Add to Home Screen)»</strong> <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" /> نى تاللاڭ.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[11px] font-medium text-center">
                  ✨ تېلېفونىڭىزنىڭ باش ئېكرانىدا Noor Store نىڭ چىرايلىق دېتال بەلگىسى پەيدا بولىدۇ!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t flex items-center justify-between flex-shrink-0" style={{ borderColor: themeColors.border, backgroundColor: themeColors.surfaceVariant }}>
          <span className="text-[11px] text-slate-400 font-semibold">
            🌐 Noor Store Cloud Platform
          </span>
          <button
            onClick={closeDownloadModal}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            تاقاش
          </button>
        </div>
      </div>
    </div>
  );
};
