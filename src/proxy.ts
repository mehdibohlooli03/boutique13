import { auth } from "@/src/auth";
import { NextResponse } from "next/server";

// در قرارداد جدید Next.js 16، تابع پروکسی جایگزین میدل‌ویر شده است
const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // لیست مسیرهایی که نیاز به احراز هویت دارند
  const isCheckoutRoute = nextUrl.pathname.startsWith("/checkout");

  if (isCheckoutRoute && !isLoggedIn) {
    // کاربر لاگین‌نشده به لاگین هدایت می‌شود و آدرس فعلی ذخیره می‌گردد
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl)
    );
  }

  return NextResponse.next();
});

export default proxy;

// تنظیمات matcher برای جلوگیری از اجرای بیهوده روی فایل‌های استاتیک و آیکون‌ها
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
