// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // این تنظیمات به Next.js می‌گوید که فایل‌های سورس ما در پوشه src قرار دارند.
  experimental: {
    // اگر قبلاً این بخش را نداشتی، با این تنظیمات اضافه کن.
    // این بخش به Next.js کمک می‌کند تا فایل‌های TSX را بهتر پردازش کند.
    // این تنظیم برای Next.js 14+ و App Router لازم است.
    // appDir: true, // اگر از App Router استفاده می‌کنید، این مورد معمولاً نیازی نیست چون پیش‌فرض است.
    // serverComponentsExternalPackages: ["mongoose"], // مثال، اگر از Mongoose استفاده می‌کردید
  },
  images: {
    // برای نمایش تصاویر در آینده (مثلاً از طریق API یا CDN)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // دامنه سایت خودتان یا سرویس‌دهنده تصاویر
      },
    ],
  },
  // اگر فونت‌ها را در پوشه public قرار داده بودی، این بخش لازم بود.
  // اما چون در src/fonts قرار دادیم، نیازی به این تنظیم نیست.
  // محتوای زیر را هم اگر داشتی، فعلا لازم نیست اضافه کنی چون با فونت local کار می‌کنیم.
  // fonts: {
  //   // This configuration is for Next.js 14+ and the App Router
  //   // For older versions or the Pages Router, you might need different configurations
  //   // or to manage fonts differently.
  //   allowedgstatic: ["https://fonts.gstatic.com"],
  //   // preload: true, // If you want to preload fonts
  // },

  // در صورت نیاز به تنظیمات بیشتر، اینجا اضافه می‌شوند
  // reactStrictMode: true, // معمولاً فعال است
};

export default nextConfig;
