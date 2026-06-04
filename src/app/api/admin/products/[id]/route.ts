import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

type VariantPayload = {
  colorName: string;
  colorCode: string;
  price: string | number;
  inStock: boolean;
  images?: { url: string }[];
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized", status: 401 } as const;
  if (session.user.role !== "ADMIN") return { error: "Forbidden", status: 403 } as const;
  return { session };
}

async function upsertColorVariants(
  tx: Prisma.TransactionClient,
  productId: string,
  colorVariants: VariantPayload[]
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
      await tx.colorVariantImage.deleteMany({ where: { colorVariantId: match.id } });
      if (variant.images?.length) {
        await tx.colorVariantImage.createMany({
          data: variant.images.map(({ url }) => ({ colorVariantId: match.id, url })),
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

// ── PUT /api/admin/products/[id] ─────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await context.params;

  try {
    const {
      name, description, basePrice, prevPrice, discount,
      isTopSelling, isNewArrival, images, colorVariants, sizes,
    } = await req.json();

    const product = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          basePrice:    Number.parseFloat(basePrice),
          prevPrice:    prevPrice  ? Number.parseFloat(prevPrice)  : null,
          discount:     discount   ? Number.parseFloat(discount)   : null,
          isTopSelling,
          isNewArrival,
        },
      });

      if (images?.length) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map(({ url }: { url: string }) => ({ productId: id, url })),
        });
      }

      if (colorVariants?.length) {
        await upsertColorVariants(tx, id, colorVariants);
      }

      await tx.product.update({
        where: { id },
        data: {
          sizes: { set: sizes?.length ? sizes.map(({ id: sid }: { id: string }) => ({ id: sid })) : [] },
        },
      });

      return tx.product.findUnique({
        where: { id },
        include: { images: true, colorVariants: { include: { images: true } }, sizes: true },
      });
    });

    return NextResponse.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("PUT /api/admin/products/[id]:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// ── DELETE /api/admin/products/[id] ──────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Product deleted successfully", productId: id });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete product" },
      { status: 500 }
    );
  }
}
