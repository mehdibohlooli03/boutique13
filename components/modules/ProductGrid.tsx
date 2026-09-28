import { PackageOpen } from "lucide-react";
import  {ProductCard , ProductCardProps } from "./ProductCard";

interface ProductGridProps {
  products: ProductCardProps[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  // ۱. حالت خالی: اگر هیچ محصولی وجود نداشت
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-400">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-1">
          محصولی یافت نشد!
        </h3>
        <p className="text-sm text-zinc-500 max-w-xs">
          در حال حاضر در این بخش کالایی برای نمایش وجود ندارد.
        </p>
      </div>
    );
  }

  // ۲. حالت نمایش شبکه محصولات
  return (
    <section className="w-full">
      {/* تیتر بخش (اختیاری) */}
      {title && (
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
        </div>
      )}

      {/* چیدمان گرید محصولات: ۲ ستون موبایل، ۳ ستون تبلت، ۴ ستون دسکتاپ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
