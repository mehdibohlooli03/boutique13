// src/services/product.service.ts
import { prisma } from "@/src/lib/prisma";

export interface GetProductsParams {
  categorySlug?: string;
  sortBy?: "newest" | "price_asc" | "price_desc";
  limit?: number;
}

/**
 * دریافت لیست محصولات همراه با تصویر اصلی و دسته‌بندی
 */
export async function getProducts(params?: GetProductsParams) {
  const { categorySlug, sortBy = "newest", limit } = params || {};

  let orderBy: Record<string, "asc" | "desc"> = {
    createdAt: "desc",
  };

  if (sortBy === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sortBy === "price_desc") {
    orderBy = { price: "desc" };
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(categorySlug
          ? {
              category: {
                slug: categorySlug,
              },
            }
          : {}),
      },
      orderBy,
      take: limit,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        images: {
          where: {
            isPrimary: true,
          },
          take: 1,
          select: {
            url: true,
          },
        },
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
      categoryName: product.category?.name,
      imageUrl: product.images[0]?.url || null,
    }));
  } catch (error) {
    console.error("خطا در دریافت محصولات:", error);
    return [];
  }
}

/**
 * دریافت جزئیات یک محصول بر اساس slug
 */
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            isPrimary: "desc",
          },
          select: {
            id: true,
            url: true,
            isPrimary: true,
          },
        },
        variants: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            size: true,
            color: true,
            colorCode: true,
            stock: true,
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
      category: product.category
        ? {
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
      images: product.images,
      variants: product.variants,
    };
  } catch (error) {
    console.error("خطا در دریافت جزئیات محصول:", error);
    return null;
  }
}
