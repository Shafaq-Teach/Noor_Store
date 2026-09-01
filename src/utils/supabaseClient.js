import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://yufuhjdmzgehwnypdpba.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_db9lknMr2xWIuxzdBUIvww_le2sVZEu';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// 1. PRODUCTS MAPPING & CRUD
// ==========================================

export const mapDbRowToProduct = (row) => {
  if (!row) return null;

  let img1 = row.image_res_name || row.image_url || row.imageUrl || row.image || row.photo || row.img || '';
  let img2 = row.image_res_name2 || row.image_url2 || row.imageUrl2 || row.image2 || row.img2 || '';
  let img3 = row.image_res_name3 || row.image_url3 || row.imageUrl3 || row.image3 || row.img3 || '';

  if (Array.isArray(row.images) && row.images.length > 0) {
    img1 = row.images[0] || img1;
    img2 = row.images[1] || img2;
    img3 = row.images[2] || img3;
  }

  const primaryName = row.name_ug || row.nameUg || row.title_ug || row.title || row.name || row.product_name || 'Noor Product';
  const primaryDesc = row.description_ug || row.descUg || row.description || row.desc || row.details || '';

  return {
    id: row.id,
    nameUg: primaryName,
    nameAr: row.name_ar || row.nameAr || row.title_ar || primaryName,
    nameEn: row.name_en || row.nameEn || row.title_en || primaryName,
    descriptionUg: primaryDesc,
    descriptionAr: row.description_ar || row.descAr || primaryDesc,
    descriptionEn: row.description_en || row.descEn || primaryDesc,
    price: Number(row.price || row.cost || row.amount || 0),
    originalPrice: row.original_price !== null && row.original_price !== undefined 
      ? Number(row.original_price) 
      : (row.old_price !== null && row.old_price !== undefined ? Number(row.old_price) : (row.originalPrice ? Number(row.originalPrice) : null)),
    categoryId: row.category_id || row.category || row.categoryId || 'phones',
    brand: row.brand || row.brand_name || 'Noor',
    imageResName: img1 || '/images/img_phones_1786037591338.jpg',
    imageResName2: img2,
    imageResName3: img3,
    isFeatured: !!(row.is_featured ?? row.isFeatured ?? row.featured),
    inStock: !!(row.in_stock ?? (row.stock !== undefined ? Number(row.stock) > 0 : true) ?? row.inStock ?? true),
    specsUg: row.specs_ug || row.specsUg || `Brand: ${row.brand || 'Noor'}`,
    specsAr: row.specs_ar || row.specsAr || '',
    specsEn: row.specs_en || row.specsEn || '',
    likesCount: Number(row.likes_count || row.likesCount || row.likes || 0),
    heartsCount: Number(row.hearts_count || row.heartsCount || row.hearts || 0),
    rating: Number(row.rating || 5.0),
    createdAt: row.created_at || new Date().toISOString()
  };
};

export const fetchProductsFromSupabase = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) {
      console.error('Supabase fetch error:', error);
      return { success: false, error: error.message || JSON.stringify(error), data: [] };
    }
    const mapped = (data || []).map(mapDbRowToProduct).filter(Boolean);
    return { success: true, raw: data, data: mapped };
  } catch (err) {
    console.error('Supabase fetch exception:', err);
    return { success: false, error: err.message || String(err), data: [] };
  }
};

export const insertProductToSupabase = async (prod) => {
  try {
    // Get max ID to avoid sequence conflict
    const { data: allProds } = await supabase.from('products').select('id');
    const maxId = allProds && allProds.length > 0 ? Math.max(...allProds.map(p => Number(p.id) || 0)) : 0;
    const newId = (maxId > 0 ? maxId : 100) + 1;

    const primaryName = prod.nameUg || prod.nameAr || prod.nameEn || 'Noor Product';
    const primaryDesc = prod.descriptionUg || prod.descriptionAr || prod.descriptionEn || '';

    const dbRow = {
      id: newId,
      name_ug: primaryName,
      name_ar: prod.nameAr || primaryName,
      name_en: prod.nameEn || primaryName,
      description_ug: primaryDesc,
      description_ar: prod.descriptionAr || primaryDesc,
      description_en: prod.descriptionEn || primaryDesc,
      price: Number(prod.price) || 0,
      original_price: prod.originalPrice ? Number(prod.originalPrice) : (Number(prod.price || 0) * 1.1),
      category_id: prod.categoryId || 'phones',
      brand: prod.brand || 'Apple',
      image_res_name: prod.imageResName || '/images/img_phones_1786037591338.jpg',
      image_res_name2: prod.imageResName2 || '',
      image_res_name3: prod.imageResName3 || '',
      is_featured: !!prod.isFeatured,
      in_stock: prod.inStock !== false,
      specs_ug: prod.specsUg || `Brand: ${prod.brand || 'Apple'}`,
      specs_ar: prod.specsAr || '',
      specs_en: prod.specsEn || '',
      likes_count: Number(prod.likesCount) || 0,
      hearts_count: Number(prod.heartsCount) || 0
    };

    const { data, error } = await supabase.from('products').insert([dbRow]).select();
    if (error) {
      console.warn('Supabase insert product error:', error);
      return { success: false, error };
    }
    return { success: true, data: data && data[0] ? mapDbRowToProduct(data[0]) : mapDbRowToProduct(dbRow) };
  } catch (err) {
    console.warn('Supabase insert product exception:', err);
    return { success: false, error: err };
  }
};

