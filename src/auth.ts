import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Phone",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
      },
      async authorize(credentials) {
        const rawPhone = credentials?.phone as string | undefined;

        if (!rawPhone) {
          throw new Error("لطفاً شماره موبایل را وارد کنید.");
        }

        // تمیزکاری شماره: تبدیل اعداد فارسی/عربی به انگلیسی و حذف فاصله‌ها
        const cleanPhone = rawPhone
          .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
          .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
          .replace(/\s+/g, "")
          .trim();

        // اعتبارسنجی اولیه ساختار موبایل ایران (۱۱ رقم با شروع ۰۹)
        const phoneRegex = /^09\d{9}$/;
        if (!phoneRegex.test(cleanPhone)) {
          throw new Error("شماره موبایل وارد شده معتبر نیست (مثال: 09123456789)");
        }

        // ۱. جستجوی کاربر در دیتابیس
        let user = await prisma.user.findUnique({
          where: { phone: cleanPhone },
        });

        // ۲. اگر کاربر وجود نداشت، خودکار ثبت‌نام می‌شود (MVP فلو)
        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: cleanPhone,
              role: "USER",
            },
          });
        }

        // ۳. بازگرداندن کاربر برای ذخیره در Session
        return {
          id: user.id,
          name: user.name || user.phone,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // افزودن مشخصات اختصاصی کاربر (مثل id و phone و role) به توکن
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone;
        token.role = (user as any).role;
      }
      return token;
    },
    // افزودن فیلدها از توکن به شیء Session کلاینت
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).phone = token.phone as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // مسیر صفحه ورود دلخواه ما
  },
  session: {
    strategy: "jwt",
  },
});
