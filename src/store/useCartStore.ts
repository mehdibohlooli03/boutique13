// src/store/useCartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // معمولاً برابر با variantId است
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  // اکشن‌ها (Actions)
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // محاسبات مشتق‌شده (Derived Getters)
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // افزودن کالا به سبد
      addItem: (item, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          // اگر قبلاً وجود داشت، فقط تعداد را زیاد می‌کنیم (مشروط به رعایت سقف موجودی انبار)
          const nextQuantity = Math.min(
            existingItem.quantity + quantity,
            item.stock
          );
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: nextQuantity } : i
            ),
          });
        } else {
          // اگر کالا جدید است، آن را با تعداد اولیه اضافه می‌کنیم
          const initialQuantity = Math.min(quantity, item.stock);
          set({
            items: [...items, { ...item, quantity: initialQuantity }],
          });
        }
      },

      // حذف کامل یک قلم از سبد
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      // تغییر مستقیم تعداد یک کالا
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (item.id === id) {
              const safeQuantity = Math.min(quantity, item.stock);
              return { ...item, quantity: safeQuantity };
            }
            return item;
          }),
        });
      },

      // خالی کردن کامل سبد خرید
      clearCart: () => {
        set({ items: [] });
      },

      // محاسبه تعداد کل اقلام موجود در سبد
      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // محاسبه مجموع مبلغ قابل پرداخت
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "boutique13-cart-storage", // نام کلید ذخیره‌سازی در localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
