"use client";
// src/app/cart/page.tsx

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  ArrowRight,
  Ticket,
} from "lucide-react";

import { useCartStore } from "@/src/store/useCartStore";
import { formatPrice, toPersianDigits } from "@/src/lib/formatters";

// سقف خرید برای ارسال رایگان (مثال: ۱ میلیون تومان)
const FREE_SHIPPING_THRESHOLD = 1000000;
const SHIPPING_COST = 65000;

// هوک کلاینتی برای جلوگیری از هیدریشن میسمچ (Hydration Mismatch)
const emptySubscribe = () => () => {};
function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function CartPage() {
  const isMounted = useHasMounted();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  // محاسبات مالی
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = items.length === 0 || isFreeShipping ? 0 : SHIPPING_COST;
  const finalPrice = subtotal + shippingFee;

  // در مرحله لود اولیه برای جلوگیری از پرش تصویر
  if (!isMounted) {
    return (
      <main className="container mx-auto min-h-[60vh] px-4 py-16">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      </main>
    );
  }

  // حالت سبد خرید خالی
  if (items.length === 0) {
    return (
      <main className="container mx-auto min-h-[70vh] px-4 py-16">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
            <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
          </div>
          <h1 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            سبد خرید شما خالی است!
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            هنوز هیچ لباسی به سبد خرید خود اضافه نکرده‌اید.
          </p>
          <Link
            href="/products"
            className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
          >
            مشاهده محصولات بوتیک
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-[75vh] px-4 py-8">
      {/* هدر صفحه */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            سبد خرید شما
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            شامل {toPersianDigits(totalCount)} قلم کالا
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs text-red-500 transition hover:text-red-600 dark:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
          پاک کردن کل سبد خرید
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* ستون اقلام سبد خرید */}
        <section className="space-y-4 lg:col-span-8">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.color}-${item.size}`}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition sm:flex-row sm:items-center sm:gap-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* تصویر محصول */}
              <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </div>

              {/* مشخصات محصول */}
              <div className="flex flex-1 flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-bold text-zinc-800 hover:text-amber-600 dark:text-zinc-200 dark:hover:text-amber-400"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-zinc-400 transition hover:text-red-500 dark:text-zinc-500"
                    title="حذف از سبد"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* ویژگی‌ها: رنگ و سایز */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1">
                    <span>رنگ:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {item.color}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span>سایز:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {item.size}
                    </span>
                  </div>
                </div>

                {/* ردیف پایین: قیمت واحد و تغییر تعداد */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">قیمت واحد:</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  {/* کنترلر تعداد */}
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-100 disabled:opacity-40 dark:bg-zinc-700 dark:text-zinc-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>

                    <span className="w-6 text-center text-sm font-bold">
                      {toPersianDigits(item.quantity)}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeItem(item.id);
                        } else {
                          updateQuantity(item.id, item.quantity - 1);
                        }
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-200"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      ) : (
                        <Minus className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-400"
            >
              <ArrowRight className="h-4 w-4" />
              ادامه خرید از فروشگاه
            </Link>
          </div>
        </section>

        {/* ستون خلاصه سفارش و فاکتور */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="border-b border-zinc-100 pb-3 text-base font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
              خلاصه سفارش
            </h2>
            {/* بخش کد تخفیف */}
            <div className="space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <Ticket className="h-4 w-4 text-amber-500" />
                کد تخفیف دارید؟
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثلاً: OFF13"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-amber-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-amber-400"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                >
                  اعمال
                </button>
              </div>
            </div>

            {/* نوار وضعیت ارسال رایگان */}
            <div className="rounded-xl bg-amber-50 p-3 text-xs dark:bg-amber-950/40">
              {isFreeShipping ? (
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <Truck className="h-4 w-4 shrink-0" />
                  <span>تبریک! ارسال سفارش شما **رایگان** است.</span>
                </div>
              ) : (
                <div className="text-amber-800 dark:text-amber-300">
                  با خرید{" "}
                  <span className="font-bold">
                    {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                  </span>{" "}
                  تومان دیگر، ارسال سفارش شما رایگان خواهد شد.
                </div>
              )}
            </div>

            {/* جزئیات قیمت‌ها */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>جمع اقلام:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>هزینه ارسال:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      رایگان
                    </span>
                  ) : (
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(shippingFee)}
                    </span>
                  )}
                </span>
              </div>

              <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <div className="flex items-center justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
                  <span>مبلغ کل پرداختی:</span>
                  <span className="text-lg text-amber-600 dark:text-amber-400">
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* دکمه اقدام تسویه‌حساب */}
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-amber-600 active:scale-[0.99]"
            >
              ثبت سفارش و ادامه خرید
              <ArrowLeft className="h-4 w-4" />
            </Link>

            {/* پیام تضمین اصالت و ضمانت */}
            <div className="flex items-center justify-center gap-2 border-t border-zinc-100 pt-3 text-[11px] text-zinc-400 dark:border-zinc-800">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>ضمانت اصالت و سلامت فیزیکی کالا</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
