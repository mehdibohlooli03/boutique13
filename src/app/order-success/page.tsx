import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { Button } from "@/components/ui/button";

interface OrderSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  // ۱. دریافت نشست کاربری جاری
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // ۲. استخراج شناسه سفارش از query string (در Next.js 15 و 16 searchParams یک Promise است)
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams.orderId;

  if (!orderId) {
    notFound();
  }

  // ۳. واکشی اطلاعات سفارش همراه با آدرس و محصولات از دیتابیس
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      address: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  // اگر سفارشی پیدا نشد یا سفارش متعلق به کاربر جاری نبود، صفحه ۴۰۴ نشان داده شود
  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12" dir="rtl">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
        
        {/* آیکون و پیام تبریک ثبت سفارش */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            سفارش شما با موفقیت ثبت شد!
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            شماره پیگیری سفارش: <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{order.id}</span>
          </p>
        </div>

        {/* مشخصات گیرنده و نشانی تحویل */}
        <div className="mt-8 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/50">
          <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            اطلاعات تحویل سفارش
          </h2>
          <div className="mt-3 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
            <p>
              <span className="font-medium text-neutral-500">تحویل‌گیرنده:</span> {order.address?.recipient}
            </p>
            <p>
              <span className="font-medium text-neutral-500">شماره تماس:</span> {order.address?.phone}
            </p>
            <p>
              <span className="font-medium text-neutral-500">آدرس:</span> {order.address?.city}، {order.address?.street}
            </p>
            {order.address?.postalCode && (
              <p>
                <span className="font-medium text-neutral-500">کد پستی:</span> {order.address.postalCode}
              </p>
            )}
          </div>
        </div>

        {/* لیست اقلام ثبت‌شده در سفارش */}
        <div className="mt-6 border-t border-neutral-100 pt-6 dark:border-neutral-800">
          <h2 className="mb-4 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            اقلام خریداری‌شده
          </h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {item.variant.product.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    سایز: {item.variant.size} | رنگ: {item.variant.color} | تعداد: {item.quantity} عدد
                  </p>
                </div>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {(item.unitPrice * item.quantity).toLocaleString("fa-IR")} تومان
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* مبلغ نهایی فاکتور */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
          <span className="font-bold text-neutral-900 dark:text-neutral-100">
            مبلغ کل پرداختی
          </span>
          <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {order.totalAmount.toLocaleString("fa-IR")} تومان
          </span>
        </div>

        {/* دکمه‌های ناوبری */}
        <div className="mt-8 flex gap-3">
          <Button asChild className="w-full">
            <Link href="/">بازگشت به صفحه اصلی فروشگاه</Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
