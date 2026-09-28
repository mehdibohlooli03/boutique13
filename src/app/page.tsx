import ProductGrid from "@/components/modules/ProductGrid";
import { getProducts } from "@/src/services/product.service";

export default async function HomePage() {
  const products = await getProducts({
    limit: 8,
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#faf9f7] text-zinc-900 dark:bg-zinc-950 dark:text-white"
    >
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-500/5" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-stone-300/20 blur-3xl dark:bg-stone-500/5" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Premium top bar */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/60 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-sm font-black text-white shadow-lg dark:bg-white dark:text-zinc-950">
              ۱۳
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">بوتیک ۱۳</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                انتخاب متفاوت، استایل ماندگار
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            محصولات جدید اضافه شد
          </div>
        </div>

        {/* Hero */}
        <section className="relative mb-14 overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-gradient-to-br from-white via-white to-amber-50/70 px-6 py-12 shadow-[0_24px_80px_-35px_rgba(24,24,27,0.28)] dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-950/20 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />
          <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-1/3 translate-y-1/3 rounded-full bg-zinc-900/5 blur-2xl dark:bg-white/5" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-2 text-xs font-bold text-amber-700 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.12)]" />
                کالکشن تازه بوتیک ۱۳
              </div>

              <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-zinc-950 sm:text-5xl lg:text-7xl dark:text-white">
                استایل تو،
                <span className="block bg-gradient-to-l from-amber-600 via-amber-500 to-yellow-400 bg-clip-text text-transparent">
                  امضای توست.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-8 text-zinc-600 sm:text-base sm:leading-9 dark:text-zinc-400">
                انتخابی خاص از بهترین پوشاک و اکسسوری‌ها با طراحی مدرن و کیفیتی
                ماندگار؛ برای ساختن استایلی که فقط متعلق به توست.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#products"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-zinc-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-zinc-950/15 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl dark:bg-white dark:text-zinc-950"
                >
                  مشاهده محصولات
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>
                </a>

                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                  کیفیتی که دیده می‌شود، حسی که ماندگار می‌ماند
                </span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-[2.5rem] border border-white/80 bg-white/70 shadow-2xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-700/70 dark:bg-zinc-800/60">
                <div className="absolute inset-3 rounded-[2rem] border border-dashed border-amber-400/50" />
                <div className="text-center">
                  <p className="text-5xl font-black tracking-tighter">۱۳</p>
                  <p className="mt-1 text-xs font-bold tracking-[0.25em] text-amber-600 dark:text-amber-400">
                    BOUTIQUE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="scroll-mt-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-amber-500" />
                <span className="text-xs font-bold tracking-wide text-amber-600 dark:text-amber-400">
                  انتخاب‌های تازه
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                جدیدترین محصولات
              </h2>

              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                تازه‌ترین انتخاب‌های بوتیک ۱۳ را کشف کنید.
              </p>
            </div>

            <div className="hidden rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-600 shadow-sm sm:block dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              ۸ انتخاب ویژه
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-200/80 bg-white/75 p-4 shadow-[0_20px_70px_-40px_rgba(24,24,27,0.35)] backdrop-blur-xl sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
            <ProductGrid products={products} title="" />
          </div>
        </section>

        {/* Trust strip */}
        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            ["01", "انتخاب باکیفیت", "محصولاتی با تمرکز روی کیفیت و جزئیات"],
            ["02", "استایل متفاوت", "ترکیب مدرن برای سلیقه‌های خاص"],
            ["03", "تجربه خرید ساده", "طراحی شده برای یک خرید سریع و لذت‌بخش"],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="group rounded-2xl border border-zinc-200/80 bg-white/70 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                  {number}
                </span>
                <span className="h-px w-10 bg-zinc-200 transition-all duration-300 group-hover:w-16 group-hover:bg-amber-400 dark:bg-zinc-800" />
              </div>
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
