import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 شروع بذرپاشی داده‌های اولیه بوتیک ۱۳...");

  // ۱. پاک‌سازی داده‌های قبلی برای جلوگیری از خطای تکراری
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ۲. ایجاد دسته‌بندی‌های اصلی پوشاک
  const menCategory = await prisma.category.create({
    data: {
      name: "پوشاک مردانه",
      slug: "men-clothing",
    },
  });

  const womenCategory = await prisma.category.create({
    data: {
      name: "پوشاک زنانه",
      slug: "women-clothing",
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: "اکسسوری",
      slug: "accessories",
    },
  });

  // ۳. ایجاد محصولات همراه با تصاویر و متغیرها (سایز و رنگ)
  const productsData = [
    {
      name: "کت چرم طبیعی کلاسیک مردانه",
      slug: "mens-classic-leather-jacket",
      description: "کت چرم دست‌دوز تهیه شده از مرغوب‌ترین چرم طبیعی با آستر گرم و دوخت باکیفیت.",
      price: 3450000,
      ratingAvg: 4.8,
      ratingCount: 14,
      categoryId: menCategory.id,
      images: [
        {
          url: "https://akomod.com/wp-content/uploads/2026/09/IMG_7103_7_11zon.webp",
          isPrimary: true,
        },
      ],
      variants: [
        { size: "L", color: "مشکی", colorCode: "#000000", stock: 5 },
        { size: "XL", color: "مشکی", colorCode: "#000000", stock: 3 },
        { size: "L", color: "قهوه‌ای", colorCode: "#8B4513", stock: 4 },
      ],
    },
    {
      name: "هودی اورسایز نخ‌پنبه مینیمال",
      slug: "minimal-oversized-cotton-hoodie",
      description: "هودی پاییزه دوخته شده از نخ پنبه ۱۰۰٪ ارگانیک با طراحی مدرن و پارچه ضخیم توکرکی.",
      price: 980000,
      ratingAvg: 4.6,
      ratingCount: 22,
      categoryId: menCategory.id,
      images: [
        {
          url: "https://slashtak.ir/wp-content/uploads/2026/09/2308-1.jpg",
          isPrimary: true,
        },
      ],
      variants: [
        { size: "M", color: "طوسی", colorCode: "#808080", stock: 12 },
        { size: "L", color: "طوسی", colorCode: "#808080", stock: 8 },
        { size: "L", color: "کرم", colorCode: "#F5F5DC", stock: 6 },
      ],
    },
    {
      name: "مانتو لینن خنک تابستانه",
      slug: "summer-linen-casual-coat",
      description: "مانتو سبک و فوق‌العاده راحت از پارچه لینن شسته شده با تن‌خور بسیار شیک و آزاد.",
      price: 1250000,
      ratingAvg: 4.9,
      ratingCount: 31,
      categoryId: womenCategory.id,
      images: [
        {
          url: "https://www.mrmanto.ir/wp-content/uploads/2024/06/photo_2024-06-20_15-39-16-4.jpg",
          isPrimary: true,
        },
      ],
      variants: [
        { size: "Free Size", color: "نسکافه‌ای", colorCode: "#D2B48C", stock: 15 },
        { size: "Free Size", color: "سفید", colorCode: "#FFFFFF", stock: 10 },
      ],
    },
    {
      name: "پیراهن ماکسی فلورال مجلسی",
      slug: "floral-maxi-evening-dress",
      description: "پیراهن ماکسی بلند با طرح گل‌های ریز، آستین‌های کلوش و پارچه‌ای لخت و جذاب.",
      price: 1890000,
      ratingAvg: 4.7,
      ratingCount: 18,
      categoryId: womenCategory.id,
      images: [
        {
          url: "https://files.emalls.ir/files/Products/automatic/11641935/tzdzha0t.jpg",
          isPrimary: true,
        },
      ],
      variants: [
        { size: "38", color: "سبز کله‌غازی", colorCode: "#004D40", stock: 4 },
        { size: "40", color: "سبز کله‌غازی", colorCode: "#004D40", stock: 6 },
        { size: "42", color: "مشکی", colorCode: "#000000", stock: 2 },
      ],
    },
    {
      name: "عینک آفتابی فریم استیل کلاسیک",
      slug: "classic-steel-frame-sunglasses",
      description: "عینک آفتابی با لنز UV400 پولاریزه و فریم استیل سبک و مقاوم در برابر ضربه.",
      price: 690000,
      ratingAvg: 4.5,
      ratingCount: 9,
      categoryId: accessoriesCategory.id,
      images: [
        {
          url: "https://www.irantimer.com/Images/Style_v2/mag.png",
          isPrimary: true,
        },
      ],
      variants: [
        { size: "Standard", color: "طلایی/دودی", colorCode: "#DAA520", stock: 20 },
        { size: "Standard", color: "نقره‌ای/سبز", colorCode: "#C0C0C0", stock: 15 },
      ],
    },
    {
      name: "کلاه باکت کتان دورو",
      slug: "double-sided-cotton-bucket-hat",
      description: "کلاه باکت ترند و استریت استایل با دو روی متفاوت و پارچه کتان ضدتعریق.",
      price: 340000,
      ratingAvg: 4.4,
      ratingCount: 12,
      categoryId: accessoriesCategory.id,
      images: [
        {
          url: "https://nanishop.ir/wp-content/uploads/2023/05/b1.jpg",
          isPrimary: true,
        },
      ],
      variants: [
        { size: "Free Size", color: "مشکی/کرم", colorCode: "#000000", stock: 25 },
      ],
    },
  ];

  for (const item of productsData) {
    const { images, variants, ...productInfo } = item;

    await prisma.product.create({
      data: {
        ...productInfo,
        images: {
          create: images,
        },
        variants: {
          create: variants,
        },
      },
    });
  }

  console.log("✅ دیتابیس با موفقیت با داده‌های تستی بوتیک ۱۳ پر شد!");
}

main()
  .catch((e) => {
    console.error("❌ خطا در اجرای اسکریپت Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