export const updateProductInSupabase = async (productId, updates) => {
  try {
    const dbUpdates = {};
    if (updates.nameUg !== undefined) dbUpdates.name_ug = updates.nameUg;
    if (updates.nameAr !== undefined) dbUpdates.name_ar = updates.nameAr;
    if (updates.nameEn !== undefined) dbUpdates.name_en = updates.nameEn;
    if (updates.descriptionUg !== undefined) dbUpdates.description_ug = updates.descriptionUg;
    if (updates.price !== undefined) dbUpdates.price = Number(updates.price);
    if (updates.originalPrice !== undefined) dbUpdates.original_price = Number(updates.originalPrice);
    if (updates.inStock !== undefined) dbUpdates.in_stock = !!updates.inStock;
    if (updates.isFeatured !== undefined) dbUpdates.is_featured = !!updates.isFeatured;
    if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
    if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
    if (updates.imageResName !== undefined) dbUpdates.image_res_name = updates.imageResName;
    if (updates.imageResName2 !== undefined) dbUpdates.image_res_name2 = updates.imageResName2;
    if (updates.imageResName3 !== undefined) dbUpdates.image_res_name3 = updates.imageResName3;
    if (updates.likesCount !== undefined) dbUpdates.likes_count = Number(updates.likesCount);
    if (updates.heartsCount !== undefined) dbUpdates.hearts_count = Number(updates.heartsCount);

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', Number(productId) || productId);

    if (error) {
      console.warn('Supabase update product error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase update product exception:', err);
    return { success: false, error: err };
  }
};

export const deleteProductFromSupabase = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', Number(productId) || productId);

    if (error) {
      console.warn('Supabase delete product error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase delete product exception:', err);
    return { success: false, error: err };
  }
};

// ==========================================
// 2. REVIEWS MAPPING & CRUD
// ==========================================

export const mapDbRowToReview = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    productId: row.product_id,
    userName: row.user_name || 'خېرىدار',
    rating: Number(row.rating) || 5,
    comment: row.comment || '',
    adminReply: row.admin_reply || '',
    timestamp: Number(row.timestamp) || Date.now(),
    createdAt: row.created_at || new Date().toISOString()
  };
};

export const fetchReviewsFromSupabase = async () => {
  try {
    const { data, error } = await supabase.from('reviews').select('*').order('id', { ascending: false });
    if (error) {
      console.error('Supabase fetch reviews error:', error);
      return { success: false, error: error.message, data: [] };
    }
    const mapped = (data || []).map(mapDbRowToReview).filter(Boolean);
    return { success: true, data: mapped };
  } catch (err) {
    console.error('Supabase fetch reviews exception:', err);
    return { success: false, error: String(err), data: [] };
  }
};

export const insertReviewToSupabase = async (review) => {
  try {
    const { data: allRevs } = await supabase.from('reviews').select('id');
    const maxId = allRevs && allRevs.length > 0 ? Math.max(...allRevs.map(r => Number(r.id) || 0)) : 0;
    const newId = maxId + 1;

    const row = {
      id: newId,
      product_id: Number(review.productId) || 0,
      user_name: review.userName || 'خېرىدار',
      rating: Number(review.rating) || 5,
      comment: review.comment || '',
      admin_reply: review.adminReply || '',
      timestamp: Number(review.timestamp) || Date.now()
    };

    const { data, error } = await supabase.from('reviews').insert([row]).select();
    if (error) {
      console.warn('Supabase insert review error:', error);
      return { success: false, error };
    }
    return { success: true, data: data && data[0] ? mapDbRowToReview(data[0]) : null };
  } catch (err) {
    console.warn('Supabase insert review exception:', err);
    return { success: false, error: err };
  }
};

export const replyReviewInSupabase = async (reviewId, replyText) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({ admin_reply: replyText })
      .eq('id', Number(reviewId) || reviewId);

    if (error) {
      console.warn('Supabase reply review error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase reply review exception:', err);
    return { success: false, error: err };
  }
};

export const deleteReviewFromSupabase = async (reviewId) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', Number(reviewId) || reviewId);

    if (error) {
      console.warn('Supabase delete review error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase delete review exception:', err);
    return { success: false, error: err };
  }
};

