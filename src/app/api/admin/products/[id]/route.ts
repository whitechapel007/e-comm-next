// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { size } from "../../../../../../types/product";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    // ✅ Authenticate user
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "ADMIN")
      return NextResponse.json(
        { error: "Forbidden - Admins only" },
        { status: 403 }
      );

    const body = await req.json();
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
    } = body;

    const result = await prisma.$transaction(async (tx) => {
      // Update base product info
      await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          basePrice: parseFloat(basePrice),
          prevPrice: prevPrice ? parseFloat(prevPrice) : null,
          discount: discount ? parseFloat(discount) : null,
          isTopSelling,
          isNewArrival,
        },
      });

      // Update images
      if (images && images.length > 0) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map((img: { url: string }) => ({
            productId: id,
            url: img.url,
          })),
        });
      }

      // Update color variants
      if (colorVariants && colorVariants.length > 0) {
        const existingVariants = await tx.colorVariant.findMany({
          where: { productId: id },
          include: { images: true },
        });

        for (const variant of colorVariants) {
          const existing = existingVariants.find(
            (v) => v.colorName === variant.colorName
          );

          if (existing) {
            await tx.colorVariant.update({
              where: { id: existing.id },
              data: {
                colorCode: variant.colorCode,
                price: parseFloat(variant.price),
                inStock: variant.inStock,
              },
            });

            await tx.colorVariantImage.deleteMany({
              where: { colorVariantId: existing.id },
            });
            if (variant.images?.length) {
              await tx.colorVariantImage.createMany({
                data: variant.images.map((img: { url: string }) => ({
                  colorVariantId: existing.id,
                  url: img.url,
                })),
              });
            }
          } else {
            await tx.colorVariant.create({
              data: {
                productId: id,
                colorName: variant.colorName,
                colorCode: variant.colorCode,
                price: parseFloat(variant.price),
                inStock: variant.inStock,
                images: {
                  create:
                    variant.images?.map((img: { url: string }) => ({
                      url: img.url,
                    })) ?? [],
                },
              },
            });
          }
        }
      }
      await tx.product.update({
        where: { id },
        data: {
          sizes: {
            set:
              sizes && sizes.length > 0
                ? sizes.map((s: size) => ({ id: s.id }))
                : [],
          },
        },
      });
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
      message: "✅ Product updated successfully",
      product: result,
    });
  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    // ✅ Authenticate user
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "ADMIN")
      return NextResponse.json(
        { error: "Forbidden - Admins only" },
        { status: 403 }
      );

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      message: "✅ Product deleted successfully",
      productId: id,
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
