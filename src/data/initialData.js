export const initialCategories = [
  { id: "phones", nameUg: "تىلىپۇنلار", nameAr: "الهواتف", nameEn: "Smartphones", icon: "Smartphone" },
  { id: "tablets", nameUg: "پەدلەر", nameAr: "الأجهزة اللوحية", nameEn: "Tablets / iPads", icon: "Tablet" },
  { id: "accessories", nameUg: "زاپچاسلار", nameAr: "الملحقات", nameEn: "Accessories", icon: "Headphones" },
  { id: "watches", nameUg: "ئەقلىي سائەتلەر", nameAr: "الساعات الذكية", nameEn: "Smart Watches", icon: "Watch" }
];

export const initialProducts = [
  {
    id: 1,
    nameUg: "iPhone 16 Pro Max (512GB)",
    nameAr: "آيفون 16 برو ماكس (512 جيجابايت)",
    nameEn: "iPhone 16 Pro Max (512GB)",
    descriptionUg: "ئەڭ يېڭى A18 Pro چىپ، 48MP كوئاد پىكسېل كامېرا، تىتان گەۋدە. ئالىي دەرىجىلىك كۆزنەك.",
    descriptionAr: "أحدث شريحة A18 Pro، كاميرا 48 ميجابكسل، جسم من التيتانيوم. شاشة ممتازة.",
    descriptionEn: "Latest A18 Pro Chip, 48MP Quad Pixel Camera, Titanium body, Super Retina XDR.",
    price: 9999.0,
    originalPrice: 10499.0,
    categoryId: "phones",
    brand: "Apple",
    imageResName: "/images/img_phones_1786037591338.jpg",
    imageResName2: "/images/img_hero_banner_1786037578646.jpg",
    imageResName3: "/images/img_app_icon_1786037564036.jpg",
    isFeatured: true,
    inStock: true,
    specsUg: "RAM: 8GB | ساقلاش: 512GB | باتارېيە: 4685mAh",
    specsAr: "الرام: 8 جيجابايت | التخزين: 512 جيجابايت | البطارية: 4685 مللي أمبير",
    specsEn: "RAM: 8GB | Storage: 512GB | Battery: 4685mAh",
    likesCount: 48,
    heartsCount: 23
  },
  {
    id: 2,
    nameUg: "Samsung Galaxy S25 Ultra (1TB)",
    nameAr: "سامسونج جالاكسي S25 أولترا (1 تيرابايت)",
    nameEn: "Samsung Galaxy S25 Ultra (1TB)",
    descriptionUg: "Snapdragon 8 Elite چىپ، 200MP زووم كامېرا، S-Pen قەلەم، titanium ئالىي كورپۇس.",
    descriptionAr: "معالج Snapdragon 8 Elite، كاميرا 200 ميجابكسل مع تقريب، قلم S-Pen الذكي.",
    descriptionEn: "Snapdragon 8 Elite, 200MP Zoom Camera, Built-in S-Pen stylus, titanium body.",
    price: 9599.0,
    originalPrice: 9999.0,
    categoryId: "phones",
    brand: "Samsung",
    imageResName: "/images/img_phones_1786037591338.jpg",
    imageResName2: "/images/img_hero_banner_1786037578646.jpg",
    imageResName3: "",
    isFeatured: true,
    inStock: true,
    specsUg: "RAM: 16GB | ساقلاش: 1TB | ئېكران: 6.8 بوصە AMOLED 120Hz",
    specsAr: "الرام: 16 جيجابايت | التخزين: 1 تيرابايت | الشاشة: 6.8 بوصة AMOLED 120Hz",
    specsEn: "RAM: 16GB | Storage: 1TB | Screen: 6.8 inch Dynamic AMOLED 2X",
    likesCount: 36,
    heartsCount: 15
  },
  {
    id: 3,
    nameUg: "iPad Pro 13-inch M4 (Cellular)",
    nameAr: "آيباد برو 13 بوصة M4 (شريحة)",
    nameEn: "iPad Pro 13-inch M4 (Cellular)",
    descriptionUg: "ئالما M4 چىپ، Tandem OLED ئېكران، ئىنتايىن نېپىز 5.1mm گەۋدە، Pencil Pro ماس كېلىدۇ.",
    descriptionAr: "شريحة Apple M4، شاشة Tandem OLED الفائقة، تصميم نحيف للغاية 5.1 ملم.",
    descriptionEn: "Apple M4 Chip, Tandem OLED Display, Ultra thin 5.1mm design, Apple Pencil Pro support.",
    price: 8999.0,
    originalPrice: 9399.0,
    categoryId: "tablets",
    brand: "Apple",
    imageResName: "/images/img_tablets_1786037603482.jpg",
    imageResName2: "/images/img_hero_banner_1786037578646.jpg",
    imageResName3: "",
    isFeatured: true,
    inStock: true,
    specsUg: "چىپ: M4 | ساقلاش: 256GB | ئېكران: 13 بوصە Ultra Retina XDR",
    specsAr: "المعالج: M4 | التخزين: 256 جيجابايت | الشاشة: 13 بوصة Ultra Retina",
    specsEn: "Chip: M4 | Storage: 256GB | Display: 13-inch Ultra Retina XDR",
    likesCount: 29,
    heartsCount: 14
  },
  {
    id: 4,
    nameUg: "Xiaomi Pad 7 Pro 12.4",
    nameAr: "شاومي باد 7 برو 12.4",
    nameEn: "Xiaomi Pad 7 Pro 12.4",
    descriptionUg: "Snapdragon 8s Gen 3، 144Hz 3.2K ئېكران، 10000mAh باتارېيە ۋە 67W تېز قۇۋۋەتلىگۈچ.",
    descriptionAr: "معالج Snapdragon 8s Gen 3، شاشة 3.2K بسرعة 144Hz، بطارية 10000mAh مع شاحن 67W.",
    descriptionEn: "Snapdragon 8s Gen 3, 144Hz 3.2K Display, 10000mAh Battery with 67W Fast Charging.",
    price: 2899.0,
    originalPrice: 3199.0,
    categoryId: "tablets",
    brand: "Xiaomi",
    imageResName: "/images/img_tablets_1786037603482.jpg",
    imageResName2: "",
    imageResName3: "",
    isFeatured: false,
    inStock: true,
    specsUg: "RAM: 12GB | ساقلاش: 256GB | قۇۋۋەتلەش: 67W Fast Charge",
    specsAr: "الرام: 12 جيجابايت | التخزين: 256 جيجابايت | الشحن: 67 واط",
    specsEn: "RAM: 12GB | Storage: 256GB | Charging: 67W Turbo",
    likesCount: 19,
    heartsCount: 8
  },
  {
    id: 5,
    nameUg: "Anker 100W GaN 3-Port Fast Charger",
    nameAr: "شاحن أنكر السريع 100 واط GaN 3 منافذ",
    nameEn: "Anker 100W GaN 3-Port Fast Charger",
    descriptionUg: "تېز قۇۋۋەتلىگۈچ، تېلېفون ۋە پەدلەرنى ئوخشاش ۋاقىتتا يۇقىرى سۈرئەتتە توكلاش ئىقتىدارى.",
    descriptionAr: "شاحن سريع وعالي الجودة للهواتف والأجهزة اللوحية بقدرة 100 واط مع تقنية GaN.",
    descriptionEn: "High speed 100W GaN Charger for laptops, tablets, and flagship smartphones.",
    price: 299.0,
    originalPrice: 350.0,
    categoryId: "accessories",
    brand: "Anker",
    imageResName: "/images/img_hero_banner_1786037578646.jpg",
    imageResName2: "",
    imageResName3: "",
    isFeatured: false,
    inStock: true,
    specsUg: "قۇۋۋەت: 100W | USB-C x2 + USB-A | GaN III",
    specsAr: "الطاقة: 100 واط | USB-C عدد 2 + USB-A | تقنية GaN",
    specsEn: "Output: 100W | Ports: 2x USB-C + 1x USB-A | GaN Fast",
    likesCount: 42,
    heartsCount: 17
  },
  {
    id: 6,
    nameUg: "Apple Watch Ultra 2 Titanium",
    nameAr: "ساعة آبل ألترا 2 تيتانيوم",
    nameEn: "Apple Watch Ultra 2 Titanium",
    descriptionUg: "S9 SiP چىپ، 3000 nits يورۇق ئېكران، GPS تېز سېزىم، سۇدىن قوغداش ۋە تەنتەربىيە ئىقتىدارى.",
    descriptionAr: "شريحة S9 SiP، شاشة براقة 3000 شمعة، مقاومة للماء والرياضات القاسية.",
    descriptionEn: "S9 SiP Chip, 3000 nits bright display, dual-frequency GPS, extreme sports watch.",
    price: 5999.0,
    originalPrice: 6299.0,
    categoryId: "watches",
    brand: "Apple",
    imageResName: "/images/img_app_icon_1786037564036.jpg",
    imageResName2: "/images/img_hero_banner_1786037578646.jpg",
    imageResName3: "",
    isFeatured: true,
    inStock: true,
    specsUg: "گەۋدە: 49mm Titanium | باتارېيە: 36 سائەت | GPS + Cellular",
    specsAr: "الهيكل: 49 ملم تيتانيوم | البطارية: 36 ساعة | GPS + شريحة",
    specsEn: "Case: 49mm Titanium | Battery: 36h | GPS + Cellular",
    likesCount: 55,
    heartsCount: 31
  }
];

