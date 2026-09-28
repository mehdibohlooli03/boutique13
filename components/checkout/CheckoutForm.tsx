"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/src/store/useCartStore";
import { createOrder } from "@/src/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, User, Building, Mail, Loader2, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CheckoutFormProps {
  userPhone: string;
}

export default function CheckoutForm({ userPhone }: CheckoutFormProps) {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [recipientName, setRecipientName] = useState("");
  const [city, setCity] = useState("تهران");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="text-center py-12 border-dashed">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">سبد خرید شما خالی است</h2>
          <p className="text-sm text-muted-foreground">
            برای ثبت سفارش، ابتدا محصولی به سبد خرید خود اضافه کنید.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">مشاهده محصولات</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = itemsTotal >= 1_000_000 ? 0 : 65_000;
  const finalPrice = itemsTotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipientName.trim()) {
      setError("لطفاً نام و نام خانوادگی تحویل‌گیرنده را وارد کنید.");
      return;
    }
    if (!street.trim()) {
      setError("لطفاً آدرس پستی دقیق را وارد کنید.");
      return;
    }

    startTransition(async () => {
      const payload = {
        recipientName,
        province: city,
        city,
        street,
        postalCode: postalCode.trim() || undefined,
        items: items.map((item) => ({
          productId: item.productId, // ✅ اصلاح شد: شناسه محصول از productId گرفته می‌شود
          variantId: item.id || undefined, // ✅ اصلاح شد: id استور در اصل همان variantId است
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await createOrder(payload);

      if (result.success && result.orderId) {
        clearCart();
        router.push(`/order-success?orderId=${result.orderId}`);
      } else {
        setError(result.error || "خطایی در ثبت سفارش رخ داد.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              اطلاعات تحویل‌گیرنده و آدرس
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">نام و نام خانوادگی</label>
                <div className="relative">
                  <Input
                    placeholder="مثال: علی محمدی"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    disabled={isPending}
                  />
                  <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">شماره تماس (ثبت‌شده)</label>
                <Input
                  value={userPhone}
                  disabled
                  dir="ltr"
                  className="bg-muted text-center font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">استان / شهر</label>
                <div className="relative">
                  <Input
                    placeholder="مثال: تهران"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isPending}
                  />
                  <Building className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">کد پستی (اختیاری)</label>
                <div className="relative">
                  <Input
                    placeholder="۱۰ رقم بدون خط تیره"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    disabled={isPending}
                    dir="ltr"
                    className="font-mono"
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">آدرس پستی کامل</label>
              <Input
                placeholder="نام خیابان، کوچه، پلاک، واحد"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                disabled={isPending}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-zinc-950/40 border-muted/80">
          <CardHeader>
            <CardTitle className="text-base">خلاصه فاکتور</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>تعداد اقلام:</span>
              <span className="font-semibold text-foreground">
                {items.reduce((acc, item) => acc + item.quantity, 0)} عدد
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>مجموع قیمت اقلام:</span>
              <span>{itemsTotal.toLocaleString("fa-IR")} تومان</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>هزینه ارسال:</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-500 font-medium">رایگان</span>
                ) : (
                  `${shippingFee.toLocaleString("fa-IR")} تومان`
                )}
              </span>
            </div>

            <div className="border-t border-border/60 pt-3 flex justify-between font-bold text-base">
              <span>مبلغ نهایی پرداخت:</span>
              <span className="text-primary">{finalPrice.toLocaleString("fa-IR")} تومان</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  در حال ثبت سفارش...
                </>
              ) : (
                "ثبت نهایی سفارش"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
