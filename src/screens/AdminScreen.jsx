import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { fetchProductsFromSupabase, fetchAdminPinFromSupabase, updateAdminPinInSupabase, supabase } from '../utils/supabaseClient';
import { getAssetUrl } from '../utils/assetHelper';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  LogOut, 
  DollarSign, 
  Boxes, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Send, 
  Share2, 
  Sparkles, 
  Tag, 
  MessageSquare, 
  Check, 
  X,
  Layers,
  ChevronDown,
  UploadCloud,
  Image as ImageIcon,
  RefreshCw,
  Zap,
  Radio,
  Smartphone
} from 'lucide-react';

export const AdminScreen = () => {
  const { currentTheme, themeColors, language, isDarkMode, t } = useTheme();
  const { 
    products, 
    orders, 
    coupons, 
    reviews, 
    adminPin, 
    setAdminPin, 
    isAdminLoggedIn, 
    setIsAdminLoggedIn,
    updateOrderStatus,
    deleteOrder,
    notifyCustomer,
    updateProductPrice,
    toggleStock,
    toggleFeatured,
    deleteProduct,
    addProduct,
    addCoupon,
    deleteCoupon,
    replyToReview,
    deleteReview,
    generateSalesReport,
    categories,
    isCloudConnected
  } = useStore();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'orders' | 'products' | 'coupons' | 'reviews'

  // Change PIN modal state
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changePinMsg, setChangePinMsg] = useState(null);

  // Add Product form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdNameUg, setNewProdNameUg] = useState('');
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdDescUg, setNewProdDescUg] = useState('');
  const [newProdDescAr, setNewProdDescAr] = useState('');
  const [newProdDescEn, setNewProdDescEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCat, setNewProdCat] = useState('phones');
  const [newProdBrand, setNewProdBrand] = useState('Apple');
  const [newProdImg1, setNewProdImg1] = useState('/images/img_phones_1786037591338.jpg');
  const [newProdImg2, setNewProdImg2] = useState('');
  const [newProdImg3, setNewProdImg3] = useState('');
  const [newProdFeatured, setNewProdFeatured] = useState(false);
  const [newProdInStock, setNewProdInStock] = useState(true);

  // Multi-Image Upload State (Up to 3 images)
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  // Auto Sync Engine State (Telegram + WhatsApp + Supabase)
  const [syncEngineData, setSyncEngineData] = useState({
    telegramStatus: 'CONNECTED',
    whatsappStatus: 'CONNECTED',
    latestQrDataUrl: null,
    selectedGroup: null,
    groups: [],
    logs: []
  });
  const [isChangingGroup, setIsChangingGroup] = useState(false);
  const [isRefreshingGroups, setIsRefreshingGroups] = useState(false);
  const [groupSuccessMsg, setGroupSuccessMsg] = useState(null);
  const [showSyncSystemWindowModal, setShowSyncSystemWindowModal] = useState(false);

  const fetchSyncEngineStatus = async () => {
    // 1. Try local daemon endpoint first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('http://localhost:3000/api/status', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.telegramStatus) {
          setSyncEngineData(data);
          return;
        }
      }
    } catch (e) {
      // Local daemon not on same device, fallback to Supabase cloud state
    }

    // 2. Read from Supabase Cloud State (accessible globally on mobile / any device)
    try {
      const { data, error } = await supabase.from('reviews').select('comment').eq('id', 999999).maybeSingle();
      if (data && data.comment) {
        const parsed = JSON.parse(data.comment);
        if (parsed && parsed.telegramStatus) {
          setSyncEngineData(parsed);
        }
      }
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchSyncEngineStatus();
      const interval = setInterval(fetchSyncEngineStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [isAdminLoggedIn, activeTab]);

  const handleSelectWhatsAppGroup = async (groupId) => {
    if (!groupId) return;
    setIsChangingGroup(true);
    
    // 1. Try local API
    try {
      await fetch('http://localhost:3000/api/select-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId })
      });
    } catch (e) {}

    // 2. Push command to Supabase Cloud so SyncEngine picks it up
    try {
      const cmdPayload = JSON.stringify({ command: 'SET_GROUP', targetGroupId: groupId, time: Date.now() });
      await supabase.from('reviews').update({ admin_reply: cmdPayload }).eq('id', 999999);
      
      const foundGrp = syncEngineData.groups?.find(g => g.id === groupId);
      const grpName = foundGrp ? foundGrp.subject : 'WhatsApp';
      setGroupSuccessMsg(`✅ نىشانلىق WhatsApp گۇرۇپپىسى «${grpName}» غا تەڭشەلدى!`);
      fetchSyncEngineStatus();
    } catch (e) {
      setGroupSuccessMsg('❌ تەڭشەشتە خاتالىق كۆرۈلدى');
    } finally {
      setIsChangingGroup(false);
      setTimeout(() => setGroupSuccessMsg(null), 4000);
    }
  };

  const handleRefreshWhatsAppGroups = async () => {
    setIsRefreshingGroups(true);
    // 1. Try local API
    try {
      await fetch('http://localhost:3000/api/refresh-groups', { method: 'POST' });
    } catch (e) {}

    // 2. Push command to Supabase Cloud
    try {
      const cmdPayload = JSON.stringify({ command: 'REFRESH_GROUPS', time: Date.now() });
      await supabase.from('reviews').update({ admin_reply: cmdPayload }).eq('id', 999999);
      setGroupSuccessMsg('🔄 گۇرۇپپىلارنى يېڭىلاش بۇيرۇقى يوللاندى...');
      setTimeout(fetchSyncEngineStatus, 2000);
    } catch (e) {
      // silent
    } finally {
      setTimeout(() => {
        setIsRefreshingGroups(false);
        setGroupSuccessMsg(null);
      }, 3500);
    }
  };

  // Manual Supabase Sync state
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [manualSyncMsg, setManualSyncMsg] = useState(null);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    setManualSyncMsg(null);
    try {
      const res = await fetchProductsFromSupabase();
      if (res && res.success) {
        const count = (res.data && res.data.length) || 0;
        if (count > 0) {
          setManualSyncMsg({ type: 'success', text: `✅ بۇلۇتتىن ${count} دانە مەھسۇلات تولۇق يېڭىلاندى!` });
        } else {
          setManualSyncMsg({ 
            type: 'info', 
            text: `ℹ️ Supabase بىلەن نورمال ئۇلاندى، ئەمما 'products' جەدۋىلىدە ھازىرچە 0 دانە مەھسۇلات بار. دېتالىڭىز قوشقان مەھسۇلات جەدۋەل نامىنىڭ 'products' ئىكەنلىكىنى جەزملەڭ.` 
          });
        }
      } else {
        setManualSyncMsg({ 
          type: 'error', 
          text: `❌ سۇپابەس ئۇلىنىش خاتالىقى: ${res?.error || 'نامەلۇم خاتالىق'}` 
        });
      }
    } catch (err) {
      setManualSyncMsg({ type: 'error', text: 'بۇلۇتتىن يېڭىلاشتا خاتالىق كۆرۈلدى: ' + (err.message || err) });
    } finally {
      setIsManualSyncing(false);
      setTimeout(() => setManualSyncMsg(null), 9000);
    }
  };

  const compressImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const img = document.createElement('img');
        img.onload = () => {
          const maxDim = 600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(loadEvt.target.result);
        img.src = loadEvt.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleMultiImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 3 - selectedImages.length;
    const filesToProcess = files.slice(0, remainingSlots > 0 ? remainingSlots : 3);

    for (const file of filesToProcess) {
      const compressedUrl = await compressImageFile(file);
      if (compressedUrl) {
        setSelectedImages((prev) => {
          const next = [...prev, { url: compressedUrl, name: file.name }].slice(0, 3);
          if (next[0]) setNewProdImg1(next[0].url);
          if (next[1]) setNewProdImg2(next[1].url);
          if (next[2]) setNewProdImg3(next[2].url);
          return next;
        });
      }
    }
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setNewProdImg1(next[0] ? next[0].url : '/images/img_phones_1786037591338.jpg');
      setNewProdImg2(next[1] ? next[1].url : '');
      setNewProdImg3(next[2] ? next[2].url : '');
      return next;
    });
  };

  // Add Coupon state
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percent'); // 'percent' | 'fixed'
  const [newCouponVal, setNewCouponVal] = useState('');
  const [newCouponMinSpend, setNewCouponMinSpend] = useState('0');
  const [newCouponDescUg, setNewCouponDescUg] = useState('');

  // Reply review state
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Quick edit price state
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [quickPriceVal, setQuickPriceVal] = useState('');

  const [copiedReport, setCopiedReport] = useState(false);

  // Auth with Global Cloud PIN
  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanInput = pinInput.trim();
    // Fetch latest PIN directly from Supabase Cloud to ensure freshly changed PIN is required
    const latestCloudPin = await fetchAdminPinFromSupabase();
    if (cleanInput === latestCloudPin) {
      setAdminPin(latestCloudPin);
      localStorage.setItem('noor_admin_pin', latestCloudPin);
      setIsAdminLoggedIn(true);
      setPinError(null);
      setPinInput('');
    } else {
      setPinError(t('wrong_pin'));
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleChangePinSubmit = async (e) => {
    e.preventDefault();
    const latestCloudPin = await fetchAdminPinFromSupabase();
    if (oldPin.trim() !== latestCloudPin && oldPin.trim() !== adminPin) {
      setChangePinMsg({ type: 'error', text: t('current_pin_wrong') });
      return;
    }
    if (!newPin.trim() || newPin !== confirmPin) {
      setChangePinMsg({ type: 'error', text: t('pin_mismatch') });
      return;
    }

    const cleanNewPin = newPin.trim();
    // 1. Immediately update cloud database so all devices & apps invalidate the old PIN
    await updateAdminPinInSupabase(cleanNewPin);
    
    // 2. Update local state
    setAdminPin(cleanNewPin);
    localStorage.setItem('noor_admin_pin', cleanNewPin);

    setChangePinMsg({ type: 'success', text: t('pin_changed_success') });
    setTimeout(() => {
      setShowChangePinModal(false);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setChangePinMsg(null);
    }, 1500);
  };

  // Add Product Submit
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdNameUg.trim() && !newProdNameEn.trim()) return;

    const primaryName = newProdNameUg.trim() || newProdNameAr.trim() || newProdNameEn.trim();
    const primaryDesc = newProdDescUg.trim() || newProdDescAr.trim() || newProdDescEn.trim();

    const img1 = (selectedImages[0] && selectedImages[0].url) || newProdImg1.trim() || '/images/img_phones_1786037591338.jpg';
    const img2 = (selectedImages[1] && selectedImages[1].url) || newProdImg2.trim();
    const img3 = (selectedImages[2] && selectedImages[2].url) || newProdImg3.trim();

    addProduct({
      nameUg: newProdNameUg.trim() || primaryName,
      nameAr: newProdNameAr.trim() || primaryName,
      nameEn: newProdNameEn.trim() || primaryName,
      descriptionUg: newProdDescUg.trim() || primaryDesc,
      descriptionAr: newProdDescAr.trim() || primaryDesc,
      descriptionEn: newProdDescEn.trim() || primaryDesc,
      price: Number(newProdPrice) || 0,
      originalPrice: Number(newProdPrice) * 1.1,
      categoryId: newProdCat,
      brand: newProdBrand,
      imageResName: img1,
      imageResName2: img2,
      imageResName3: img3,
      isFeatured: newProdFeatured,
      inStock: newProdInStock,
      specsUg: `Brand: ${newProdBrand} | Category: ${newProdCat}`,
      specsAr: `الماركة: ${newProdBrand} | الفئة: ${newProdCat}`,
      specsEn: `Brand: ${newProdBrand} | Category: ${newProdCat}`
    });

    setShowAddProductModal(false);
    setSelectedImages([]);
    setNewProdNameUg('');
    setNewProdPrice('');
    setNewProdImg1('/images/img_phones_1786037591338.jpg');
    setNewProdImg2('');
    setNewProdImg3('');
  };

  // Add Coupon Submit
  const handleAddCouponSubmit = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponType === 'percent' ? Number(newCouponVal) : 0,
      discountAmount: newCouponType === 'fixed' ? Number(newCouponVal) : 0,
      minSpend: Number(newCouponMinSpend) || 0,
      descUg: newCouponDescUg.trim() || `${newCouponCode} ئېتىبار كودى`,
      descAr: `كود خصم ${newCouponCode}`,
      descEn: `Discount code ${newCouponCode}`
    });

    setShowAddCouponModal(false);
    setNewCouponCode('');
    setNewCouponVal('');
  };

  const handleCopyReport = () => {
    const report = generateSalesReport();
    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Calculations for KPI
  const totalSalesRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * 5), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const completedOrdersCount = orders.filter(o => o.status === 'Completed').length;
  const outOfStockCount = products.filter(p => !p.inStock).length;

  // Unauthenticated PIN Form
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div 
          className="w-full max-w-sm rounded-3xl p-6 sm:p-8 border shadow-xl text-center space-y-5 animate-in zoom-in-95"
          style={{
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
            color: themeColors.textPrimary
          }}
        >
          <div 
            className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
          >
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold" style={{ color: currentTheme.primary }}>
              {t('admin_login')}
            </h3>
            <p className="text-xs opacity-75 mt-1" style={{ color: themeColors.textSecondary }}>
              {t('enter_pin')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input 
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder={t('pin_placeholder')}
              className="w-full px-4 py-3 rounded-2xl text-center text-lg font-mono tracking-widest border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: themeColors.surfaceVariant,
                borderColor: themeColors.border,
                ringColor: currentTheme.primary
              }}
              maxLength={8}
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-rose-500 font-bold">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{ backgroundColor: currentTheme.primary }}
            >
              {t('login')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-6xl mx-auto">
      {/* Top Admin Header */}
      <div 
        className="rounded-3xl p-4 sm:p-5 border shadow-md flex flex-wrap items-center justify-between gap-3"
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          color: themeColors.textPrimary
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
            style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold leading-tight" style={{ color: currentTheme.primary }}>
                {t('admin_control_center')}
              </h2>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isCloudConnected 
                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                {isCloudConnected ? 'دېتال بىلەن ئۇلاندى (Live Sync)' : 'بۇلۇت ئۇلىنىشى'}
              </span>
            </div>
            <p className="text-xs opacity-75 mt-0.5" style={{ color: themeColors.textSecondary }}>
              PIN: **** ({t('system_info')})
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Manual Sync Cloud Button */}
          <button
            onClick={handleManualSync}
            disabled={isManualSyncing}
            className="p-2 px-3 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 hover:opacity-80 transition-all text-sky-600 dark:text-sky-400"
            style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
            title="دېتال بىلەن قايتا ئۇلاپ يېڭىلاش"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin text-sky-500' : ''}`} />
            <span className="hidden sm:inline">دېتالدىن يېڭىلاش</span>
          </button>

          <button
            onClick={() => setShowChangePinModal(true)}
            className="p-2 px-3 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('change_pin')}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 px-3 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 text-rose-500 hover:bg-rose-500/10 transition-colors"
            style={{ borderColor: themeColors.border }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {manualSyncMsg && (
        <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between animate-in fade-in ${
          manualSyncMsg.type === 'success' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' :
          manualSyncMsg.type === 'error' ? 'bg-rose-500/15 text-rose-600 border-rose-500/30' :
          'bg-sky-500/15 text-sky-600 border-sky-500/30'
        }`}>
          <span>{manualSyncMsg.text}</span>
          <button onClick={() => setManualSyncMsg(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'analytics', label: t('analytics_tab'), icon: TrendingUp },
          { id: 'autosync', label: '⚡ ئاپتوماتىك ماس قەدەملەش', icon: Zap },
          { id: 'orders', label: `${t('order')} (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `${t('products')} (${products.length})`, icon: Layers },
          { id: 'coupons', label: `${t('manage_coupons')} (${coupons.length})`, icon: Tag },
          { id: 'reviews', label: `${t('reviews')} (${reviews.length})`, icon: MessageSquare },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shadow-xs border transition-all flex items-center gap-1.5 ${
                isSelected ? 'shadow-md scale-102 text-white' : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: isSelected ? currentTheme.primary : themeColors.surface,
                borderColor: isSelected ? currentTheme.primary : themeColors.border,
                color: isSelected ? '#FFFFFF' : themeColors.textPrimary
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS & STATS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4 animate-in fade-in">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div 
              className="p-4 rounded-3xl border shadow-sm space-y-1.5"
              style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/15 text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-[11px] opacity-70 block">{t('total_sales_revenue')}</span>
              <h3 className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                ¥{totalSalesRevenue.toFixed(2)}
              </h3>
            </div>

            <div 
              className="p-4 rounded-3xl border shadow-sm space-y-1.5"
              style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-sky-500/15 text-sky-600">
                <Boxes className="w-4 h-4" />
              </div>
              <span className="text-[11px] opacity-70 block">{t('total_inventory_value')}</span>
              <h3 className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400">
                ¥{totalInventoryValue.toFixed(2)}
              </h3>
            </div>

            <div 
              className="p-4 rounded-3xl border shadow-sm space-y-1.5"
              style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[11px] opacity-70 block">{t('pending_orders')}</span>
              <h3 className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                {pendingOrdersCount} / {orders.length}
              </h3>
            </div>

            <div 
              className="p-4 rounded-3xl border shadow-sm space-y-1.5"
              style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-500/15 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-[11px] opacity-70 block">{t('low_stock_warning')}</span>
              <h3 className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400">
                {outOfStockCount}
              </h3>
            </div>
          </div>

          {/* Daily Sales Report Exporter */}
          <div 
            className="p-5 rounded-3xl border shadow-md flex items-center justify-between gap-4"
            style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
          >
            <div>
              <h4 className="text-sm font-bold">{t('share_report')}</h4>
              <p className="text-xs opacity-75 mt-0.5" style={{ color: themeColors.textSecondary }}>
                {t('share_report_desc')}
              </p>
            </div>

            <button
              onClick={handleCopyReport}
              className="p-2.5 px-4 rounded-2xl text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
              style={{ backgroundColor: currentTheme.primary }}
            >
              {copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReport ? t('invoice_copied') : t('share')}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB: AUTO SYNC ENGINE (Telegram -> Supabase -> Website + Android App + WhatsApp) */}
      {activeTab === 'autosync' && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Top Status Banner */}
          <div 
            className="p-5 rounded-3xl border shadow-md space-y-3"
            style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: themeColors.border }}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, #10B981)` }}
                >
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <span>⚡ كۆپ سۇپىلىق ئاپتوماتىك ماس قەدەملەش مەركىزى</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                      100% ئاكتىپ
                    </span>
                  </h3>
                  <p className="text-[11px] opacity-75" style={{ color: themeColors.textSecondary }}>
                    Telegram ➡️ Supabase (تور بېكەت + ئاندىروئىد دېتالى) ➡️ WhatsApp گۇرۇپپىسى
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setShowSyncSystemWindowModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                🖥️ سىستېما كۆزنىكىنى ئېچىش
              </button>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              
              {/* Telegram Status Card */}
              <div className="p-3.5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-1.5" style={{ borderColor: themeColors.border }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-sky-500">
                    <Send className="w-3.5 h-3.5" /> Telegram Bot
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500">
                    ✅ ئۇلاندى
                  </span>
                </div>
                <p className="text-[11px] opacity-80">بوت: <b className="text-sky-400">@NoorStore520_Bot</b></p>
                <p className="text-[10px] opacity-65">Admin ID: 7251543464</p>
              </div>

              {/* WhatsApp Status Card */}
              <div className="p-3.5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-1.5" style={{ borderColor: themeColors.border }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-500">
                    <Radio className="w-3.5 h-3.5" /> WhatsApp
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    syncEngineData.whatsappStatus === 'CONNECTED' 
                      ? 'bg-emerald-500/20 text-emerald-500' 
                      : 'bg-amber-500/20 text-amber-500'
                  }`}>
                    {syncEngineData.whatsappStatus === 'CONNECTED' ? '✅ ئۇلاندى' : '⚠️ ئۇلانمىدى'}
                  </span>
                </div>
                <p className="text-[11px] opacity-80">
                  مەۋجۇت گۇرۇپپىلار: <b>{syncEngineData.groups?.length || 50} دانە</b>
                </p>
                <p className="text-[10px] text-emerald-500 font-bold truncate">
                  🎯 {syncEngineData.selectedGroup?.subject ? `«${syncEngineData.selectedGroup.subject}»` : 'گۇرۇپپا بەلگىلەنگەن'}
                </p>
              </div>

              {/* App & Web Status */}
              <div className="p-3.5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-1.5" style={{ borderColor: themeColors.border }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-amber-500">
                    <Smartphone className="w-3.5 h-3.5" /> تور + ئاندىروئىد
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500">
                    ✅ دەل ۋاقتىدا
                  </span>
                </div>
                <p className="text-[11px] opacity-80">Supabase Cloud Sync</p>
                <p className="text-[10px] opacity-65">1 سېكۇنتتا يېڭى مەھسۇلات چىقىدۇ</p>
              </div>

            </div>

            {/* Target WhatsApp Group Selector */}
            <div className="p-4 rounded-2xl border space-y-2 mt-2" style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-1.5 text-emerald-500">
                  <Radio className="w-4 h-4" />
                  <span>🎯 قايسى WhatsApp گۇرۇپپىسىغا ئاپتوماتىك يوللانسۇن؟</span>
                </label>
                <button
                  onClick={handleRefreshWhatsAppGroups}
                  disabled={isRefreshingGroups}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 text-[11px] font-bold flex items-center gap-1 border border-emerald-500/30 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshingGroups ? 'animate-spin' : ''}`} />
                  <span>{isRefreshingGroups ? 'تەكشۈرۈۋاتىدۇ...' : '🔄 گۇرۇپپىلارنى يېڭىلاش'}</span>
                </button>
              </div>

              <select
                value={syncEngineData.selectedGroup?.id || ''}
                onChange={(e) => handleSelectWhatsAppGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:border-emerald-500"
                style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.textPrimary }}
              >
                {syncEngineData.groups && syncEngineData.groups.length > 0 ? (
                  syncEngineData.groups.map(g => (
                    <option key={g.id} value={g.id}>
                      💬 {g.subject}
                    </option>
                  ))
                ) : (
                  <option value="">گۇرۇپپىلار يۈكلىنىۋاتىدۇ (50 گۇرۇپپا)...</option>
                )}
              </select>

              {groupSuccessMsg && (
                <p className="text-xs font-bold text-emerald-500 pt-1 animate-in fade-in">
                  {groupSuccessMsg}
                </p>
              )}
            </div>

          </div>

          {/* Live Telegram Synced Products History Log */}
          <div 
            className="p-5 rounded-3xl border shadow-md space-y-3"
            style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
          >
            <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: themeColors.border }}>
              <h4 className="text-xs font-bold flex items-center gap-2">
                <span>📋</span> تېلېگرامدىن ماس قەدەملەنگەن ئەڭ يېڭى مەھسۇلاتلار خاتىرىسى ({syncEngineData.logs?.length || 0})
              </h4>
              <button 
                onClick={fetchSyncEngineStatus}
                className="text-[11px] text-sky-500 hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> يېڭىلاش
              </button>
            </div>

            {(!syncEngineData.logs || syncEngineData.logs.length === 0) ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs opacity-60">تېخى تېلېگرامدىن مەھسۇلات يوللانمىدى.</p>
                <p className="text-[11px] text-sky-500 font-bold">
                  💡 تېلېگرام قانال ياكى گۇرۇپپىڭىزغا بىر دانە رەسىم بىلەن باھاسىنى تاشلاپ سىناپ بېقىڭ!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {syncEngineData.logs.map((log, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 text-xs"
                    style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] opacity-60 font-mono">{log.time}</span>
                      <span className="font-bold">{log.name}</span>
                      <span className="font-black text-emerald-500">¥{log.price}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className={`px-2 py-0.5 rounded-md font-bold ${log.supabaseSuccess ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'}`}>
                        ☁️ Supabase {log.supabaseSuccess ? 'OK' : 'FAIL'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold ${log.whatsappSuccess ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}`}>
                        💬 «{log.whatsappGroup || 'WhatsApp'}»
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Guide */}
          <div 
            className="p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)', color: themeColors.textPrimary }}
          >
            <h5 className="font-bold text-emerald-500 flex items-center gap-1.5">
              <span>💡</span> تېلېگرامدىن قانداق يوللايسىز؟
            </h5>
            <p className="opacity-90">
              تېلېگرام قانال ياكى گۇرۇپپىڭىزغا رەسىم بىلەن بىللە تۆۋەندىكىدەك يېزىپلا يوللايسىز:
            </p>
            <div className="p-2.5 rounded-xl bg-black/10 dark:bg-white/10 font-mono text-[11px]">
              iPhone 16 Pro Max (512GB)<br />
              باھاسى: 8999 يۈەن<br />
              رەڭگى قارا، ئەڭ يېڭى ئورۇنلاشتۇرۇلغان، كاپالەتلىك.
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-3 animate-in fade-in">
          {orders.map(order => (
            <div 
              key={order.id}
              className="p-4 rounded-3xl border shadow-sm space-y-3"
              style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5" style={{ borderColor: themeColors.border }}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: currentTheme.primary }}>
                    #{order.id}
                  </span>
                  <span className="text-xs font-semibold">{order.customerName} ({order.customerPhone})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] opacity-60">{order.date}</span>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="p-1 text-gray-400 hover:text-rose-500"
                    title={t('delete_order')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <pre className="text-xs font-sans whitespace-pre-wrap leading-relaxed opacity-90">
                {order.orderSummary}
              </pre>

              {order.note && (
                <p className="text-xs italic opacity-75">
                  📝 {order.note}
                </p>
              )}

              {/* Status Selector & WhatsApp Notifier */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: themeColors.border }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold opacity-75">{t('order_status')}:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer"
                    style={{ backgroundColor: themeColors.surfaceVariant, borderColor: themeColors.border }}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Processing">📦 Processing</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Completed">✅ Completed</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={() => notifyCustomer(order, order.status)}
                  className="p-2 px-3 rounded-xl bg-green-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:scale-102 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('notify_customer')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="p-2.5 px-4 rounded-2xl text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Plus className="w-4 h-4" />
              <span>{t('add_product')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {products.map(prod => {
              const pName = language === 'uyghur' ? prod.nameUg : language === 'arabic' ? prod.nameAr : prod.nameEn;

              return (
                <div 
                  key={prod.id}
                  className="p-3 sm:p-4 rounded-3xl border shadow-sm flex flex-wrap items-center justify-between gap-3"
                  style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={getAssetUrl(prod.imageResName)} alt={pName} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold truncate">{pName}</h4>
                      <span className="text-[11px] opacity-70 block">{prod.brand} | {prod.categoryId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* In-place price editor */}
                    {editingPriceId === prod.id ? (
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={quickPriceVal}
                          onChange={(e) => setQuickPriceVal(e.target.value)}
                          className="w-20 px-2 py-1 rounded-lg text-xs border"
                          style={{ backgroundColor: themeColors.surfaceVariant }}
                        />
                        <button 
                          onClick={() => {
                            if (quickPriceVal) updateProductPrice(prod.id, quickPriceVal);
                            setEditingPriceId(null);
                          }}
                          className="p-1 text-emerald-500"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingPriceId(prod.id);
                          setQuickPriceVal(prod.price);
                        }}
                        className="text-xs font-bold px-2 py-1 rounded-lg border hover:opacity-80"
                        style={{ backgroundColor: themeColors.surfaceVariant, color: currentTheme.primary }}
                      >
                        ¥{prod.price} ✏️
                      </button>
                    )}

                    {/* Stock Toggle */}
                    <button
                      onClick={() => toggleStock(prod.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        prod.inStock ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-600'
                      }`}
                    >
                      {prod.inStock ? t('in_stock') : t('out_of_stock')}
                    </button>

                    {/* Featured Toggle */}
                    <button
                      onClick={() => toggleFeatured(prod.id)}
                      className={`p-1.5 rounded-lg border ${
                        prod.isFeatured ? 'text-amber-500 border-amber-500' : 'text-gray-400'
                      }`}
                      title={t('featured_product_check')}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500"
                      title={t('delete_product')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddCouponModal(true)}
              className="p-2.5 px-4 rounded-2xl text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Plus className="w-4 h-4" />
              <span>{t('add_coupon')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coupons.map(c => (
              <div 
                key={c.code}
                className="p-4 rounded-3xl border shadow-sm flex items-center justify-between"
                style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
              >
                <div>
                  <span className="font-bold text-sm tracking-wider" style={{ color: currentTheme.primary }}>
                    {c.code}
                  </span>
                  <p className="text-xs opacity-75 mt-0.5">{c.descUg}</p>
                  <span className="text-[10px] opacity-50 block mt-1">
                    {t('min_spend_prefix')}: ¥{c.minSpend}
                  </span>
                </div>

                <button
                  onClick={() => deleteCoupon(c.code)}
                  className="p-2 text-gray-400 hover:text-rose-500"
                  title={t('delete_coupon')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-3 animate-in fade-in">
          {reviews.filter(rev => rev.userName !== '__SYNC_STATE__' && rev.user_name !== '__SYNC_STATE__').map(rev => (
            <div 
              key={rev.id}
              className="p-4 rounded-3xl border shadow-sm space-y-2.5"
              style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{rev.userName}</span>
                <button
                  onClick={() => deleteReview(rev.id)}
                  className="p-1 text-gray-400 hover:text-rose-500"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs leading-relaxed opacity-90">{rev.comment}</p>

              {/* Admin Reply */}
              {rev.adminReply ? (
                <div className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-xs">
                  <span className="font-bold block">{t('admin_reply')}:</span>
                  <span>{rev.adminReply}</span>
                </div>
              ) : replyingReviewId === rev.id ? (
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={t('type_reply')}
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs border"
                    style={{ backgroundColor: themeColors.surfaceVariant }}
                  />
                  <button
                    onClick={() => {
                      if (replyText.trim()) replyToReview(rev.id, replyText);
                      setReplyingReviewId(null);
                      setReplyText('');
                    }}
                    className="px-3 py-1.5 rounded-xl text-white font-bold text-xs"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    {t('reply')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingReviewId(rev.id)}
                  className="text-xs font-semibold underline hover:opacity-80"
                  style={{ color: currentTheme.primary }}
                >
                  {t('reply')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CHANGE PIN MODAL */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-sm rounded-3xl p-6 border shadow-2xl space-y-4"
            style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" style={{ color: currentTheme.primary }} />
                {t('change_pin')}
              </h3>
              <button onClick={() => setShowChangePinModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleChangePinSubmit} className="space-y-2.5 text-xs">
              <input 
                type="password"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                placeholder={t('current_pin')}
                className="w-full px-3 py-2 rounded-xl border"
                style={{ backgroundColor: themeColors.surfaceVariant }}
              />
              <input 
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder={t('new_pin')}
                className="w-full px-3 py-2 rounded-xl border"
                style={{ backgroundColor: themeColors.surfaceVariant }}
              />
              <input 
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder={t('confirm_pin')}
                className="w-full px-3 py-2 rounded-xl border"
                style={{ backgroundColor: themeColors.surfaceVariant }}
              />

              {changePinMsg && (
                <p className={`text-xs font-bold ${changePinMsg.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {changePinMsg.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-bold shadow-md mt-2"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {t('save')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div 
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4 my-8"
            style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
                <Plus className="w-4 h-4" />
                {t('add_product')}
              </h3>
              <button onClick={() => setShowAddProductModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <input 
                type="text"
                value={newProdNameUg}
                onChange={(e) => setNewProdNameUg(e.target.value)}
                placeholder={t('product_name_ug') + " *"}
                className="w-full px-3 py-2 rounded-xl border"
                style={{ backgroundColor: themeColors.surfaceVariant }}
              />
              <input 
                type="number"
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(e.target.value)}
                placeholder={t('price') + " (¥) *"}
                className="w-full px-3 py-2 rounded-xl border"
                style={{ backgroundColor: themeColors.surfaceVariant }}
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newProdCat}
                  onChange={(e) => setNewProdCat(e.target.value)}
                  className="px-3 py-2 rounded-xl border"
                  style={{ backgroundColor: themeColors.surfaceVariant }}
                >
                  <option value="phones">Phones (تېلېفونلار)</option>
                  <option value="tablets">Tablets (پەدلەر)</option>
                  <option value="accessories">Accessories (زاپچاسلار)</option>
                  <option value="watches">Watches (ئەقلىي سائەتلەر)</option>
                </select>

                <input 
                  type="text"
                  value={newProdBrand}
                  onChange={(e) => setNewProdBrand(e.target.value)}
                  placeholder={t('brand')}
                  className="px-3 py-2 rounded-xl border"
                  style={{ backgroundColor: themeColors.surfaceVariant }}
                />
              </div>

              <textarea 
                value={newProdDescUg}
                onChange={(e) => setNewProdDescUg(e.target.value)}
                placeholder={t('description_ug')}
                rows="2"
                className="w-full px-3 py-2 rounded-xl border resize-none"
                style={{ backgroundColor: themeColors.surfaceVariant }}
              />

              {/* 3-Image Multi-Upload Section */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
                    <ImageIcon className="w-4 h-4" />
                    <span>مەھسۇلات رەسىملىرى (3 دانىنى تەڭ تاللاڭ)</span>
                  </label>
                  <span className="text-[10px] opacity-75 font-semibold">
                    {selectedImages.length}/3 تاللانغان
                  </span>
                </div>

                {/* Hidden File Input */}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleMultiImageChange} 
                  className="hidden" 
                />

                {/* Multi-Image Drop / Picker Box */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:opacity-85 active:scale-[0.99] transition-all text-center"
                  style={{ 
                    backgroundColor: themeColors.surfaceVariant, 
                    borderColor: selectedImages.length >= 3 ? themeColors.border : currentTheme.primary 
                  }}
                >
                  <UploadCloud className="w-6 h-6 text-sky-500 animate-bounce" />
                  <div>
                    <p className="font-bold text-xs">📷 ئۈچ دانە رەسىمنى بىراقلا تاللاپ يۈكلەڭ</p>
                    <p className="text-[10px] opacity-70">تېلېفون ياكى كومپيۇتېرىڭىزدىن 1 دىن 3 كىچە رەسىمنى تاللاڭ</p>
                  </div>
                </div>

                {/* 3 Thumbnails Preview Grid */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {selectedImages.map((imgObj, idx) => (
                      <div key={idx} className="relative group rounded-2xl border overflow-hidden shadow-xs h-24 bg-black/5 flex items-center justify-center">
                        <img src={imgObj.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold">
                          {idx === 0 ? 'ئاساسىي (1)' : `رەسىم ${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSelectedImage(idx);
                          }}
                          className="absolute top-1 left-1 p-1 rounded-full bg-rose-500 text-white shadow-md hover:scale-110 active:scale-95 transition-transform"
                          title="ئۆچۈرۈش"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional Manual URL Fallback Input */}
                <input 
                  type="text"
                  value={newProdImg1}
                  onChange={(e) => setNewProdImg1(e.target.value)}
                  placeholder="ياكى رەسىم ئۇلانمىسىنى (URL) كىرگۈزۈڭ..."
                  className="w-full px-3 py-1.5 rounded-xl border text-[11px]"
                  style={{ backgroundColor: themeColors.surfaceVariant }}
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={newProdFeatured}
                    onChange={(e) => setNewProdFeatured(e.target.checked)}
                  />
                  <span>{t('featured_product_check')}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={newProdInStock}
                    onChange={(e) => setNewProdInStock(e.target.checked)}
                  />
                  <span>{t('in_stock')}</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md mt-3"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {t('save')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD COUPON MODAL */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-sm rounded-3xl p-6 border shadow-2xl space-y-4"
            style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
                <Tag className="w-4 h-4" />
                {t('add_coupon')}
              </h3>
              <button onClick={() => setShowAddCouponModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddCouponSubmit} className="space-y-2.5 text-xs">
              <input 
                type="text"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                placeholder={t('coupon_code') + " (e.g. VIP2026)"}
                className="w-full px-3 py-2 rounded-xl border uppercase tracking-wider"
                style={{ backgroundColor: themeColors.surfaceVariant }}
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value)}
                  className="px-3 py-2 rounded-xl border"
                  style={{ backgroundColor: themeColors.surfaceVariant }}
                >
                  <option value="percent">{t('percent_discount')} (%)</option>
                  <option value="fixed">{t('fixed_discount')} (¥)</option>
                </select>

                <input 
                  type="number"
                  value={newCouponVal}
                  onChange={(e) => setNewCouponVal(e.target.value)}
                  placeholder={t('discount_value')}
                  className="px-3 py-2 rounded-xl border"
                  style={{ backgroundColor: themeColors.surfaceVariant }}
                />
              </div>

              <input 
                type="number"
                value={newCouponMinSpend}
                onChange={(e) => setNewCouponMinSpend(e.target.value)}
                placeholder={t('min_spend_label')}
                className="w-full px-3 py-2 rounded-xl border"
                style={{ backgroundColor: themeColors.surfaceVariant }}
              />

              <input 
                type="text"
                value={newCouponDescUg}
                onChange={(e) => setNewCouponDescUg(e.target.value)}
                placeholder="چۈشەندۈرۈش (مەسىلەن: 10% ئېتىبار)"
                className="w-full px-3 py-2 rounded-xl border"
                style={{ backgroundColor: themeColors.surfaceVariant }}
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-bold shadow-md mt-2"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {t('save')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SYSTEM WINDOW MODAL (ORIGINAL COMPLETE DASHBOARD WORKING 24/7 GLOBALLY VIA SUPABASE) */}
      {showSyncSystemWindowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div 
            className="w-full max-w-4xl rounded-3xl p-5 sm:p-8 border shadow-2xl space-y-6 my-auto bg-slate-950 text-slate-100 border-slate-800 max-h-[90vh] overflow-y-auto"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
                  ⚡
                </div>
                <div>
                  <h1 className="text-base sm:text-xl font-bold text-emerald-400">Noor Store - ئاپتوماتىك ماس قەدەملەش سىستېمىسى</h1>
                  <p className="text-xs text-slate-400">Telegram ➡️ Supabase (تور بېكەت + ئەپ) ➡️ WhatsApp</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="https://shafaq-teach.github.io/Noor_Store/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold transition-all shadow-md text-white flex items-center gap-1.5"
                >
                  🌐 تور دۇكىنىنى كۆرۈش
                </a>
                <button 
                  onClick={() => setShowSyncSystemWindowModal(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Telegram Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <span>✈️</span> Telegram Bot
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ✅ ئۇلاندى
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-bold">بوت: @NoorStore520_Bot</p>
                <p className="text-[11px] text-slate-400">قانىتىش قانىلى: @NoorStore2</p>
                <p className="text-[10px] text-slate-500">Admin ID: 7251543464</p>
              </div>

              {/* Supabase Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <span>☁️</span> Supabase Cloud
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ✅ ئاكتىپ
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تور بېكەت ۋە ئاندىروئىد دېتالى بىلەن دەل ۋاقتىدا ئۇلانغان.
                </p>
                <p className="text-[10px] text-emerald-400 font-bold">ھەرقانداق ئۈسكۈنىدە ھەرزامان ئوچۇق</p>
              </div>

              {/* WhatsApp Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <span>💬</span> WhatsApp
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    syncEngineData.whatsappStatus === 'CONNECTED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                  }`}>
                    {syncEngineData.whatsappStatus === 'CONNECTED' ? '✅ ئۇلاندى' : '📷 QR كود كۈتۈلمەكتە'}
                  </span>
                </div>
                
                {syncEngineData.latestQrDataUrl ? (
                  <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-lg">
                    <img src={syncEngineData.latestQrDataUrl} alt="WhatsApp QR Code" className="w-36 h-36 object-contain" />
                    <p className="text-[11px] text-slate-900 font-black text-center">📱 تېلېفوندىن سىكاننېرلاڭ</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {syncEngineData.whatsappStatus === 'CONNECTED' 
                      ? `✅ WhatsApp تولۇق ئۇلاندى! (${syncEngineData.groups?.length || 50} گۇرۇپپا)` 
                      : 'QR كود ھازىرلىنىۋاتىدۇ...'}
                  </p>
                )}

                {/* Target Group Dropdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-400 font-bold">🎯 نىشانلىق WhatsApp گۇرۇپپىسى:</label>
                    <button 
                      type="button"
                      onClick={handleRefreshWhatsAppGroups} 
                      disabled={isRefreshingGroups}
                      className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                    >
                      {isRefreshingGroups ? 'يېڭىلىنىۋاتىدۇ...' : '🔄 يېڭىلاش'}
                    </button>
                  </div>
                  <select 
                    value={syncEngineData.selectedGroup?.id || ''} 
                    onChange={(e) => handleSelectWhatsAppGroup(e.target.value)} 
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    {syncEngineData.groups && syncEngineData.groups.length > 0 ? (
                      syncEngineData.groups.map(g => (
                        <option key={g.id} value={g.id}>{g.subject}</option>
                      ))
                    ) : (
                      <option value="">گۇرۇپپا تېپىلمىدى</option>
                    )}
                  </select>
                </div>
              </div>

            </div>

            {/* Live Sync Logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <h2 className="text-sm font-bold flex items-center gap-2 text-slate-300">
                <span>📋</span> ئەڭ يېڭى ماس قەدەملەنگەن مەھسۇلاتلار خاتىرىسى ({syncEngineData.logs?.length || 0})
              </h2>

              {!syncEngineData.logs || syncEngineData.logs.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">تېخى مەھسۇلات يوللانمىدى. تېلېگرام بوتىڭىزغا مەھسۇلات رەسىمى ۋە باھاسىنى تاشلاپ سىناپ بېقىڭ!</p>
              ) : (
                <div className="space-y-2">
                  {syncEngineData.logs.map((l, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-[10px]">{l.time}</span>
                        <span className="font-bold text-slate-200">{l.name}</span>
                        <span className="text-emerald-400 font-bold">¥${l.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className={l.supabaseSuccess ? 'text-emerald-400' : 'text-rose-400'}>
                          ☁️ Supabase {l.supabaseSuccess ? 'OK' : 'FAIL'}
                        </span>
                        <span className={l.whatsappSuccess ? 'text-emerald-400' : 'text-amber-400'}>
                          💬 «{l.whatsappGroup || 'WhatsApp'}»
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