export const initialCoupons = [
  {
    code: "NOOR10",
    discountPercent: 10.0,
    discountAmount: 0.0,
    minSpend: 0.0,
    descUg: "بارلىق ماللارغا 10% ئېتىبار",
    descAr: "خصم 10% على كل السلة",
    descEn: "10% Off All Orders"
  },
  {
    code: "YENGILIK",
    discountPercent: 0.0,
    discountAmount: 100.0,
    minSpend: 1000.0,
    descUg: "1000 يۈەندىن ئاشسا 100 يۈەن كېمەيتىش",
    descAr: "خصم 100¥ للطلبات فوق 1000¥",
    descEn: "¥100 Off for orders over ¥1000"
  },
  {
    code: "VIP2026",
    discountPercent: 0.0,
    discountAmount: 200.0,
    minSpend: 2000.0,
    descUg: "2000 يۈەندىن ئاشسا 200 يۈەن كېمەيتىش",
    descAr: "خصم 200¥ للطلبات فوق 2000¥",
    descEn: "¥200 Off for orders over ¥2000"
  },
  {
    code: "TEZLIK",
    discountPercent: 0.0,
    discountAmount: 50.0,
    minSpend: 500.0,
    descUg: "500 يۈەندىن ئاشسا 50 يۈەن كېمەيتىش + تېز يەتكۈزۈش",
    descAr: "خصم 50¥ + توصيل سريع",
    descEn: "¥50 Off + Express Delivery"
  }
];

