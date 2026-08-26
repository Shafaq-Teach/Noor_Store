import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  ThumbsUp, 
  ShoppingBag, 
  MessageCircle, 
  Send, 
  PhoneCall, 
  Scale, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Star,
  User,
  MessageSquare
} from 'lucide-react';

export const ProductDetailScreen = () => {
  const { currentTheme, themeColors, language, isDarkMode, t } = useTheme();
  const { 
    selectedProduct, 
    setCurrentScreen, 
    addToCart, 
    toggleHeart, 
    incrementLikes, 
    toggleCompare, 
    isCompared,
    getReviewsForProduct,
    addReview
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!selectedProduct) {
    return (
      <div className="p-8 text-center">
        <button 
          onClick={() => setCurrentScreen('PRODUCTS')}
          className="px-4 py-2 rounded-2xl text-white font-bold text-xs"
          style={{ backgroundColor: currentTheme.primary }}
        >
          {t('products')}
        </button>
      </div>
    );
  }

  const p = selectedProduct;
  const name = language === 'uyghur' ? p.nameUg : language === 'arabic' ? p.nameAr : p.nameEn;
  const description = language === 'uyghur' ? p.descriptionUg : language === 'arabic' ? p.descriptionAr : p.descriptionEn;
  const specs = language === 'uyghur' ? p.specsUg : language === 'arabic' ? p.specsAr : p.specsEn;

  // Images list
  const allImages = [p.imageResName, p.imageResName2, p.imageResName3].filter(Boolean);
  if (allImages.length === 0) allImages.push('/images/img_phones_1786037591338.jpg');

  const hasDiscount = p.originalPrice && p.originalPrice > p.price;
  const discountPercent = hasDiscount ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
  const compared = isCompared(p.id);
  const isFavorite = p.heartsCount > 0;
  const productReviews = getReviewsForProduct(p.id);

  const handleOrderWhatsApp = () => {
    const msg = `I want to buy: ${name} (¥${p.price})`;
    window.open(`https://api.whatsapp.com/send?phone=+860995416715&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleOrderTelegram = () => {
    const msg = `I want to buy: ${name} (¥${p.price})`;
    window.open(`https://t.me/sensiz09985?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCallStore = () => {
    window.open("tel:0995416715");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(p.id, reviewerName, reviewComment);
    setReviewComment('');
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('PRODUCTS')}
          className="flex items-center gap-1.5 p-2 px-3.5 rounded-2xl border shadow-xs text-xs font-bold hover:opacity-80 transition-all"
          style={{
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
            color: themeColors.textPrimary
          }}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('products')}</span>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => incrementLikes(p.id)}
            className="flex items-center gap-1 p-2 px-3 rounded-2xl border shadow-xs text-xs font-bold hover:text-blue-500 transition-colors"
            style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.textPrimary }}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{p.likesCount || 0}</span>
          </button>

          <button
            onClick={() => toggleHeart(p.id)}
            className={`flex items-center gap-1 p-2 px-3 rounded-2xl border shadow-xs text-xs font-bold transition-colors ${
              isFavorite ? 'text-rose-500' : 'hover:text-rose-500'
            }`}
            style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border, color: isFavorite ? '#F43F5E' : themeColors.textPrimary }}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            <span>{p.heartsCount || 0}</span>
          </button>

          <button
            onClick={() => toggleCompare(p)}
            className={`p-2 px-3 rounded-2xl border shadow-xs text-xs font-bold flex items-center gap-1 transition-all ${
              compared ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: compared ? currentTheme.primary : themeColors.surface,
              borderColor: compared ? currentTheme.primary : themeColors.border,
              color: compared ? '#FFFFFF' : themeColors.textPrimary
            }}
          >
            {compared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{compared ? t('compared') : t('compare')}</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Gallery & Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div 
            className="relative w-full aspect-square rounded-3xl overflow-hidden border shadow-md bg-black/5 flex items-center justify-center"
            style={{ borderColor: themeColors.border }}
          >
            <img 
              src={allImages[activeImageIdx] || allImages[0]} 
              alt={name}
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => { e.target.src = "/images/img_phones_1786037591338.jpg"; }}
            />

            {p.isFeatured && (
              <span 
                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1"
                style={{ backgroundColor: currentTheme.secondary }}
              >
                <Sparkles className="w-3 h-3" />
                {t('featured')}
              </span>
            )}

            {hasDiscount && (
              <span className="absolute bottom-3 left-3 bg-red-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                -{discountPercent}% {t('discount_off')}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIdx === idx ? 'ring-2 scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    borderColor: activeImageIdx === idx ? currentTheme.primary : themeColors.border,
                    ringColor: currentTheme.primary
                  }}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Card */}
        <div 
          className="rounded-3xl p-5 sm:p-6 border shadow-md space-y-4"
          style={{
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
            color: themeColors.textPrimary
          }}
        >
          {/* Brand & Stock Header */}
          <div className="flex items-center justify-between">
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
              style={{ backgroundColor: themeColors.surfaceVariant, color: currentTheme.primary }}
            >
              {p.brand}
            </span>

            <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-xs ${
              p.inStock ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
            }`}>
              {p.inStock ? `● ${t('in_stock')}` : `○ ${t('out_of_stock')}`}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-black leading-snug">
            {name}
          </h2>

          {/* Price Tag */}
          <div className="flex items-baseline gap-2.5 py-1 border-b" style={{ borderColor: themeColors.border }}>
            <span className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: currentTheme.primary }}>
              ¥{p.price}
            </span>
            {hasDiscount && (
              <span className="text-sm line-through opacity-50">
                ¥{p.originalPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold opacity-60 uppercase tracking-wider">
              {t('description_ug').split('(')[0]}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">
              {description}
            </p>
          </div>

          {/* Technical Specifications */}
          {specs && (
            <div 
              className="p-3.5 rounded-2xl border space-y-1"
              style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
            >
              <h4 className="text-xs font-bold flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
                <ShieldCheck className="w-4 h-4" />
                {t('specifications')}
              </h4>
              <p className="text-xs leading-relaxed opacity-90 font-medium">
                {specs}
              </p>
            </div>
          )}

          {/* Action Order Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Add to Cart Primary Button */}
            <button
              onClick={() => addToCart(p)}
              disabled={!p.inStock}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t('add_to_cart')}</span>
            </button>

            {/* Direct Instant Order Channels */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOrderWhatsApp}
                className="p-2.5 rounded-2xl border flex items-center justify-center gap-1.5 text-xs font-bold shadow-xs hover:scale-102 transition-all bg-green-500 text-white"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('order_via_whatsapp')}</span>
              </button>

              <button
                onClick={handleOrderTelegram}
                className="p-2.5 rounded-2xl border flex items-center justify-center gap-1.5 text-xs font-bold shadow-xs hover:scale-102 transition-all bg-sky-500 text-white"
              >
                <Send className="w-4 h-4" />
                <span>{t('order_via_telegram')}</span>
              </button>
            </div>

            {/* Direct Call */}
            <button
              onClick={handleCallStore}
              className="w-full p-2.5 rounded-2xl border flex items-center justify-center gap-1.5 text-xs font-bold shadow-xs hover:opacity-80 transition-all"
              style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
            >
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>{t('call_now')} (0995416715)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div 
        className="rounded-3xl p-5 sm:p-6 border shadow-md space-y-4"
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          color: themeColors.textPrimary
        }}
      >
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: themeColors.border }}>
          <h3 className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" style={{ color: currentTheme.primary }} />
            {t('reviews')} ({productReviews.length})
          </h3>
          <span className="text-xs opacity-70">{t('view_reviews')}</span>
        </div>

        {/* Reviews List */}
        {productReviews.length > 0 ? (
          <div className="space-y-3">
            {productReviews.map(rev => (
              <div 
                key={rev.id}
                className="p-3.5 rounded-2xl border shadow-xs space-y-2"
                style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold">{rev.userName}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                  </div>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                  {rev.comment}
                </p>

                {/* Admin Reply */}
                {rev.adminReply && (
                  <div 
                    className="p-2.5 rounded-xl border mt-2 flex items-start gap-2 bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                  >
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold block">{t('admin_reply')}:</span>
                      <span>{rev.adminReply}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs opacity-60 text-center py-4">
            {t('no_reviews_yet')}
          </p>
        )}

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="pt-2 border-t space-y-2.5" style={{ borderColor: themeColors.border }}>
          <h4 className="text-xs font-bold opacity-80">{t('write_review')}</h4>
          <input 
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder={t('your_name')}
            className="w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1"
            style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
          />
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder={t('your_review')}
            rows="3"
            className="w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 resize-none"
            style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
          />
          <button
            type="submit"
            disabled={!reviewComment.trim()}
            className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('submit_review')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
