import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialCategories, initialProducts, initialCoupons, initialReviews, initialNasheedTracks } from '../data/initialData';
import { useTheme } from './ThemeContext';
import { getAssetUrl } from '../utils/assetHelper';
import { 
  supabase, 
  fetchProductsFromSupabase, 
  insertProductToSupabase, 
  updateProductInSupabase, 
  deleteProductFromSupabase, 
  mapDbRowToProduct,
  fetchReviewsFromSupabase,
  insertReviewToSupabase,
  replyReviewInSupabase,
  deleteReviewFromSupabase,
  mapDbRowToReview,
  fetchOrdersFromSupabase,
  insertOrderToSupabase,
  updateOrderStatusInSupabase,
  deleteOrderFromSupabase,
  mapDbRowToOrder,
  fetchCartFromSupabase,
  syncCartToSupabase
} from '../utils/supabaseClient';
import confetti from 'canvas-confetti';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const { language, t } = useTheme();

  // Navigation Screen State
  const [currentScreen, setCurrentScreen] = useState('HOME');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Products & Categories
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('noor_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories] = useState(initialCategories);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState(null);

  // Shopping Cart & Coupons
  const [cartMap, setCartMap] = useState(() => {
    const saved = localStorage.getItem('noor_cart');
    return saved ? JSON.parse(saved) : {};
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('noor_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState(null);
  const [lastPlacedInvoice, setLastPlacedInvoice] = useState(null);

  // Comparison State (max 3)
  const [comparedProductIds, setComparedProductIds] = useState(() => {
    const saved = localStorage.getItem('noor_compared');
    return saved ? JSON.parse(saved) : [];
  });

  // Reviews State
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('noor_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('noor_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 10245,
        customerName: "ئابدۇراخمان",
        customerPhone: "+905521234567",
        orderSummary: "• iPhone 16 Pro Max (512GB) x1 = ¥9999",
        totalAmount: 8999.1,
        note: "تېز يەتكۈزۈپ بېرىشىڭلارنى سورايمەن.",
        status: "Processing",
        date: "2026-08-19 14:30"
      },
      {
        id: 10246,
        customerName: "فاطمة الزهراء",
        customerPhone: "+905539876543",
        orderSummary: "• iPad Pro 13-inch M4 (Cellular) x1 = ¥8999",
        totalAmount: 8999.0,
        note: "يرجى التغليف كهدية",
        status: "Completed",
        date: "2026-08-18 10:15"
      }
    ];
  });

  // Super Admin Authentication & PIN
  const [adminPin, setAdminPin] = useState(() => {
    return localStorage.getItem('noor_admin_pin') || '1234';
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // AI Shopping Advisor State
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Nasheed Audio Player State
  const [nasheedTracks] = useState(initialNasheedTracks);
  const [currentTrack, setCurrentTrack] = useState(initialNasheedTracks[0]);
  const [isPlayingNasheed, setIsPlayingNasheed] = useState(false);
  const [isNasheedExpanded, setIsNasheedExpanded] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(new Audio());

  const currentTrackRef = useRef(currentTrack);
  const nasheedTracksRef = useRef(nasheedTracks);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    nasheedTracksRef.current = nasheedTracks;
  }, [nasheedTracks]);

  // Nasheed Player Controls
  const playNasheed = (track) => {
    if (!track) return;
    setCurrentTrack(track);
    currentTrackRef.current = track;
    const audio = audioRef.current;
    const resolvedUrl = getAssetUrl(track.audioSrc);
    audio.src = resolvedUrl;
    audio.load();
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlayingNasheed(true);
        })
        .catch(err => {
          console.warn("Audio autoplay blocked or interrupted:", err);
          setIsPlayingNasheed(false);
        });
    }
  };

  const togglePlayPauseNasheed = () => {
    const audio = audioRef.current;
    if (isPlayingNasheed) {
      audio.pause();
      setIsPlayingNasheed(false);
    } else {
      if (!audio.src || audio.src.endsWith('/') || !audio.src.includes('.mp3')) {
        audio.src = getAssetUrl(currentTrack.audioSrc);
        audio.load();
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlayingNasheed(true);
          })
          .catch(err => console.warn("Audio play error:", err));
      }
    }
  };

  const playNextTrack = () => {
    const list = nasheedTracksRef.current;
    const curr = currentTrackRef.current || currentTrack;
    const currentIndex = list.findIndex(t => t.id === curr.id);
    const nextIndex = (currentIndex + 1) % list.length;
    playNasheed(list[nextIndex]);
  };

  const playPrevTrack = () => {
    const list = nasheedTracksRef.current;
    const curr = currentTrackRef.current || currentTrack;
    const currentIndex = list.findIndex(t => t.id === curr.id);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    playNasheed(list[prevIndex]);
  };

  const toggleNasheedSection = () => setIsNasheedExpanded(prev => !prev);

  // Audio Player Event Listeners (mounted once)
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      playNextTrack();
    };

    const handlePlay = () => setIsPlayingNasheed(true);
    const handlePause = () => setIsPlayingNasheed(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isCloudLoading, setIsCloudLoading] = useState(true);

  // Realtime Supabase Cloud Synchronization with Mobile App
  useEffect(() => {
    let isMounted = true;

    const loadDataFromCloud = async () => {
      try {
        setIsCloudLoading(true);
        // 1. Fetch Products
        const pRes = await fetchProductsFromSupabase();
        if (isMounted && pRes && pRes.data && pRes.data.length > 0) {
          setProducts(pRes.data);
          localStorage.setItem('noor_products', JSON.stringify(pRes.data));
          setIsCloudConnected(true);
        }

        // 2. Fetch Reviews
        const rRes = await fetchReviewsFromSupabase();
        if (isMounted && rRes && rRes.data && rRes.data.length > 0) {
          setReviews(rRes.data);
          localStorage.setItem('noor_reviews', JSON.stringify(rRes.data));
        }

        // 3. Fetch Orders (Filter out internal Cart records)
        const oRes = await fetchOrdersFromSupabase();
        if (isMounted && oRes && oRes.data && oRes.data.length > 0) {
          const visibleOrders = oRes.data.filter(o => o.status !== 'Cart');
          setOrders(visibleOrders);
          localStorage.setItem('noor_orders', JSON.stringify(visibleOrders));
        }

        // 4. Fetch Shared Cart from Cloud
        const sharedItems = await fetchCartFromSupabase();
        if (isMounted && sharedItems && Array.isArray(sharedItems) && sharedItems.length > 0) {
          const newCartMap = {};
          sharedItems.forEach(item => {
            if (item && item.id) {
              const currentProds = pRes?.data || products;
              const prod = currentProds.find(p => String(p.id) === String(item.id)) || {
                id: item.id,
                nameUg: item.name || 'مەھسۇلات',
                nameAr: item.name || 'منتج',
                nameEn: item.name || 'Product',
                price: Number(item.price) || 0,
                imageResName: item.image || '/images/img_phones_1786037591338.jpg'
              };
              newCartMap[item.id] = { product: prod, quantity: Number(item.qty) || 1 };
            }
          });
          setCartMap(newCartMap);
        }
      } catch (err) {
        console.warn('Supabase initial fetch failed:', err);
      } finally {
        if (isMounted) setIsCloudLoading(false);
      }
    };

    loadDataFromCloud();

    // 1. Products Realtime Channel
    const productsChannel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          setIsCloudConnected(true);
          if (payload.eventType === 'INSERT' && payload.new) {
            const newProd = mapDbRowToProduct(payload.new);
            if (newProd) {
              setProducts(prev => {
                const exists = prev.some(p => String(p.id) === String(newProd.id));
                if (exists) return prev.map(p => String(p.id) === String(newProd.id) ? newProd : p);
                return [newProd, ...prev];
              });
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedProd = mapDbRowToProduct(payload.new);
            if (updatedProd) {
              setProducts(prev => prev.map(p => String(p.id) === String(updatedProd.id) ? updatedProd : p));
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const deletedId = payload.old.id;
            setProducts(prev => prev.filter(p => String(p.id) !== String(deletedId)));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setIsCloudConnected(true);
      });

    // 2. Reviews Realtime Channel
    const reviewsChannel = supabase
      .channel('public:reviews')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newRev = mapDbRowToReview(payload.new);
            if (newRev) {
              setReviews(prev => {
                const exists = prev.some(r => String(r.id) === String(newRev.id));
                if (exists) return prev.map(r => String(r.id) === String(newRev.id) ? newRev : r);
                return [newRev, ...prev];
              });
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedRev = mapDbRowToReview(payload.new);
            if (updatedRev) {
              setReviews(prev => prev.map(r => String(r.id) === String(updatedRev.id) ? updatedRev : r));
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const deletedId = payload.old.id;
            setReviews(prev => prev.filter(r => String(r.id) !== String(deletedId)));
          }
        }
      )
      .subscribe();

    // 3. Orders & Shared Cart Realtime Channel
    const ordersChannel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Handle Realtime Cart synchronization across devices
          if (payload.new && payload.new.status === 'Cart') {
            try {
              let rawItems = [];
              if (typeof payload.new.items_json === 'string') {
                rawItems = JSON.parse(payload.new.items_json);
              } else if (Array.isArray(payload.new.items_json)) {
                rawItems = payload.new.items_json;
              }
              const newCartMap = {};
              (rawItems || []).forEach(item => {
                if (item && item.id) {
                  const prod = products.find(p => String(p.id) === String(item.id)) || {
                    id: item.id,
                    nameUg: item.name || 'مەھسۇلات',
                    nameAr: item.name || 'منتج',
                    nameEn: item.name || 'Product',
                    price: Number(item.price) || 0,
                    imageResName: item.image || '/images/img_phones_1786037591338.jpg'
                  };
                  newCartMap[item.id] = { product: prod, quantity: Number(item.qty) || 1 };
                }
              });
              setCartMap(newCartMap);
            } catch (err) {
              console.warn("Realtime cart sync error:", err);
            }
            return;
          }

          if (payload.eventType === 'INSERT' && payload.new && payload.new.status !== 'Cart') {
            const newOrder = mapDbRowToOrder(payload.new);
            if (newOrder) {
              setOrders(prev => {
                const exists = prev.some(o => String(o.id) === String(newOrder.id));
                if (exists) return prev.map(o => String(o.id) === String(newOrder.id) ? newOrder : o);
                return [newOrder, ...prev];
              });
            }
          } else if (payload.eventType === 'UPDATE' && payload.new && payload.new.status !== 'Cart') {
            const updatedOrder = mapDbRowToOrder(payload.new);
            if (updatedOrder) {
              setOrders(prev => prev.map(o => String(o.id) === String(updatedOrder.id) ? updatedOrder : o));
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const deletedId = payload.old.id;
            setOrders(prev => prev.filter(o => String(o.id) !== String(deletedId)));
          }
        }
      )
      .subscribe();

    // Active polling every 3 seconds to guarantee instant cart sync across mobile & web
    const cartPollInterval = setInterval(async () => {
      if (!isMounted) return;
      try {
        const sharedItems = await fetchCartFromSupabase();
        if (sharedItems && Array.isArray(sharedItems)) {
          const newCartMap = {};
          sharedItems.forEach(item => {
            if (item && item.id) {
              const prod = products.find(p => String(p.id) === String(item.id)) || {
                id: item.id,
                nameUg: item.name || 'مەھسۇلات',
                nameAr: item.name || 'منتج',
                nameEn: item.name || 'Product',
                price: Number(item.price) || 0,
                imageResName: item.image || '/images/img_phones_1786037591338.jpg'
              };
              newCartMap[item.id] = { product: prod, quantity: Number(item.qty) || 1 };
            }
          });
          setCartMap(prev => {
            const prevKeys = Object.keys(prev).sort().join(',');
            const newKeys = Object.keys(newCartMap).sort().join(',');
            const prevQty = Object.values(prev).reduce((s, i) => s + (i.quantity || 0), 0);
            const newQty = Object.values(newCartMap).reduce((s, i) => s + (i.quantity || 0), 0);
            if (prevKeys === newKeys && prevQty === newQty) return prev;
            return newCartMap;
          });
        }
      } catch (e) {
        // silent catch
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(cartPollInterval);
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [products]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('noor_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('noor_cart', JSON.stringify(cartMap));
  }, [cartMap]);

  useEffect(() => {
    localStorage.setItem('noor_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('noor_compared', JSON.stringify(comparedProductIds));
  }, [comparedProductIds]);

  useEffect(() => {
    localStorage.setItem('noor_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('noor_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('noor_admin_pin', adminPin);
  }, [adminPin]);

  // Cart Calculations
  const cartItems = Object.values(cartMap);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const discountAmount = (() => {
    if (!appliedCoupon || cartSubtotal < appliedCoupon.minSpend) return 0;
    if (appliedCoupon.discountPercent > 0) {
      return (cartSubtotal * appliedCoupon.discountPercent) / 100;
    }
    return Math.min(appliedCoupon.discountAmount, cartSubtotal);
  })();

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  // Cart Actions with Cloud Sync
  const addToCart = (product) => {
    setCartMap(prev => {
      const existing = prev[product.id];
      const nextMap = existing 
        ? { ...prev, [product.id]: { ...existing, quantity: existing.quantity + 1 } }
        : { ...prev, [product.id]: { product, quantity: 1 } };
      syncCartToSupabase(nextMap);
      return nextMap;
    });
  };

  const decreaseCartQuantity = (productId) => {
    setCartMap(prev => {
      const existing = prev[productId];
      if (!existing) return prev;
      let nextMap;
      if (existing.quantity > 1) {
        nextMap = { ...prev, [productId]: { ...existing, quantity: existing.quantity - 1 } };
      } else {
        nextMap = { ...prev };
        delete nextMap[productId];
      }
      syncCartToSupabase(nextMap);
      return nextMap;
    });
  };

  const removeFromCart = (productId) => {
    setCartMap(prev => {
      const nextMap = { ...prev };
      delete nextMap[productId];
      syncCartToSupabase(nextMap);
      return nextMap;
    });
  };

  const clearCart = () => {
    setCartMap({});
    syncCartToSupabase({});
  };

  // Coupon Actions
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode);
    if (found) {
      if (cartSubtotal >= found.minSpend) {
        setAppliedCoupon(found);
        setCouponMessage({ type: 'success', text: t('code_applied') });
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      } else {
        setCouponMessage({ type: 'error', text: `${t('invalid_code')} (Min: ¥${found.minSpend})` });
      }
    } else {
      setCouponMessage({ type: 'error', text: t('invalid_code') });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage(null);
  };

  // Compare Actions
  const toggleCompare = (product) => {
    setComparedProductIds(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      }
      const updated = [...prev, product.id];
      if (updated.length > 3) updated.shift();
      return updated;
    });
  };

  const removeFromCompare = (productId) => {
    setComparedProductIds(prev => prev.filter(id => id !== productId));
  };

  const clearCompare = () => setComparedProductIds([]);

  const isCompared = (productId) => comparedProductIds.includes(productId);

  const comparedProducts = comparedProductIds.map(id => products.find(p => p.id === id)).filter(Boolean);

  // Favorites & Likes Interactions
  const toggleHeart = async (productId) => {
    let newHearts = 0;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        newHearts = p.heartsCount > 0 ? 0 : p.heartsCount + 1;
        return { ...p, heartsCount: newHearts };
      }
      return p;
    }));
    await updateProductInSupabase(productId, { heartsCount: newHearts });
  };

  const incrementLikes = async (productId) => {
    let newLikes = 0;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        newLikes = (p.likesCount || 0) + 1;
        return { ...p, likesCount: newLikes };
      }
      return p;
    }));
    await updateProductInSupabase(productId, { likesCount: newLikes });
  };

  const favoriteProducts = products.filter(p => p.heartsCount > 0);

  // Reviews CRUD (Synced with Supabase & Mobile App)
  const addReview = async (productId, userName, comment) => {
    if (!comment.trim()) return;
    const newRev = {
      id: Date.now(),
      productId: Number(productId) || productId,
      userName: userName.trim() || t('your_name'),
      comment: comment.trim(),
      adminReply: '',
      timestamp: Date.now()
    };
    setReviews(prev => [newRev, ...prev]);
    confetti({ particleCount: 40, spread: 50 });
    await insertReviewToSupabase(newRev);
  };

  const replyToReview = async (reviewId, reply) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, adminReply: reply } : r));
    await replyReviewInSupabase(reviewId, reply);
  };

  const deleteReview = async (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    await deleteReviewFromSupabase(reviewId);
  };

  const getReviewsForProduct = (productId) => {
    return reviews.filter(r => String(r.productId) === String(productId));
  };

  // Product CRUD (Synced with Supabase & Mobile App)
  const addProduct = async (newProd) => {
    const product = {
      ...newProd,
      likesCount: 0,
      heartsCount: 0
    };
    const res = await insertProductToSupabase(product);
    if (res && res.success && res.data) {
      setProducts(prev => [res.data, ...prev]);
    } else {
      const fallback = { ...product, id: Date.now() };
      setProducts(prev => [fallback, ...prev]);
    }
  };

  const updateProduct = async (updatedProd) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    await updateProductInSupabase(updatedProd.id, updatedProd);
  };

  const updateProductPrice = async (productId, newPrice) => {
    const numPrice = Number(newPrice);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: numPrice } : p));
    await updateProductInSupabase(productId, { price: numPrice, originalPrice: numPrice * 1.1 });
  };

  const toggleStock = async (productId) => {
    let nextStock = false;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        nextStock = !p.inStock;
        return { ...p, inStock: nextStock };
      }
      return p;
    }));
    await updateProductInSupabase(productId, { inStock: nextStock });
  };

  const toggleFeatured = async (productId) => {
    let nextFeatured = false;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        nextFeatured = !p.isFeatured;
        return { ...p, isFeatured: nextFeatured };
      }
      return p;
    }));
    await updateProductInSupabase(productId, { isFeatured: nextFeatured });
  };

  const deleteProduct = async (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    await deleteProductFromSupabase(productId);
  };

  // Coupons CRUD
  const addCoupon = (newCoupon) => {
    setCoupons(prev => [newCoupon, ...prev.filter(c => c.code.toUpperCase() !== newCoupon.code.toUpperCase())]);
  };

  const deleteCoupon = (code) => {
    setCoupons(prev => prev.filter(c => c.code.toUpperCase() !== code.toUpperCase()));
  };

  // Orders Management (Synced with Supabase & Mobile App)
  const submitOrder = async (customerName, customerPhone, note, channel) => {
    if (cartItems.length === 0) return null;

    const orderId = Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const summaryStr = cartItems.map(item => {
      const pName = language === 'uyghur' ? item.product.nameUg : language === 'arabic' ? item.product.nameAr : item.product.nameEn;
      return `• ${pName} x${item.quantity} = ¥${(item.product.price * item.quantity).toFixed(2)}`;
    }).join('\n');

    const orderItems = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.nameUg || item.product.nameEn,
      price: item.product.price,
      quantity: item.quantity
    }));

    const newOrder = {
      id: orderId,
      customerName,
      customerPhone,
      orderSummary: summaryStr,
      totalAmount: finalTotal,
      note,
      status: "Pending",
      date: dateStr,
      items: orderItems
    };

    setOrders(prev => [newOrder, ...prev]);

    const invoiceText = generateInvoiceText(orderId, customerName, customerPhone, note, cartItems, cartSubtotal, discountAmount, finalTotal, appliedCoupon?.code);
    setLastPlacedInvoice(invoiceText);
    clearCart();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    // Sync to Supabase Orders table
    await insertOrderToSupabase(newOrder);

    if (channel === 'whatsapp') {
      const cleanPhone = "+860995416715";
      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(invoiceText)}`, '_blank');
    } else if (channel === 'telegram') {
      window.open(`https://t.me/sensiz09985?text=${encodeURIComponent(invoiceText)}`, '_blank');
    }

    return invoiceText;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatusInSupabase(orderId, newStatus);
  };

  const deleteOrder = async (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    await deleteOrderFromSupabase(orderId);
  };

  const notifyCustomer = (order, newStatus) => {
    const statusText = {
      'Pending': '⏳ كۈتۈلۈۋاتىدۇ (Pending)',
      'Processing': '📦 تەييارلىنىۋاتىدۇ (Processing)',
      'Shipped': '🚚 يوللاندى (Shipped)',
      'Completed': '✅ تاپشۇرۇلدى (Completed)',
      'Cancelled': '❌ بىكار قىلىندى (Cancelled)'
    }[newStatus] || newStatus;

    const msg = `ئەسسالامۇ ئەلەيكۇم ھۆرمەتلىك ${order.customerName}!\n🛒 نۇرلۇق تېلېفونچىلىقى - ئېلېكترونلۇق زاكاز ھالىتى\n🆔 #${order.id}\n📌 زاكاز ھالىتى: ${statusText}\n💰 ئومۇمىي سومما: ¥${order.totalAmount}\n📝 ئەسكەرتىش: ${order.note || 'N/A'}\n\n📍 ${t('store_address')}\n📞 0995416715`;
    const cleanPhone = order.customerPhone.replace(/[^0-9+]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Invoice Text Formatter
  const generateInvoiceText = (orderId, customerName, customerPhone, note, items, subtotal, discount, total, couponCode) => {
    const dateStr = new Date().toLocaleString();
    let text = `═══════════════════════════════\n`;
    text += ` 📱 NOOR STORE - ELECTRONIC INVOICE\n`;
    text += ` «نۇرلۇق» تېلېفونچىلىقى - ئېلېكترونلۇق تالون\n`;
    text += `═══════════════════════════════\n\n`;
    text += `📋 ${t('order_id')}: #${orderId}\n`;
    text += `📅 ${t('date')}: ${dateStr}\n`;
    text += `👤 ${t('customer_name')}: ${customerName}\n`;
    text += `📞 ${t('customer_phone')}: ${customerPhone}\n\n`;
    text += `─────────── ITEMS ───────────\n`;
    items.forEach((item, idx) => {
      const pName = language === 'uyghur' ? item.product.nameUg : language === 'arabic' ? item.product.nameAr : item.product.nameEn;
      text += `${idx + 1}. ${pName}\n`;
      text += `   • Qty: ${item.quantity}  ×  ¥${item.product.price}  =  ¥${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    text += `─────────────────────────────\n`;
    text += `💵 ${t('subtotal')}: ¥${subtotal.toFixed(2)}\n`;
    if (discount > 0) {
      text += `🏷️ ${t('discount')} (${couponCode || 'PROMO'}): -¥${discount.toFixed(2)}\n`;
    }
    text += `⭐ ${t('total_price')}: ¥${total.toFixed(2)}\n\n`;
    if (note && note.trim()) {
      text += `📝 ${t('order_note')}: ${note}\n\n`;
    }
    text += `🏢 ${t('store_address')}\n`;
    text += `🕒 ${t('business_hours')}\n`;
    text += `☎️ WhatsApp: 0995416715 | Telegram: @sensiz09985\n`;
    text += `═══════════════════════════════\n`;
    return text;
  };

  // Sales Report Generator
  const generateSalesReport = () => {
    const totalRev = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);
    const totalInv = products.reduce((sum, p) => sum + (p.price * 5), 0); // approx inventory
    const completed = orders.filter(o => o.status === 'Completed').length;
    const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;

    return `════════════════════════════════\n` +
      ` 📊 ${t('sales_report_title')}\n` +
      ` 📅 ${new Date().toLocaleDateString()}\n` +
      `════════════════════════════════\n\n` +
      `💰 ${t('total_sales_revenue')}: ¥${totalRev.toFixed(2)}\n` +
      `📦 ${t('total_inventory_value')}: ¥${totalInv.toFixed(2)}\n` +
      `📋 ${t('total_orders_count')}: ${orders.length}\n` +
      `⏳ ${t('pending_orders')}: ${pending}\n` +
      `✅ ${t('completed_orders')}: ${completed}\n\n` +
      `🏢 ${t('store_address')}\n` +
      `════════════════════════════════`;
  };


  // AI Shopping Advisor
  const initAiWelcomeMessage = () => {
    if (aiChatMessages.length === 0) {
      const welcome = {
        uyghur: "ياخشىمۇسىز! مەن «نۇرلۇق» ئەقلىي مەسلىھەتچىسى. سىزگە خامچوتىڭىز، خىزمەت ياكى كۈندىلىك ئېھتىياجىڭىزغا ماس كېلىدىغان تېلېفون ۋە پەدلەرنى تەۋسىيە قىلالايمەن. تۆۋەندىكى تېز تاللاشلارنى بېسىڭ ياكى سوئالىڭىزنى يېزىڭ!",
        arabic: "أهلاً بك! أنا مستشارك الذكي في متجر النور. يمكنني مساعدتك باختيار أفضل هاتف أو تابلت يناسب ميزانيتك واستخدامك. اختر من الخيارات السريعة أو اكتب سؤالك!",
        english: "Hello! I am your Noor Smart Shopping Advisor. Tell me your budget or needs (camera, battery, study, gaming), and I'll find the perfect device for you!"
      }[language] || "ياخشىمۇسىز!";

      setAiChatMessages([{ isUser: false, text: welcome, recommendedProducts: [] }]);
    }
  };

  const askAiAdvisor = (query) => {
    if (!query.trim()) return;
    const userMsg = { isUser: true, text: query, recommendedProducts: [] };
    setAiChatMessages(prev => [...prev, userMsg]);
    setIsAiThinking(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let recommended = [];
      let responseText = '';

      if (q.includes('كامېرا') || q.includes('camera') || q.includes('تصوير') || q.includes('رەسىم')) {
        recommended = products.filter(p => p.specsEn.includes('MP') || p.categoryId === 'phones').slice(0, 2);
        responseText = language === 'uyghur'
          ? "سۈرەت ۋە سىن ئېلىشقا ئەڭ يۇقىرى دەرىجىلىك كۆپ كامېرالىق، ئوپتىكىلىق تۇراقلاشتۇرغۇچلۇق بايراقدار تېلېفونلارنى تەۋسىيە قىلىمەن:"
          : language === 'arabic'
          ? "إذا كنت تبحث عن كاميرا احترافية وتصوير بدقة فائقة، إليك أفضل الأجهزة المميزة بكاميرات متقدمة:"
          : "For exceptional photography and video quality, here are our best camera flagships:";
      } else if (q.includes('پەد') || q.includes('tablet') || q.includes('تابلت') || q.includes('ئوقۇش') || q.includes('ipad')) {
        recommended = products.filter(p => p.categoryId === 'tablets').slice(0, 3);
        responseText = language === 'uyghur'
          ? "ئوقۇش، ئىشخانا خىزمىتى، كىنو كۆرۈش ۋە رەسىم سىزىشقا چوڭ سۈزۈك ئېكرانلىق، قەلەم قوللايدىغان پەدلەر ئەڭ مۇۋاپىق:"
          : language === 'arabic'
          ? "للدراسة، العمل، الرسم ومشاهدة المحتوى، إليك أفضل الأجهزة اللوحية (التابلت) بشاشات واسعة:"
          : "For study, remote work, drawing, and media consumption, here are our recommended tablets:";
      } else if (q.includes('3000') || q.includes('ئەرزان') || q.includes('رخيص') || q.includes('budget') || q.includes('خامچوت')) {
        recommended = [...products].filter(p => p.price <= 3500).sort((a, b) => a.price - b.price).slice(0, 3);
        responseText = language === 'uyghur'
          ? "باھا ۋە ئىقتىدار نىسبىتى ئەڭ يۇقىرى، 3000 يۈەن ئەتراپىدىكى تەۋسىيەلىك ئەلا سۈپەتلىك تاللاشلار:"
          : language === 'arabic'
          ? "إليك أفضل الهواتف والأجهزة الاقتصادية ذات الأداء العالي والمواصفات الممتازة بأفضل سعر:"
          : "Here are our top high-value devices offering incredible performance within budget:";
      } else if (q.includes('باتارېيە') || q.includes('battery') || q.includes('بطارية') || q.includes('زەرەت')) {
        recommended = products.filter(p => p.specsEn.includes('mAh') || p.specsUg.includes('باتارېيە')).slice(0, 2);
        responseText = language === 'uyghur'
          ? "بىر كۈندىن ئارتۇق بىمالال يېتىدىغان چوڭ سىغىملىق باتارېيەلىك ۋە تېز قاچىلىغۇچلۇق تېلېفونلار:"
          : language === 'arabic'
          ? "أجهزة ببطاريات عملاقة تدوم طويلاً مع دعم الشحن السريع الفائق:"
          : "Devices equipped with large-capacity batteries and ultra-fast charging:";
      } else if (q.includes('ئويۇن') || q.includes('game') || q.includes('gaming') || q.includes('ألعاب')) {
        recommended = products.filter(p => p.price >= 4000 || p.isFeatured).slice(0, 2);
        responseText = language === 'uyghur'
          ? "ئېغىر دەرىجىلىك 3D ئويۇنلار ۋە يۇقىرى ئىقتىدارلىق پروگراممىلارغا ماس كېلىدىغان كۈچلۈك بىر تەرەپ قىلغۇچلۇق بايراقدارلار:"
          : language === 'arabic'
          ? "للألعاب الثقيلة والمهام الشاقة، إليك الأجهزة الأقوى مع أفضل المعالجات وشاشات التردد العالي:"
          : "Ultimate powerhouses with top-tier processors and high refresh rate screens for gaming & multitasking:";
      } else {
        const matches = products.filter(p =>
          p.nameUg.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        );
        recommended = matches.length > 0 ? matches.slice(0, 2) : products.filter(p => p.isFeatured).slice(0, 2);
        responseText = language === 'uyghur'
          ? "ئىزدىشىڭىزگە مۇناسىۋەتلىك ئامباردىكى ئەڭ ياخشى مەھسۇلاتلار تەييارلاندى:"
          : language === 'arabic'
          ? "إليك أفضل النتائج المتطابقة مع طلبك في متجرنا:"
          : "Here are the best matching items from our store catalogue:";
      }

      setIsAiThinking(false);
      setAiChatMessages(prev => [...prev, {
        isUser: false,
        text: responseText,
        recommendedProducts: recommended
      }]);
    }, 500);
  };

  const resetAiChat = () => {
    setAiChatMessages([]);
    initAiWelcomeMessage();
  };

  const openAiAdvisor = () => {
    setIsAiAdvisorOpen(true);
    initAiWelcomeMessage();
  };

  const closeAiAdvisor = () => setIsAiAdvisorOpen(false);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesQuery = !searchQuery.trim() ||
      p.nameUg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = !selectedCategoryId || p.categoryId === selectedCategoryId;
    const matchesPrice = !maxPriceFilter || p.price <= maxPriceFilter;

    return matchesQuery && matchesCat && matchesPrice;
  });

  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <StoreContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      selectedProduct,
      setSelectedProduct,
      products,
      categories,
      filteredProducts,
      featuredProducts,
      favoriteProducts,
      searchQuery,
      setSearchQuery,
      selectedCategoryId,
      setSelectedCategoryId,
      maxPriceFilter,
      setMaxPriceFilter,
      cartMap,
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
      comparedProductIds,
      comparedProducts,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      isCompared,
      toggleHeart,
      incrementLikes,
      reviews,
      addReview,
      replyToReview,
      deleteReview,
      getReviewsForProduct,
      orders,
      submitOrder,
      updateOrderStatus,
      deleteOrder,
      notifyCustomer,
      generateInvoiceText,
      lastPlacedInvoice,
      generateSalesReport,
      addProduct,
      updateProduct,
      updateProductPrice,
      toggleStock,
      toggleFeatured,
      deleteProduct,
      addCoupon,
      deleteCoupon,
      adminPin,
      setAdminPin,
      isAdminLoggedIn,
      setIsAdminLoggedIn,
      isAiAdvisorOpen,
      openAiAdvisor,
      closeAiAdvisor,
      aiChatMessages,
      isAiThinking,
      askAiAdvisor,
      resetAiChat,
      isCloudConnected,
      isCloudLoading,
      nasheedTracks,
      currentTrack,
      isPlayingNasheed,
      isNasheedExpanded,
      audioProgress,
      playNasheed,
      togglePlayPauseNasheed,
      playNextTrack,
      playPrevTrack,
      toggleNasheedSection
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
