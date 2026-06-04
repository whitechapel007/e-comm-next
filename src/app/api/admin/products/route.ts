// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const urlString = z.string().refine((value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}, { message: "Invalid URL" });

// ── Slug helpers ─────────────────────────────────────────────────────────────

function baseSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uniqueSlug(name: string): Promise<string> {
  const slug = baseSlug(name);
  let candidate = slug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${slug}-${counter++}`;
  }
  return candidate;
}

// ── Validation schema ─────────────────────────────────────────────────────────

const colorVariantSchema = z.object({
  colorName: z.string().min(1),
  colorCode: z.string().min(1),
  price:     z.union([z.string(), z.number()]).transform((v) => Number.parseFloat(String(v))),
  inStock:   z.boolean().default(true),
  images:    z.array(z.object({ url: urlString })).default([]),
});

const productSchema = z.object({
  name:          z.string().min(2, "Name is required"),
  description:   z.string().min(10, "Description is required"),
  basePrice:     z.union([z.string(), z.number()]).transform((v) => Number.parseFloat(String(v))),
  prevPrice:     z.union([z.string(), z.number()]).optional().nullable()
                   .transform((v) => (v !== null && v !== undefined ? Number.parseFloat(String(v)) : null)),
  discount:      z.union([z.string(), z.number()]).optional().nullable()
                   .transform((v) => (v !== null && v !== undefined ? Number.parseFloat(String(v)) : null)),
  category:      z.enum(["KAFTAN", "AGBADA", "SHIRTS", "TWO_PIECE", "CASUALWEAR"]),
  isTopSelling:  z.boolean().default(false),
  isNewArrival:  z.boolean().default(false),
  images:        z.array(z.object({ url: urlString })).default([]),
  colorVariants: z.array(colorVariantSchema).default([]),
  sizes:         z.array(z.object({ name: z.string().min(1), quantity: z.string() })).default([]),
});

// ── POST: create product ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden — admins only" }, { status: 403 });
  }

  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product data", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const slug = await uniqueSlug(data.name);

    const product = await prisma.product.create({
      data: {
        name:         data.name,
        slug,
        description:  data.description,
        basePrice:    data.basePrice,
        prevPrice:    data.prevPrice ?? null,
        discount:     data.discount ?? null,
        category:     data.category,
        isTopSelling: data.isTopSelling,
        isNewArrival: data.isNewArrival,
        images: {
          create: data.images.map((img) => ({ url: img.url })),
        },
        colorVariants: {
          create: data.colorVariants.map((v) => ({
            colorName: v.colorName,
            colorCode: v.colorCode,
            price:     v.price,
            inStock:   v.inStock,
            images:    { create: v.images.map(({ url }) => ({ url })) },
          })),
        },
        sizes: {
          create: data.sizes.map((s) => ({ name: s.name, quantity: s.quantity })),
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 }
    );
  }
}

// ── GET: list products with pagination ───────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, Number.parseInt(searchParams.get("page")  ?? "1"));
    const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "10")));
    const skip  = (page - 1) * limit;
    const search = searchParams.get("search")?.trim() ?? "";

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          colorVariants: { include: { images: true } },
          sizes:  true,
          images: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      search,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 }
    );
  }
}
