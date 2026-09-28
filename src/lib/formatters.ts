// src/lib/formatters.ts

/**
 * تبدیل اعداد انگلیسی به ارقام فارسی
 * مثال: 123456 -> ۱۲۳۴۵۶
 */
export function toPersianDigits(n: number | string): string {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n
    .toString()
    .replace(/\d/g, (char) => farsiDigits[parseInt(char, 10)]);
}

/**
 * فرمت قیمت با جداکننده ۳ رقم و نمایش فارسی
 * مثال: 1500000 -> ۱,۵۰۰,۰۰۰ تومان
 */
export function formatPrice(
  price: number | string | bigint | { toString(): string },
  unit: string = "تومان"
): string {
  const numericPrice = typeof price === "object" ? Number(price.toString()) : Number(price);
  
  if (isNaN(numericPrice)) return `۰ ${unit}`;

  const formatted = new Intl.NumberFormat("fa-IR").format(numericPrice);
  return `${formatted} ${unit}`;
}
