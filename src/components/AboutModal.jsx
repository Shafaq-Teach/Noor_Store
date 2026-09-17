import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { getAssetUrl } from '../utils/assetHelper';
import { 
  X, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

export const AboutModal = () => {
  const { currentTheme, themeColors } = useTheme();
  const { isAboutModalOpen, closeAboutModal, storeSettings } = useStore();

  if (!isAboutModalOpen) return null;

  const currentVersion = storeSettings?.appVersion || '1.0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
      <div 
        className="relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          color: themeColors.textPrimary
        }}
      >
        {/* Top Header */}
        <div 
          className="relative p-5 sm:p-6 text-white flex items-center justify-between overflow-hidden flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <img 
              src={getAssetUrl("/images/img_app_icon_1786037564036.jpg")} 
              alt="Noor Store Logo" 
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">بىز ھەققىدە (About Us)</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">v{currentVersion}</span>
              </div>
              <p className="text-xs text-white/90 font-medium">Noor Store | نۇر تاللا بازىرى سۇپىسى</p>
            </div>
          </div>

          <button
            onClick={closeAboutModal}
            className="relative z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Brief Platform Introduction */}
          <div 
            className="p-4 rounded-3xl border space-y-2.5"
            style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                {storeSettings?.storeName || 'Noor Store (نۇرلۇق تېلېفونچىلىقى)'}
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {storeSettings?.storeSlogan || 'ئەڭ يېڭى يانفون، تاختا كومپيۇتېر ۋە ئېلېكترونلۇق تېخنىكا قوشۇمچە بۇيۇملىرىنى ئىشەنچلىك يەتكۈزۈش سۇپىسى.'}
            </p>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              بۇ سۇپا يانفون ئەپ دېتالى (Android APK & iOS PWA) ۋە دۇنياۋى تېز تور بېكەتنى بىرلەشتۈرگەن بولۇپ، زامانىۋى مەھسۇلات باشقۇرۇش، ھەقىقىي ۋاقىتلىق باھا كۆرۈش، تېز خېرىدارلار زاكاز سىستېمىسى بىلەن تەمىنلەيدۇ.
            </p>
          </div>

          {/* Version & Technical Highlights */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Smartphone className="w-4 h-4" />
                <span>ئەپ نەشرى</span>
              </div>
              <p className="text-sm font-black">v{currentVersion} (رەسمىي)</p>
            </div>

            <div className="p-3 rounded-2xl border bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>بىخەتەرلىك</span>
              </div>
              <p className="text-sm font-black">SSL & Cloud Lock</p>
            </div>
          </div>

          {/* Core Features */}
          <div 
            className="p-4 rounded-3xl border space-y-2.5"
            style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
          >
            <h5 className="font-bold text-xs flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>ئاساسلىق ئىقتىدارلىرىمىز:</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span><strong>24/7 بۇلۇت ئۇلىنىشى:</strong> تور بەت ۋە تېلېفون دېتالى ماس قەدەملىك يېڭىلىنىدۇ.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span><strong>بىر كۇنۇپكا زاكاز:</strong> خېرىدارلار WhatsApp ئارقىلىق بىۋاسىتە سېتىۋالالايدۇ.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span><strong>كۆپ تىللىق كۆرۈنمە يۈز:</strong> ئۇيغۇرچە، ئەرەبچە ۋە ئىنگلىزچە قوللاش.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span><strong>ئاپتوماتىك نەشر كونترول:</strong> ئەپ دېتالى يېڭىلانغاندا ئابونتلارغا ئاپتوماتىك ئۇقتۇرۇلىدۇ.</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div 
            className="p-4 rounded-3xl border space-y-2"
            style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
          >
            <h5 className="font-bold text-xs flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
              <Phone className="w-4 h-4 text-sky-500" />
              <span>دۇكان ئالاقە ئۇچۇرلىرى:</span>
            </h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-700/20">
                <span className="opacity-70">تېلېفون / WhatsApp:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
                  {storeSettings?.whatsappNumber || storeSettings?.phone || '+963985400125'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-700/20">
                <span className="opacity-70">تېلېگرام قانال:</span>
                <a 
                  href={storeSettings?.telegramChannel || 'https://t.me/NoorStore2'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-mono font-bold text-sky-500 hover:underline" 
                  dir="ltr"
                >
                  {storeSettings?.telegramChannel?.replace('https://t.me/', '@') || '@NoorStore2'}
                </a>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-700/20">
                <span className="opacity-70">تېلېگرام ئالاقە:</span>
                <span className="font-mono font-bold text-sky-500" dir="ltr">
                  {storeSettings?.telegramContact || '@sensiz09985'}
                </span>
              </div>
              <div className="flex items-start justify-between py-1">
                <span className="opacity-70 flex-shrink-0 ml-2">ئادرېس:</span>
                <span className="text-right text-[11px] leading-tight">
                  {storeSettings?.address || 'ئىدلىپ شەھىرى، ئالتۇن بازىرى تېلېفون كوچىسى.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div 
          className="p-3 sm:p-4 border-t flex items-center justify-between flex-shrink-0"
          style={{ borderColor: themeColors.border, backgroundColor: themeColors.surfaceVariant }}
        >
          <span className="text-[11px] text-slate-400 font-semibold">
            © {new Date().getFullYear()} Noor Store • بارلىق ھوقۇق قوغدىلىدۇ
          </span>
          <button
            onClick={closeAboutModal}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            تاقاش
          </button>
        </div>
      </div>
    </div>
  );
};
