// components/modules/VariantSelector.tsx
"use client";

import { useState } from "react";
import { Check, ShoppingBag, CheckCircle2 } from "lucide-react";
import { toPersianDigits } from "@/src/lib/formatters";
import { useCartStore } from "@/src/store/useCartStore";

export interface VariantItem {
  id: string;
  size: string;
  color: string;
  colorCode: string | null;
  stock: number;
}

interface VariantSelectorProps {
  productId: string;
  productName: string;
  productSlug: string;
  price: number;
  image: string;
  variants: VariantItem[];
}

export function VariantSelector({
  productId,
  productName,
  productSlug,
  price,
  image,
  variants,
}: VariantSelectorProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  // استخراج لیست رنگ‌های یکتا (Unique Colors)
  const uniqueColors = Array.from(
    new Map(
      variants.map((v) => [v.color, { color: v.color, colorCode: v.colorCode }])
    ).values()
  );

  // استخراج لیست سایزهای یکتا (Unique Sizes)
  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)));

  // استیت‌های انتخاب فعلی کاربر (پیش‌فرض اولین رنگ و سایز موجود)
  const [selectedColor, setSelectedColor] = useState<string>(
    uniqueColors[0]?.color || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    uniqueSizes[0] || ""
  );

  // پیدا کردن رکورد تنوع متناظر با رنگ و سایز انتخاب‌شده
  const currentVariant = variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const isAvailable = currentVariant ? currentVariant.stock > 0 : false;
  const currentStock = currentVariant ? currentVariant.stock : 0;

  const handleAddToCart = () => {
    if (!currentVariant || !isAvailable) return;

    // ارسال به استور Zustand
    addItem({
      id: currentVariant.id,
      productId,
      name: productName,
      slug: productSlug,
      price,
      image,
      size: currentVariant.size,
      color: currentVariant.color,
      stock: currentVariant.stock,
    });

    // نمایش وضعیت موفقیت‌آمیز برای ۱.۵ ثانیه
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  if (!variants || variants.length === 0) {
    return (
      <div className="rounded-xl bg-zinc-100 p-4 text-center text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
        تنوعی برای این محصول تعریف نشده است.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* انتخاب رنگ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            رنگ:
          </span>
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            {selectedColor}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {uniqueColors.map((item) => {
            const isSelected = selectedColor === item.color;
            return (
              <button
                key={item.color}
                type="button"
                onClick={() => setSelectedColor(item.color)}
                className={`group relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                  isSelected
                    ? "border-amber-500 ring-2 ring-amber-500/20"
                    : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
                }`}
                title={item.color}
              >
                <span
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: item.colorCode || "#999" }}
                />
                {isSelected && (
                  <Check
                    className={`absolute h-3.5 w-3.5 ${
                      item.colorCode &&
                      ["#ffffff", "#fff", "white"].includes(
                        item.colorCode.toLowerCase()
                      )
                        ? "text-zinc-900"
                        : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* انتخاب سایز */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            سایز:
          </span>
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            {selectedSize}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {uniqueSizes.map((size) => {
            const isSelected = selectedSize === size;
            // بررسی موجودی این سایز با رنگ انتخاب‌شده فعلی
            const variantForSize = variants.find(
              (v) => v.color === selectedColor && v.size === size
            );
            const hasStock = variantForSize ? variantForSize.stock > 0 : false;

            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-12 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                    : hasStock
                    ? "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700"
                    : "border-zinc-100 bg-zinc-50 text-zinc-300 line-through dark:border-zinc-800/40 dark:bg-zinc-900/40 dark:text-zinc-600"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* وضعیت موجودی */}
      <div className="text-xs">
        {isAvailable ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ موجود در انبار ({toPersianDigits(currentStock)} عدد باقی‌مانده)
          </span>
        ) : (
          <span className="text-red-500 dark:text-red-400 font-medium">
            ✕ این ترکیب رنگ و سایز ناموجود است
          </span>
        )}
      </div>

      {/* دکمه افزودن به سبد خرید */}
      <button
        type="button"
        disabled={!isAvailable}
        onClick={handleAddToCart}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all ${
          isAdded
            ? "bg-emerald-600 text-white dark:bg-emerald-600"
            : isAvailable
            ? "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.99] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
        }`}
      >
        {isAdded ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            به سبد خرید اضافه شد
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            {isAvailable ? "افزودن به سبد خرید" : "ناموجود"}
          </>
        )}
      </button>
    </div>
  );
}
