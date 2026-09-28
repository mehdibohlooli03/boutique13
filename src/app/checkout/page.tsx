import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  // ۱. احراز هویت: اگر کاربر لاگین نیست، هدایت به صفحه لاگین
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  // ۲. استخراج شماره موبایل برای نمایش در فرم
  // چون تایپ session ممکن است اختصاصی باشد، از any استفاده می‌کنیم یا cast می‌کنیم
  const phone = (session.user as any).phone || "شماره ثبت نشده";

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">نهایی‌کردن سفارش</h1>
        
        {/* فرم کامپوننت که قبلاً ساختی */}
        <CheckoutForm userPhone={phone} />
      </div>
    </main>
  );
}
