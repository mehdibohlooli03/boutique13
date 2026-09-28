import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/modules/Header";
import { cn } from "@/lib/utils";

// فقط فونت محلی وزیرمتن - بدون هیچ فونت گوگل
const vazirmatn = localFont({
  src: [
    {
      path: "../fonts/vazirmatn/Vazirmatn-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/vazirmatn/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/vazirmatn/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/vazirmatn/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بوتیک ۱۳ | فروشگاه پوشاک مردانه",
  description: "بوتیک ۱۳ - خاص‌ترین استایل و پوشاک مردانه با بهترین کیفیت",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={cn("dark", "font-sans", vazirmatn.variable)}>
      <body className="font-sans bg-zinc-950 text-zinc-100 min-h-screen antialiased">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
