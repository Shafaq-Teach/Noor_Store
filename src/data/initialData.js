export const initialCategories = [
  { id: "phones", nameUg: "تىلىپۇنلار", nameAr: "الهواتف", nameEn: "Smartphones", icon: "Smartphone" },
  { id: "tablets", nameUg: "پەدلەر", nameAr: "الأجهزة اللوحية", nameEn: "Tablets / iPads", icon: "Tablet" },
  { id: "accessories", nameUg: "زاپچاسلار", nameAr: "الملحقات", nameEn: "Accessories", icon: "Headphones" },
  { id: "watches", nameUg: "ئەقلىي سائەتلەر", nameAr: "الساعات الذكية", nameEn: "Smart Watches", icon: "Watch" }
];

export const initialProducts = [
  {
    id: 1,
    nameUg: "S23 ultira",
    nameAr: "سامسونج S23 الترا",
    nameEn: "Samsung Galaxy S23 Ultra",
    descriptionUg: "⌨️رام: 12\n⌨️ئىچىكى ساقلغۇچ : 512\n📸كامېرا : 200م،پ.\n⚙️ئاندرويىد: 14\n🔋باتارېيە: 5000\nباھاسى : 💵485",
    descriptionAr: "رام: 12 | ذاكرة: 512 | كاميرا: 200 ميجابكسل | بطارية: 5000",
    descriptionEn: "RAM: 12GB | Storage: 512GB | Camera: 200MP | Battery: 5000mAh",
    price: 485.0,
    originalPrice: 534.0,
    categoryId: "phones",
    brand: "Samsung",
    imageResName: "/images/img_phones_1786037591338.jpg",
    imageResName2: "",
    imageResName3: "",
    isFeatured: true,
    inStock: true,
    specsUg: "RAM: 12GB | سىغىمى: 512GB | كامېرا: 200MP | باتارېيە: 5000mAh",
    specsAr: "RAM: 12GB | سعة: 512GB | كاميرا: 200MP | بطارية: 5000mAh",
    specsEn: "RAM: 12GB | Storage: 512GB | Camera: 200MP | Battery: 5000mAh",
    likesCount: 12,
    heartsCount: 5
  }
];

export const initialCoupons = [
  { id: 1, code: "NOOR10", discountPercent: 10, discountAmount: 0, isActive: true },
  { id: 2, code: "WELCOME", discountPercent: 15, discountAmount: 0, isActive: true }
];

export const initialReviews = [
  {
    id: 1,
    productId: 1,
    userName: "مەمتىمىن",
    rating: 5,
    comment: "مەھسۇلاتنىڭ سۈپىتى ئىنتايىن ياخشى ئىكەن، يەتكۈزۈش بەك تېز بولدى!",
    adminReply: "رەھمەت، سىزگە يېقىشلىق بولغاي!",
    timestamp: Date.now() - 86400000
  }
];

export const initialNasheedTracks = [];

