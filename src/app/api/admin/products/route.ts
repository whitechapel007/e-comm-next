// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // collapse multiple dashes
}

// Create a new product (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admins only" },
        { status: 403 }
      );
    }

    const data = await req.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: generateSlug(data.name),
        description: data.description,

        basePrice: parseFloat(data.basePrice),
        prevPrice: data.prevPrice ? parseFloat(data.prevPrice) : null,
        discount: data.discount ? parseFloat(data.discount) : null,
        category: data.category,
        isTopSelling: data.isTopSelling,
        isNewArrival: data.isNewArrival,
        images: {
          create: data.images.map((img: { url: string }) => ({ url: img.url })),
        },
        colorVariants: {
          create: data.colorVariants.map(
            (variant: {
              colorName: string;
              colorCode: string;
              price: string;
              inStock: boolean;
              images: { url: string }[];
            }) => ({
              colorName: variant.colorName,
              colorCode: variant.colorCode,
              price: parseFloat(variant.price),
              inStock: variant.inStock,
              images: {
                create: variant.images.map(({ url }) => ({ url })),
              },
            })
          ),
        },
        sizes: {
          create: data.sizes.map(
            (size: { name: string; quantity: string }) => ({
              name: size.name,
              quantity: size.quantity,
            })
          ),
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Get all products (public)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        colorVariants: { include: { images: true } },
        sizes: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