export const initialReviews = [
  {
    id: 1,
    productId: 1,
    userName: "ئالىم",
    comment: "تېلېفون ئىنتايىن سۈزۈك چىقتى، كامېراسى رەسىمگە دەرىجىدىن تاشقىرى سۈزۈك ئالىدىكەن. يەتكۈزۈش سۈرئىتى بەك تېز بولدى!",
    adminReply: "قەدىرلىك خېرىدارىمىز، رازى بولغىنىڭىزدىن سۆيۈندۇق! نۇرلۇق دۇكىنىمىزنى تاللىغىنىڭىزغا رەھمەت.",
    timestamp: Date.now() - 86400000 * 2
  },
  {
    id: 2,
    productId: 3,
    userName: "مۇھەممەد",
    comment: "iPad M4 نىڭ رەڭگى ۋە ئېكرانى بەك سۈپەتلىك، دەرس ئوقۇشقا بەك ئەپچىل بولدى.",
    adminReply: "ئىشلىرىڭىزغا ئۇتۇق تىلەيمىز!",
    timestamp: Date.now() - 86400000
  }
];

export const initialNasheedTracks = [
  {
    id: "1",
    titleUg: "كۆك بايراق",
    titleAr: "الراية الزرقاء",
    titleEn: "Kok Bayraq (Blue Flag)",
    audioSrc: "/audio/كۆك بايراق.mp3",
    duration: "4:32"
  },
  {
    id: "2",
    titleUg: "بالىلىقنى سېغىندىم",
    titleAr: "اشتقت لطفولتي",
    titleEn: "Missing Childhood",
    audioSrc: "/audio/بالىلىقنى  سېغىندىم  54586.mp3",
    duration: "2:50"
  },
  {
    id: "3",
    titleUg: "نەشىد 1 (گۈزەل تىلاۋەت ۋە مەدھىيە)",
    titleAr: "أنشودة 1",
    titleEn: "Nasheed 1",
    audioSrc: "/audio/AUD-20230324-WA0008.mp3",
    duration: "5:15"
  },
  {
    id: "4",
    titleUg: "نەشىد 2 (تەسىرلىك نەشىد)",
    titleAr: "أنشودة 2",
    titleEn: "Nasheed 2",
    audioSrc: "/audio/AUD-20251226-WA0068.mp3",
    duration: "3:40"
  }
];
