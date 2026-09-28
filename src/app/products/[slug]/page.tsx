// src/app/products/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/src/services/product.service";
import { formatPrice, toPersianDigits } from "@/src/lib/formatters";
import { VariantSelector } from "@/components/modules/VariantSelector";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    null;

  return (
    <main dir="rtl" className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb ساده */}
        <nav className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          <span>خانه</span>
          <span className="px-2">/</span>
          {product.category ? (
            <>
              <span>{product.category.name}</span>
              <span className="px-2">/</span>
            </>
          ) : null}
          <span className="text-zinc-900 dark:text-zinc-50">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* تصاویر */}
          <section className="space-y-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
                  تصویری برای این محصول ثبت نشده
                </div>
              )}
            </div>

            {/* گالری تصاویر */}
            {product.images.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 8).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900"
                  >
                    <Image
                      src={img.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 12vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {/* اطلاعات محصول و انتخابگر */}
          <section className="space-y-6">
            <header className="space-y-3">
              {product.category ? (
                <p className="text-sm font-medium text-amber-600 dark:text-amber-500">
                  {product.category.name}
                </p>
              ) : null}

              <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {formatPrice(product.price)}
                </p>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  امتیاز:{" "}
                  <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                    {toPersianDigits(product.ratingAvg ?? 0)}
                  </span>{" "}
                  ({toPersianDigits(product.ratingCount ?? 0)} نظر)
                </p>
              </div>
            </header>

            {product.description ? (
              <div className="space-y-2">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  توضیحات
                </h2>
                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {product.description}
                </p>
              </div>
            ) : null}

            {/* کامپوننت تعاملی انتخاب رنگ و سایز */}
            <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <VariantSelector
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                price={Number(product.price)}
                image={primaryImage || "/images/placeholder.jpg"}
                variants={product.variants}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
