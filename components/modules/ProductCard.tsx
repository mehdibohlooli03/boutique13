// components/modules/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { formatPrice, toPersianDigits } from "@/src/lib/formatters";

// تعریف تایپ اطلاعات ورودی کارت محصول
export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  imageUrl?: string | null;
  categoryName?: string;
  ratingAvg?: number;
  ratingCount?: number;
}

export function ProductCard({
  name,
  slug,
  price,
  imageUrl,
  categoryName,
  ratingAvg = 0,
  ratingCount = 0,
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      {/* بخش تصویر محصول */}
      <Link
        href={`/products/${slug}`}
        className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
            بدون تصویر
          </div>
        )}

        {/* برچسب دسته‌بندی */}
        {categoryName && (
          <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            {categoryName}
          </span>
        )}

        {/* دکمه لایک / علاقه‌مندی */}
        <button
          aria-label="افزودن به علاقه‌مندی‌ها"
          className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zinc-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-red-500 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      {/* بخش مشخصات و قیمت */}
      <div className="flex flex-1 flex-col p-4">
        {/* امتیاز */}
        <div className="mb-1.5 flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {toPersianDigits(ratingAvg.toFixed(1))}
          </span>
          {ratingCount > 0 && (
            <span className="text-[11px] text-zinc-400">
              ({toPersianDigits(ratingCount)})
            </span>
          )}
        </div>

        {/* عنوان محصول */}
        <Link
          href={`/products/${slug}`}
          className="line-clamp-1 font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
        >
          {name}
        </Link>

        {/* قیمت در پایین کارت */}
        <div className="mt-auto pt-3">
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </div>
  );
}

