import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

// ── GET /api/products/[slug]/reviews ─────────────────────────────────────────
// Public. Returns paginated reviews + aggregate stats for a product.
export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);

  const page  = Math.max(1, Number.parseInt(searchParams.get("page")  ?? "1"));
  const limit = Math.min(20, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "6")));
  const sort  = searchParams.get("sort") ?? "latest";
  const skip  = (page - 1) * limit;

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "oldest"  ? { createdAt: "asc"  } :
    sort === "highest" ? { rating:    "desc" } :
    sort === "lowest"  ? { rating:    "asc"  } :
    /* latest */         { createdAt: "desc" };

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const [reviews, totalCount, aggregate] = await Promise.all([
      prisma.review.findMany({
        where: { productId: product.id },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { productId: product.id } }),
      prisma.review.aggregate({
        where: { productId: product.id },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return NextResponse.json({
      reviews,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      averageRating: aggregate._avg.rating
        ? Math.round(aggregate._avg.rating * 10) / 10
        : 0,
      ratingCount: aggregate._count.rating,
    });
  } catch (error) {
    console.error("GET reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// ── POST /api/products/[slug]/reviews ────────────────────────────────────────
// Authenticated. Creates a review and recomputes the product's aggregate rating.
export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in to leave a review" }, { status: 401 });
  }

  const { slug } = await params;

  const body = await req.json();
  const rating  = Number(body.rating);
  const comment = String(body.comment ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be a whole number between 1 and 5" }, { status: 400 });
  }
  if (comment.length < 10) {
    return NextResponse.json({ error: "Review must be at least 10 characters" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: session.user.id, productId: product.id } },
    });
    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
    }

    // Create review + recompute product rating atomically
    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          userId:    session.user.id,
          productId: product.id,
          rating,
          comment,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });

      // Recompute aggregate rating
      const { _avg } = await tx.review.aggregate({
        where: { productId: product.id },
        _avg: { rating: true },
      });

      await tx.product.update({
        where: { id: product.id },
        data: { rating: Math.round((_avg.rating ?? 0) * 10) / 10 },
      });

      return created;
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("POST review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
