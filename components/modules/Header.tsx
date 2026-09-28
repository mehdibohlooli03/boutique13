import Link from "next/link";
import { User, Search, LogIn } from "lucide-react";
import { CartSheet } from "./CartSheet";
import { auth } from "@/src/auth";

const Header = async () => {
  // دریافت وضعیت سشن کاربر سمت سرور
  const session = await auth();

  // دسته‌بندی‌های منوی ناوبری
  const categories = [
    { name: "کت و شلوار", href: "/category/suits" },
    { name: "پیراهن", href: "/category/shirts" },
    { name: "شلوار", href: "/category/trousers" },
    { name: "اکسسوری", href: "/category/accessories" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* سمت راست: لوگو و منوی دسته‌بندی‌ها */}
        <div className="flex items-center gap-8">
          {/* لوگو برند */}
          <Link
            href="/"
            className="text-primary font-bold text-2xl tracking-tight hover:text-primary/80 transition-colors duration-300"
          >
            بوتیک ۱۳
          </Link>

          {/* منوی دسته‌بندی‌ها */}
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-zinc-300 hover:text-primary transition-colors duration-300 text-sm font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* سمت چپ: ابزارها و اکشن‌های کاربر */}
        <div className="flex items-center gap-3">
          
          {/* دکمه جستجو */}
          <button
            type="button"
            aria-label="Search"
            className="p-2 text-zinc-300 hover:text-primary transition-colors duration-300 rounded-full hover:bg-zinc-900"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* وضعیت ورود کاربر */}
          {session?.user ? (
            <Link
              href="/account"
              aria-label="Account"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-primary/50 transition-colors text-xs font-medium"
            >
              <User className="w-4 h-4 text-primary" />
              <span dir="ltr">
                {(session.user as { phone?: string })?.phone || session.user.name}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            >
              <LogIn className="w-4 h-4 text-primary" />
              <span>ورود / ثبت‌نام</span>
            </Link>
          )}

          {/* دکمه کشویی سبد خرید */}
          <CartSheet />

        </div>
      </div>
    </header>
  );
};

export default Header;
