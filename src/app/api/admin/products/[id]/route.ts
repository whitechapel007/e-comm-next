import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type VariantPayload = {
  colorName: string;
  colorCode: string;
  price: string | number;
  inStock: boolean;
  images?: { url: string }[];
};

type SizePayload = {
  id?: string;
  name: string;
  quantity: string;
};

const urlString = z.string().refine(
  (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid URL" },
);

const colorVariantSchema = z.object({
  colorName: z.string().min(1),
  colorCode: z.string().min(1),
  price: z
    .union([z.string(), z.number()])
    .transform((value) => Number.parseFloat(String(value))),
  inStock: z.boolean().default(true),
  images: z.array(z.object({ url: urlString })).default([]),
});

const productUpdateSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  basePrice: z
    .union([z.string(), z.number()])
    .transform((value) => Number.parseFloat(String(value))),
  prevPrice: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((value) =>
      value !== null && value !== undefined
        ? Number.parseFloat(String(value))
        : null,
    ),
  discount: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((value) =>
      value !== null && value !== undefined
        ? Number.parseFloat(String(value))
        : null,
    ),
  isTopSelling: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  images: z.array(z.object({ url: urlString })).default([]),
  colorVariants: z.array(colorVariantSchema).default([]),
  sizes: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        quantity: z.string().min(1),
      }),
    )
    .default([]),
});

async function syncProductSizes(
  tx: Prisma.TransactionClient,
  productId: string,
  sizes: SizePayload[],
) {
  const sizeIds = await Promise.all(
    sizes.map(async (size) => {
      if (size.id) {
        await tx.size.update({
          where: { id: size.id },
          data: {
            name: size.name,
            quantity: size.quantity,
          },
        });
        return size.id;
      }

      const createdSize = await tx.size.create({
        data: {
          name: size.name,
          quantity: size.quantity,
        },
      });
      return createdSize.id;
    }),
  );

  await tx.product.update({
    where: { id: productId },
    data: {
      sizes: {
        set: sizeIds.map((id) => ({ id })),
      },
    },
  });
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized", status: 401 } as const;
  if (session.user.role !== "ADMIN")
    return { error: "Forbidden", status: 403 } as const;
  return { session };
}

async function upsertColorVariants(
  tx: Prisma.TransactionClient,
  productId: string,
  colorVariants: VariantPayload[],
) {
  const existing = await tx.colorVariant.findMany({
    where: { productId },
    select: { id: true, colorName: true },
  });

  for (const variant of colorVariants) {
    const match = existing.find((v) => v.colorName === variant.colorName);
    const price = Number.parseFloat(String(variant.price));

    if (match) {
      await tx.colorVariant.update({
        where: { id: match.id },
        data: { colorCode: variant.colorCode, price, inStock: variant.inStock },
      });
      await tx.colorVariantImage.deleteMany({
        where: { colorVariantId: match.id },
      });
      if (variant.images?.length) {
        await tx.colorVariantImage.createMany({
          data: variant.images.map(({ url }) => ({
            colorVariantId: match.id,
            url,
          })),
        });
      }
    } else {
      await tx.colorVariant.create({
        data: {
          productId,
          colorName: variant.colorName,
          colorCode: variant.colorCode,
          price,
          inStock: variant.inStock,
          images: { create: variant.images?.map(({ url }) => ({ url })) ?? [] },
        },
      });
    }
  }
}

// ── GET /api/admin/products/[id] ─────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        colorVariants: { include: { images: true } },
        sizes: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/admin/products/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// ── PUT /api/admin/products/[id] ─────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await context.params;

  try {
    const parsed = productUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const {
      name,
      description,
      basePrice,
      prevPrice,
      discount,
      isTopSelling,
      isNewArrival,
      images,
      colorVariants,
      sizes,
    } = parsed.data;

    const product = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          basePrice,
          prevPrice: prevPrice ?? null,
          discount: discount ?? null,
          isTopSelling,
          isNewArrival,
        },
      });

      if (images?.length) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map(({ url }: { url: string }) => ({
            productId: id,
            url,
          })),
        });
      }

      if (colorVariants?.length) {
        await upsertColorVariants(tx, id, colorVariants);
      }

      if (sizes) {
        await syncProductSizes(tx, id, sizes);
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          images: true,
          colorVariants: { include: { images: true } },
          sizes: true,
        },
      });
    });

    return NextResponse.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("PUT /api/admin/products/[id]:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update product",
      },
      { status: 500 },
    );
  }
}

// ── DELETE /api/admin/products/[id] ──────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const orderItemCount = await prisma.orderItem.count({
      where: { productId: id },
    });
    if (orderItemCount > 0) {
      return NextResponse.json(
        {
          error:
            "This product cannot be deleted because it is referenced by existing orders. " +
            "Please archive the product or remove it from orders first.",
        },
        { status: 409 },
      );
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({
      message: "Product deleted successfully",
      productId: id,
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id]:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 },
    );
  }
}
