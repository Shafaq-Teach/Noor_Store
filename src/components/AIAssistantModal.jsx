import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { getAssetUrl } from '../utils/assetHelper';
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  ShoppingBag, 
  Bot, 
  User, 
  ChevronRight,
  ExternalLink 
} from 'lucide-react';

export const AIAssistantModal = () => {
  const { currentTheme, themeColors, language, isDarkMode, t } = useTheme();
  const { 
    isAiAdvisorOpen, 
    closeAiAdvisor, 
    aiChatMessages, 
    isAiThinking, 
    askAiAdvisor, 
    resetAiChat,
    addToCart,
    setSelectedProduct,
    setCurrentScreen
  } = useStore();

  const [inputQuery, setInputQuery] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isAiAdvisorOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatMessages, isAiThinking, isAiAdvisorOpen]);

  if (!isAiAdvisorOpen) return null;

  const quickPrompts = [
    { key: 'ai_quick_camera', query: '📸 ئەڭ ياخشى كامېرا بار تېلېفون' },
    { key: 'ai_quick_study', query: '📚 ئوقۇش ۋە رەسىم سىزىشقا پەد' },
    { key: 'ai_quick_budget', query: '💰 3000 يۈەندىن تۆۋەن ئەڭ كۈچلۈك' },
    { key: 'ai_quick_battery', query: '⚡ باتارېيەسى ئەڭ ئۇزۇنغا يېتىدىغان' },
    { key: 'ai_quick_gaming', query: '🎮 ئويۇن ۋە يۇقىرى سۈرئەتكە' }
  ];

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputQuery.trim()) return;
    askAiAdvisor(inputQuery);
    setInputQuery('');
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    closeAiAdvisor();
    setCurrentScreen('PRODUCT_DETAIL');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-lg h-[88vh] max-h-[700px] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-300 animate-in zoom-in-95"
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          color: themeColors.textPrimary
        }}
      >
        {/* Modal Header */}
        <div 
          className="p-3.5 sm:p-4 border-b flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary}15, ${currentTheme.secondary}15)`,
            borderColor: themeColors.border
          }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
                {t('ai_assistant_title')}
              </h3>
              <p className="text-[11px] opacity-75" style={{ color: themeColors.textSecondary }}>
                {t('ai_assistant_subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={resetAiChat}
              className="p-2 rounded-full hover:opacity-75 transition-opacity"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4 opacity-70" />
            </button>
            <button
              onClick={closeAiAdvisor}
              className="p-2 rounded-full hover:opacity-75 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div 
          className="p-2.5 border-b overflow-x-auto flex items-center gap-2 no-scrollbar"
          style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
        >
          {quickPrompts.map(item => (
            <button
              key={item.key}
              onClick={() => askAiAdvisor(t(item.key))}
              className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs border transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              style={{
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border,
                color: currentTheme.primary
              }}
            >
              {t(item.key)}
            </button>
          ))}
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5">
          {aiChatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-1`}
            >
              <div className="flex items-start gap-2 max-w-[90%]">
                {!msg.isUser && (
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-1 shadow-sm"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div 
                  className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.isUser 
                      ? 'rounded-tr-xs text-white' 
                      : 'rounded-tl-xs border'
                  }`}
                  style={{
                    backgroundColor: msg.isUser ? currentTheme.primary : themeColors.surfaceVariant,
                    borderColor: msg.isUser ? 'transparent' : themeColors.border,
                    color: msg.isUser ? '#FFFFFF' : themeColors.textPrimary
                  }}
                >
                  {msg.text}
                </div>

                {msg.isUser && (
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-1 shadow-sm"
                    style={{ backgroundColor: currentTheme.secondary }}
                  >
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Recommended Product Cards inside AI Message */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="mt-2.5 w-full space-y-2 pr-9 pl-9">
                  {msg.recommendedProducts.map(product => {
                    const pName = language === 'uyghur' ? product.nameUg : language === 'arabic' ? product.nameAr : product.nameEn;
                    const pSpecs = language === 'uyghur' ? product.specsUg : language === 'arabic' ? product.specsAr : product.specsEn;

                    return (
                      <div 
                        key={product.id}
                        className="p-2.5 rounded-2xl border shadow-sm flex items-center justify-between gap-2.5 transition-all hover:scale-[1.01]"
                        style={{
                          backgroundColor: themeColors.surface,
                          borderColor: themeColors.border
                        }}
                      >
                        <img 
                          src={getAssetUrl(product.imageResName || "/images/img_phones_1786037591338.jpg")} 
                          alt={pName}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-black/5"
                          onError={(e) => { e.target.src = getAssetUrl("/images/img_phones_1786037591338.jpg"); }}
                        />

                        <div className="flex-1 min-w-0" onClick={() => handleProductSelect(product)}>
                          <h5 className="text-xs font-bold truncate cursor-pointer hover:underline">
                            {pName}
                          </h5>
                          <p className="text-[10px] opacity-70 truncate mt-0.5" style={{ color: themeColors.textSecondary }}>
                            {pSpecs}
                          </p>
                          <span className="text-xs font-black mt-1 inline-block" style={{ color: currentTheme.primary }}>
                            ¥{product.price}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => addToCart(product)}
                            className="p-2 rounded-xl text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
                            style={{ backgroundColor: currentTheme.primary }}
                            title={t('add_to_cart')}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleProductSelect(product)}
                            className="p-2 rounded-xl border hover:opacity-80 transition-opacity"
                            style={{ borderColor: themeColors.border }}
                            title={t('view_details')}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Thinking Animation */}
          {isAiThinking && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div 
                className="p-3 px-4 rounded-2xl rounded-tl-xs border text-xs flex items-center gap-1.5 shadow-sm"
                style={{
                  backgroundColor: themeColors.surfaceVariant,
                  borderColor: themeColors.border,
                  color: themeColors.textSecondary
                }}
              >
                <span>{t('ai_thinking')}</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Footer */}
        <form 
          onSubmit={handleSend}
          className="p-3 border-t flex items-center gap-2"
          style={{
            backgroundColor: themeColors.surfaceVariant,
            borderColor: themeColors.border
          }}
        >
          <input 
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t('ask_ai')}
            className="flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm border focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
              color: themeColors.textPrimary,
              ringColor: currentTheme.primary
            }}
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isAiThinking}
            className="p-2.5 rounded-2xl text-white shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
