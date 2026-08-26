import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Send, 
  MessageCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles,
  Receipt,
  FileText
} from 'lucide-react';

export const CartScreen = () => {
  const { currentTheme, themeColors, language, isDarkMode, t } = useTheme();
  const { 
    cartItems, 
    cartCount, 
    cartSubtotal, 
    discountAmount, 
    finalTotal, 
    addToCart, 
    decreaseCartQuantity, 
    removeFromCart, 
    clearCart,
    coupons,
    appliedCoupon,
    couponMessage,
    applyCoupon,
    removeCoupon,
    submitOrder,
    lastPlacedInvoice,
    setCurrentScreen 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
  };

  const handleOrderSubmit = (channel) => {
    if (!customerName.trim()) {
      alert(t('customer_name') + " ?");
      return;
    }
    if (!customerPhone.trim()) {
      alert(t('customer_phone') + " ?");
      return;
    }
    submitOrder(customerName, customerPhone, orderNote, channel);
  };

  const handleCopyInvoice = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2500);
  };

  if (cartItems.length === 0 && !lastPlacedInvoice) {
    return (
      <div 
        className="rounded-3xl p-8 sm:p-12 text-center border shadow-sm space-y-4 my-8 max-w-md mx-auto animate-in fade-in"
        style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
      >
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-gray-500/10 opacity-70">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold" style={{ color: themeColors.textPrimary }}>
          {t('cart_empty')}
        </h3>
        <p className="text-xs opacity-70" style={{ color: themeColors.textSecondary }}>
          {t('app_subtitle')}
        </p>
        <button
          onClick={() => setCurrentScreen('PRODUCTS')}
          className="px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md text-white hover:scale-105 active:scale-95 transition-all"
          style={{ backgroundColor: currentTheme.primary }}
        >
          {t('products')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2" style={{ color: themeColors.textPrimary }}>
          <ShoppingCart className="w-5 h-5" style={{ color: currentTheme.primary }} />
          {t('cart_title')} ({cartCount})
        </h2>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('clear_cart')}</span>
          </button>
        )}
      </div>

      {/* Cart Layout: Items & Checkout Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-3">
          {cartItems.map(item => {
            const p = item.product;
            const pName = language === 'uyghur' ? p.nameUg : language === 'arabic' ? p.nameAr : p.nameEn;
            const pSpecs = language === 'uyghur' ? p.specsUg : language === 'arabic' ? p.specsAr : p.specsEn;

            return (
              <div 
                key={p.id}
                className="p-3 sm:p-4 rounded-3xl border shadow-sm flex items-center gap-3 sm:gap-4 transition-all"
                style={{
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary
                }}
              >
                {/* Product Thumb */}
                <img 
                  src={p.imageResName || "/images/img_phones_1786037591338.jpg"} 
                  alt={pName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-black/5 flex-shrink-0"
                  onError={(e) => { e.target.src = "/images/img_phones_1786037591338.jpg"; }}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: themeColors.surfaceVariant, color: currentTheme.primary }}
                    >
                      {p.brand}
                    </span>
                    <button
                      onClick={() => removeFromCart(p.id)}
                      className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                      title={t('delete_product')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold truncate mt-0.5">
                    {pName}
                  </h4>
                  <p className="text-[10px] opacity-70 truncate" style={{ color: themeColors.textSecondary }}>
                    {pSpecs}
                  </p>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="text-sm sm:text-base font-black" style={{ color: currentTheme.primary }}>
                      ¥{(p.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Stepper */}
                    <div 
                      className="flex items-center gap-2 p-1 px-2 rounded-xl border"
                      style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
                    >
                      <button
                        onClick={() => decreaseCartQuantity(p.id)}
                        className="p-1 rounded-md hover:opacity-75 transition-opacity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(p)}
                        className="p-1 rounded-md hover:opacity-75 transition-opacity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Available Coupons Drawer */}
          <div 
            className="p-4 rounded-3xl border shadow-xs space-y-2"
            style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
          >
            <h4 className="text-xs font-bold flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
              <Tag className="w-3.5 h-3.5" />
              {t('available_coupons')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {coupons.map(c => {
                const desc = language === 'uyghur' ? c.descUg : language === 'arabic' ? c.descAr : c.descEn;
                return (
                  <div 
                    key={c.code}
                    onClick={() => {
                      setCouponInput(c.code);
                      applyCoupon(c.code);
                    }}
                    className="p-2.5 rounded-2xl border border-dashed cursor-pointer hover:scale-102 transition-all flex items-center justify-between text-xs"
                    style={{ backgroundColor: themeColors.surfaceVariant, borderColor: currentTheme.primary }}
                  >
                    <div>
                      <span className="font-bold tracking-wider block" style={{ color: currentTheme.primary }}>
                        {c.code}
                      </span>
                      <span className="text-[10px] opacity-75">{desc}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      {t('apply_code')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary & Order Submission */}
        <div className="lg:col-span-5 space-y-4">
          <div 
            className="p-5 rounded-3xl border shadow-md space-y-4"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
              color: themeColors.textPrimary
            }}
          >
            <h3 className="text-sm font-bold border-b pb-2 flex items-center gap-2" style={{ borderColor: themeColors.border }}>
              <Receipt className="w-4 h-4" style={{ color: currentTheme.primary }} />
              {t('total_price')}
            </h3>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input 
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder={t('coupon_placeholder')}
                className="flex-1 px-3 py-2 rounded-xl text-xs border uppercase tracking-wider focus:outline-none"
                style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-xs hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {t('apply_code')}
              </button>
            </form>

            {/* Coupon Feedback Message */}
            {couponMessage && (
              <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                couponMessage.type === 'success' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}>
                <span>{couponMessage.text}</span>
                {appliedCoupon && (
                  <button onClick={removeCoupon} className="font-bold underline text-[10px]">
                    {t('cancel')}
                  </button>
                )}
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="opacity-70">{t('subtotal')}:</span>
                <span className="font-bold">¥{cartSubtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>{t('discount')} ({appliedCoupon?.code}):</span>
                  <span>-¥{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black pt-2 border-t" style={{ borderColor: themeColors.border, color: currentTheme.primary }}>
                <span>{t('total_price')}:</span>
                <span>¥{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Customer Inputs Form */}
            <div className="space-y-2.5 pt-2 border-t" style={{ borderColor: themeColors.border }}>
              <input 
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('customer_name') + " *"}
                className="w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none"
                style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
              />
              <input 
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t('customer_phone') + " *"}
                className="w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none"
                style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
              />
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder={t('order_note')}
                rows="2"
                className="w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none resize-none"
                style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
              />
            </div>

            {/* Order Submission Channels */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleOrderSubmit('whatsapp')}
                className="w-full py-3 rounded-2xl bg-green-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('send_order')} ({t('whatsapp')})</span>
              </button>

              <button
                onClick={() => handleOrderSubmit('telegram')}
                className="w-full py-3 rounded-2xl bg-sky-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{t('send_order')} ({t('telegram')})</span>
              </button>
            </div>
          </div>

          {/* Last Placed Order Invoice Sharing */}
          {lastPlacedInvoice && (
            <div 
              className="p-4 rounded-3xl border shadow-md space-y-2.5 bg-emerald-500/10 border-emerald-500/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  {t('order_success')}
                </span>
                <button
                  onClick={() => handleCopyInvoice(lastPlacedInvoice)}
                  className="text-xs font-bold flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {copiedInvoice ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedInvoice ? t('invoice_copied') : t('share_invoice')}</span>
                </button>
              </div>
              <pre className="text-[10px] font-mono leading-relaxed p-2.5 rounded-xl bg-black/10 overflow-x-auto whitespace-pre-wrap max-h-40">
                {lastPlacedInvoice}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
