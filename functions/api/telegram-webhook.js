/**
 * ⚡ Cloudflare Pages Function: 24/7 Telegram Webhook to Supabase
 * Handles Telegram Bot updates perpetually on Cloudflare Edge (100% Free)
 */

const CONFIG = {
  TELEGRAM_BOT_TOKEN: '8741726555:AAFrsGEsYrDYDIzWjMZd4aQxMrz_paL3Sog',
  SUPABASE_URL: 'https://xmlesmevinugetrqtznh.supabase.co',
  SUPABASE_KEY: 'sb_publishable_aXtsifwgdWh_n9kBkvb-pQ_zC2htb3E',
  STORE_URL: 'https://shafaq-teach.github.io/Noor_Store/'
};

function parseProductText(text) {
  if (!text || typeof text !== 'string') return null;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  let name = lines[0].replace(/^[\s\*\#\-\•\—\⚡\📱\✨\🔥]+/, '').trim();
  let price = 0;
  let description = text;
  let category = 'phones';
  let brand = 'Noor';

  const priceMatches = text.match(/(?:باھاسى|باھا|price|قيمت|سعر|💵|💰|\$)\s*[:：=]?\s*[\$💵]?\s*(\d+(?:\.\d+)?)/i) 
    || text.match(/(\d+(?:\.\d+)?)\s*(?:dollar|دوللار|usd|\$|سوم)/i)
    || text.match(/\$\s*(\d+(?:\.\d+)?)/);

  if (priceMatches && priceMatches[1]) {
    price = parseFloat(priceMatches[1]);
  }

  const lower = text.toLowerCase();
  if (lower.includes('iphone') || lower.includes('apple') || lower.includes('ipad') || lower.includes('macbook')) {
    brand = 'Apple';
    category = lower.includes('ipad') ? 'ipads' : (lower.includes('mac') || lower.includes('watch') ? 'accessories' : 'phones');
  } else if (lower.includes('samsung') || lower.includes('galaxy') || lower.includes('ultra')) {
    brand = 'Samsung';
    category = 'phones';
  } else if (lower.includes('xiaomi') || lower.includes('redmi') || lower.includes('poco')) {
    brand = 'Xiaomi';
    category = 'phones';
  } else if (lower.includes('huawei') || lower.includes('honor')) {
    brand = 'Huawei';
    category = 'phones';
  }

  return {
    nameUg: name || 'يېڭى مەھسۇلات',
    nameAr: name || 'منتج جديد',
    nameEn: name || 'New Product',
    price: price || 0,
    originalPrice: price ? Math.round(price * 1.1) : 0,
    descriptionUg: description,
    descriptionAr: description,
    descriptionEn: description,
    categoryId: category,
    brand: brand,
    inStock: true,
    isFeatured: true,
    specsUg: `Marka: ${brand} | Turi: ${category}`
  };
}

async function insertProductToSupabase(productData, imageUrl) {
  try {
    const newId = Date.now();
    const row = {
      id: newId,
      name_ug: productData.nameUg,
      name_ar: productData.nameAr,
      name_en: productData.nameEn,
      description_ug: productData.descriptionUg,
      description_ar: productData.descriptionAr,
      description_en: productData.descriptionEn,
      price: productData.price,
      original_price: productData.originalPrice,
      category_id: productData.categoryId,
      brand: productData.brand,
      image_res_name: imageUrl || '/images/img_phones_1786037591338.jpg',
      image_res_name2: '',
      image_res_name3: '',
      is_featured: productData.isFeatured,
      in_stock: productData.inStock,
      specs_ug: productData.specsUg,
      likes_count: 0,
      hearts_count: 0,
      rating: 5.0
    };

    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': CONFIG.SUPABASE_KEY,
        'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify([row])
    });

    return { success: res.ok, status: res.status, product: row };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function onRequestPost(context) {
  try {
    const update = await context.request.json();
    const msg = update.message || update.channel_post || update.edited_message;

    if (!msg) return new Response('OK', { status: 200 });

    const text = msg.text || msg.caption || '';
    if (!text.trim()) return new Response('OK', { status: 200 });

    if (text.startsWith('/start')) {
      await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: msg.chat.id,
          text: `✨ *Noor Store 24/7 ئاپتوماتىك كىلودفايىر مەركىزى ئاكتىپ!*\n\nسىز يوللىغان بارلىق مەھسۇلاتلار دەرھال:\n🌐 تور بېكەتكە\n📱 دېتالغا\n💬 ۋاتساپ گۇرۇپپىسىغا تارقىتىلىدۇ!`,
          parse_mode: 'Markdown'
        })
      });
      return new Response('OK', { status: 200 });
    }

    const parsed = parseProductText(text);
    if (!parsed || !parsed.nameUg) return new Response('OK', { status: 200 });

    let imageUrl = '/images/img_phones_1786037591338.jpg';
    if (msg.photo && msg.photo.length > 0) {
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      try {
        const fileRes = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
        const fileJson = await fileRes.json();
        if (fileJson.ok && fileJson.result.file_path) {
          imageUrl = `https://api.telegram.org/file/bot${CONFIG.TELEGRAM_BOT_TOKEN}/${fileJson.result.file_path}`;
        }
      } catch (e) {}
    }

    const dbResult = await insertProductToSupabase(parsed, imageUrl);

    if (dbResult.success) {
      await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: msg.chat.id,
          text: `✅ *مەھسۇلات مۇۋەپپەقىيەتلىك تارقىتىلدى!*\n\n📱 *نامى:* ${parsed.nameUg}\n💵 *باھاسى:* $${parsed.price}\n🌐 *تور دۇكىنى:* ${CONFIG.STORE_URL}`,
          parse_mode: 'Markdown',
          reply_to_message_id: msg.message_id
        })
      });
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response('Error: ' + err.message, { status: 200 });
  }
}
