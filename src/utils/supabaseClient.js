import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://trmuvfswhuxcbbjoxwgh.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRybXV2ZnN3aHV4Y2Jiam94d2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzU3NzYsImV4cCI6MjA4Nzc1MTc3Nn0.7JgIuD44mP19E022kUa0d1e3yP21cO-jCqJkM5t129A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to map Supabase database row to Web Product format
export const mapDbRowToProduct = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    nameUg: row.name_ug || row.nameUg || row.title_ug || '',
    nameAr: row.name_ar || row.nameAr || row.title_ar || row.name_ug || '',
    nameEn: row.name_en || row.nameEn || row.title_en || row.name_ug || '',
    descriptionUg: row.description_ug || row.descUg || row.description || '',
    descriptionAr: row.description_ar || row.descAr || '',
    descriptionEn: row.description_en || row.descEn || '',
    price: Number(row.price) || 0,
    originalPrice: row.old_price !== null && row.old_price !== undefined 
      ? Number(row.old_price) 
      : (row.originalPrice ? Number(row.originalPrice) : null),
    categoryId: row.category || row.categoryId || 'phones',
    brand: row.brand || 'Apple',
    imageResName: row.image_res_name || row.imageResName || row.imageUrl || row.image || '/images/img_phones_1786037591338.jpg',
    imageResName2: row.image_res_name2 || row.imageResName2 || '',
    imageResName3: row.image_res_name3 || row.imageResName3 || '',
    isFeatured: !!(row.is_featured ?? row.isFeatured),
    inStock: (row.stock !== undefined ? Number(row.stock) > 0 : true) && (row.inStock ?? true),
    specsUg: row.specs_ug || row.specsUg || `Brand: ${row.brand || ''}`,
    specsAr: row.specs_ar || row.specsAr || '',
    specsEn: row.specs_en || row.specsEn || '',
    likesCount: Number(row.likes_count || row.likesCount || 0),
    heartsCount: Number(row.hearts_count || row.heartsCount || 0),
    rating: Number(row.rating) || 5.0,
    createdAt: row.created_at || new Date().toISOString()
  };
};

// Helper to map Web Product format to Supabase DB row
export const mapProductToDbRow = (prod) => {
  if (!prod) return null;
  return {
    id: String(prod.id),
    name_ug: prod.nameUg || '',
    name_ar: prod.nameAr || prod.nameUg || '',
    name_en: prod.nameEn || prod.nameUg || '',
    description_ug: prod.descriptionUg || '',
    description_ar: prod.descriptionAr || '',
    description_en: prod.descriptionEn || '',
    price: Number(prod.price) || 0,
    old_price: prod.originalPrice ? Number(prod.originalPrice) : null,
    stock: prod.inStock !== false ? 10 : 0,
    category: prod.categoryId || 'phones',
    brand: prod.brand || 'Apple',
    image_res_name: prod.imageResName || '/images/img_phones_1786037591338.jpg',
    image_res_name2: prod.imageResName2 || '',
    image_res_name3: prod.imageResName3 || '',
    is_featured: !!prod.isFeatured,
    specs_ug: prod.specsUg || '',
    specs_ar: prod.specsAr || '',
    specs_en: prod.specsEn || '',
    likes_count: Number(prod.likesCount) || 0,
    hearts_count: Number(prod.heartsCount) || 0,
    rating: Number(prod.rating) || 5.0
  };
};

// Fetch all products from Supabase
export const fetchProductsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error.message || error);
      return null;
    }

    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapDbRowToProduct).filter(Boolean);
    }
    return [];
  } catch (err) {
    console.warn('Supabase network error:', err);
    return null;
  }
};

// Add product to Supabase
export const insertProductToSupabase = async (productData) => {
  try {
    const row = mapProductToDbRow(productData);
    const { data, error } = await supabase
      .from('products')
      .insert([row])
      .select();

    if (error) {
      console.warn('Supabase insert error:', error.message || error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase insert exception:', err);
    return { success: false, error: err };
  }
};

// Update product in Supabase
export const updateProductInSupabase = async (productId, updates) => {
  try {
    const dbUpdates = {};
    if (updates.nameUg !== undefined) dbUpdates.name_ug = updates.nameUg;
    if (updates.nameAr !== undefined) dbUpdates.name_ar = updates.nameAr;
    if (updates.nameEn !== undefined) dbUpdates.name_en = updates.nameEn;
    if (updates.descriptionUg !== undefined) dbUpdates.description_ug = updates.descriptionUg;
    if (updates.price !== undefined) dbUpdates.price = Number(updates.price);
    if (updates.originalPrice !== undefined) dbUpdates.old_price = Number(updates.originalPrice);
    if (updates.inStock !== undefined) dbUpdates.stock = updates.inStock ? 10 : 0;
    if (updates.isFeatured !== undefined) dbUpdates.is_featured = !!updates.isFeatured;
    if (updates.categoryId !== undefined) dbUpdates.category = updates.categoryId;
    if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
    if (updates.imageResName !== undefined) dbUpdates.image_res_name = updates.imageResName;
    if (updates.likesCount !== undefined) dbUpdates.likes_count = Number(updates.likesCount);
    if (updates.heartsCount !== undefined) dbUpdates.hearts_count = Number(updates.heartsCount);

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', String(productId));

    if (error) {
      console.warn('Supabase update error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase update exception:', err);
    return { success: false, error: err };
  }
};

// Delete product from Supabase
export const deleteProductFromSupabase = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', String(productId));

    if (error) {
      console.warn('Supabase delete error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase delete exception:', err);
    return { success: false, error: err };
  }
};
