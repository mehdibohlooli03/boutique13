"use client";
// src/components/modules/CartSheet.tsx

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCartStore } from "@/src/store/useCartStore";
import { formatPrice, toPersianDigits } from "@/src/lib/formatters";

// هوک ایمن برای جلوگیری از Hydration Mismatch
const emptySubscribe = () => () => {};
function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function CartSheet() {
  const isMounted = useHasMounted();
  const [isOpen, setIsOpen] = useState(false);

  // استخراج متغیرها و اکشن‌ها از Zustand Store
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // محاسبه مستقیم مجموع تعداد و قیمت اقلام
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // رندر دکمه ساده در زمان SSR تا صفحه لود شود
  if (!isMounted) {
    return (
      <button
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
        aria-label="سبد خرید"
      >
        <ShoppingBag className="h-5 w-5" />
      </button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* دکمه تریگر در هدر */}
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="سبد خرید"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white shadow-sm">
              {toPersianDigits(totalItemsCount)}
            </span>
          )}
        </button>
      </SheetTrigger>

      {/* محتوای کشویی */}
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-zinc-100 pb-4 text-right dark:border-zinc-800">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <ShoppingBag className="h-5 w-5 text-amber-600" />
            سبد خرید شما ({toPersianDigits(totalItemsCount)} کالا)
          </SheetTitle>
        </SheetHeader>

        {/* لیست کالاها یا وضعیت خالی بودن */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                سبد خرید شما خالی است!
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                محصولات مورد علاقه خود را به سبد خرید اضافه کنید.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 divide-y divide-zinc-100 overflow-y-auto px-1 py-2 dark:divide-zinc-800">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.color}-${item.size}`}
                className="flex items-start gap-4 py-4"
              >
                {/* تصویر کوچک محصول */}
                <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                {/* اطلاعات محصول */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="line-clamp-1 text-sm font-semibold text-zinc-800 hover:text-amber-600 dark:text-zinc-200 dark:hover:text-amber-400"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <span>رنگ: {item.color}</span>
                      <span>•</span>
                      <span>سایز: {item.size}</span>
                    </div>
                  </div>

                  {/* قیمت و دکمه‌های کنترل تعداد */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="flex h-5 w-5 items-center justify-center rounded text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <Plus className="h-3 w-3" />
                      </button>

                      <span className="w-5 text-center text-xs font-semibold">
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
                        className="flex h-5 w-5 items-center justify-center rounded text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="h-3 w-3 text-red-500" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* فوتر: جمع کل و دکمه تسویه‌حساب */}
        {items.length > 0 && (
          <SheetFooter className="mt-auto border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  مبلغ قابل پرداخت:
                </span>
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white transition hover:bg-amber-600 active:scale-[0.99]"
                >
                  تکمیل سفارش و تسویه‌حساب
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
