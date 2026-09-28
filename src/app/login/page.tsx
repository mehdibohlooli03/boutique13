"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("لطفاً شماره موبایل خود را وارد کنید.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          phone,
          redirect: false,
          callbackUrl,
        });

        if (result?.error) {
          setError("شماره موبایل وارد شده نامعتبر است. فرمت صحیح: ۰۹۱۲۳۴۵۶۷۸۹");
        } else {
          // ورود موفق؛ هدایت به صفحه مقصد یا صفحه اصلی
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err) {
        setError("خطایی در برقراری ارتباط رخ داد. لطفاً مجدداً تلاش کنید.");
      }
    });
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-muted/60">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Smartphone className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">ورود / ثبت‌نام</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          برای ادامه فرایند خرید، شماره موبایل خود را وارد کنید.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              شماره موبایل
            </label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                dir="ltr"
                placeholder="09123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isPending}
                className="text-center tracking-widest text-lg font-mono placeholder:text-muted-foreground/50 h-11"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-destructive font-medium mt-1.5 animate-in fade-in">
                {error}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-muted/50 p-3 flex items-start gap-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              نسخه سریع (MVP): ورود بلافاصله پس از ثبت شماره انجام خواهد شد.
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                در حال پردازش...
              </>
            ) : (
              "ورود به بوتیک ۱۳"
            )}
          </Button>

          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 transition-colors py-1"
          >
            <span>بازگشت به فروشگاه</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-primary" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
