"use server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";

interface CartItemInput {
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  recipientName: string;
  province?: string;
  city: string;
  street: string;
  postalCode?: string;
  items: CartItemInput[];
}

function generateOrderNumber(): string {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `BOTIK-${randomSuffix}`;
}

export async function createOrder(data: CreateOrderInput) {
  try {
    // ۱. اعتبارسنجی کاربر لاگین‌شده
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "لطفاً ابتدا وارد حساب کاربری خود شوید." };
    }

    if (!data.items || data.items.length === 0) {
      return { success: false, error: "سبد خرید شما خالی است." };
    }

    // ۲. محاسبه مجدد مبالغ در سمت سرور
    const itemsTotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingFee = itemsTotal >= 1_000_000 ? 0 : 65_000;
    const finalAmount = itemsTotal + shippingFee;

    // ۳. ثبت تراکنش امن دیتابیس
    const order = await prisma.$transaction(async (tx) => {
      // الف) ایجاد و ذخیره آدرس تحویل گیرنده
      const address = await tx.address.create({
        data: {
          userId: session.user.id,
          recipient: data.recipientName.trim(),
          phone: (session.user as { phone?: string }).phone || "",
          province: data.province?.trim() || data.city.trim(),
          city: data.city.trim(),
          street: data.street.trim(),
          postalCode: data.postalCode?.trim() || "0000000000",
        },
      });

      // ب) ایجاد سفارش همراه با OrderItemها متصل به Product
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          addressId: address.id,
          totalAmount: finalAmount,
          shippingCost: shippingFee,
          status: "PENDING",
          paymentStatus: "UNPAID",
          items: {
            create: data.items.map((item) => ({
              productId: item.productId, // اتصال دقیق به محصول
              variantId: item.variantId || null,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
          },
        },
      });

      return newOrder;
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error: "خطایی در ثبت سفارش رخ داد. لطفاً مجدداً تلاش کنید." };
  }
}