// ==========================================
// 3. ORDERS MAPPING & CRUD
// ==========================================

export const mapDbRowToOrder = (row) => {
  if (!row) return null;

  let items = [];
  try {
    if (typeof row.items_json === 'string') {
      items = JSON.parse(row.items_json);
    } else if (Array.isArray(row.items_json)) {
      items = row.items_json;
    }
  } catch {
    items = [];
  }

  // Format order summary from items_json
  let summaryStr = '';
  if (Array.isArray(items) && items.length > 0) {
    summaryStr = items.map(item => `• ${item.name || item.nameUg || 'Item'} x${item.qty || item.quantity || 1} = ¥${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}`).join('\n');
  }

  const orderDateNum = Number(row.order_date) || Date.now();
  const dateStr = new Date(orderDateNum).toISOString().replace('T', ' ').substring(0, 16);

  return {
    id: row.id,
    customerName: row.customer_name || 'خېرىدار',
    customerPhone: row.customer_phone || '',
    orderSummary: summaryStr,
    totalAmount: Number(row.total_price) || 0,
    note: row.note || '',
    status: row.status || 'Pending',
    date: dateStr,
    orderDate: orderDateNum,
    items: items,
    createdAt: row.created_at || new Date().toISOString()
  };
};

export const fetchOrdersFromSupabase = async () => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('id', { ascending: false });
    if (error) {
      console.error('Supabase fetch orders error:', error);
      return { success: false, error: error.message, data: [] };
    }
    const mapped = (data || []).map(mapDbRowToOrder).filter(Boolean);
    return { success: true, data: mapped };
  } catch (err) {
    console.error('Supabase fetch orders exception:', err);
    return { success: false, error: String(err), data: [] };
  }
};

export const insertOrderToSupabase = async (orderData) => {
  try {
    const { data: allOrders } = await supabase.from('orders').select('id');
    const maxId = allOrders && allOrders.length > 0 ? Math.max(...allOrders.map(o => Number(o.id) || 0)) : 0;
    const newId = maxId + 1;

    const row = {
      id: newId,
      customer_name: orderData.customerName || 'خېرىدار',
      customer_phone: orderData.customerPhone || '',
      items_json: JSON.stringify(orderData.items || []),
      total_price: Number(orderData.totalAmount) || 0,
      order_date: Date.now(),
      status: orderData.status || 'Pending',
      note: orderData.note || ''
    };

    const { data, error } = await supabase.from('orders').insert([row]).select();
    if (error) {
      console.warn('Supabase insert order error:', error);
      return { success: false, error };
    }
    return { success: true, data: data && data[0] ? mapDbRowToOrder(data[0]) : null };
  } catch (err) {
    console.warn('Supabase insert order exception:', err);
    return { success: false, error: err };
  }
};

export const updateOrderStatusInSupabase = async (orderId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', Number(orderId) || orderId);

    if (error) {
      console.warn('Supabase update order error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase update order exception:', err);
    return { success: false, error: err };
  }
};

export const deleteOrderFromSupabase = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', Number(orderId) || orderId);

    if (error) {
      console.warn('Supabase delete order error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase delete order exception:', err);
    return { success: false, error: err };
  }
};

// ==========================================
// 4. SHARED REALTIME CART (WEB <-> MOBILE APP)
// ==========================================

export const fetchCartFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', 999999)
      .maybeSingle();

    if (!error && data) {
      const raw = data.items_json || data.order_summary;
      if (!raw) return [];
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    }

    // fallback check
    const { data: alt } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'Cart')
      .order('id', { ascending: false })
      .limit(1);

    if (alt && alt.length > 0) {
      const row = alt[0];
      const raw = row.items_json || row.order_summary;
      if (!raw) return [];
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    }
    return null;
  } catch (err) {
    console.warn('Fetch shared cart exception:', err);
    return null;
  }
};

export const syncCartToSupabase = async (cartMap) => {
  try {
    const itemsList = Object.values(cartMap).map(item => ({
      id: item.product?.id || item.id,
      name: item.product?.nameUg || item.product?.nameEn || item.name || 'Product',
      price: Number(item.product?.price || item.price || 0),
      qty: Number(item.quantity || 1),
      image: item.product?.imageResName || ''
    }));

    const total = itemsList.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const jsonStr = JSON.stringify(itemsList);

    await supabase.from('orders').upsert({
      id: 999999,
      customer_name: 'ئورتاق سىۋەت (Shared Cart)',
      customer_phone: 'shared_cart',
      items_json: jsonStr,
      order_summary: jsonStr,
      total_price: total,
      total_amount: total,
      order_date: Date.now(),
      status: 'Cart',
      note: 'Shared Cart across Web & Mobile App'
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Sync shared cart exception:', err);
  }
};
