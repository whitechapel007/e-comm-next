import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

import ProductCard from "@/components/common/ProductCard";
import BreadcrumbComponent from "@/components/common/BreadcrumbComponent";
import Filters from "@/components/shop/Filters";
import MobileFilters from "@/components/shop/MobileFilters";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SearchParams = { [key: string]: string | string[] | undefined };

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

const categoryMap: Record<string, "SHOES" | "BAGS" | "CLOTHING" | "ACCESSORIES"> = {
  shoes: "SHOES",
  bags: "BAGS",
  clothing: "CLOTHING",
  accessories: "ACCESSORIES",
};

function scalar(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function buildFilters(params: SearchParams): Prisma.ProductWhereInput {
  const filters: Prisma.ProductWhereInput = {};
  const { category, color, size, minPrice, maxPrice } = params;

  if (typeof category === "string" && categoryMap[category.toLowerCase()]) {
    filters.category = categoryMap[category.toLowerCase()];
  }

  const colorValue = scalar(color);
  if (colorValue) {
    filters.colorVariants = {
      some: { colorName: { contains: colorValue, mode: "insensitive" } },
    };
  }

  const sizeValue = scalar(size);
  if (sizeValue) {
    filters.sizes = {
      some: { name: { equals: sizeValue, mode: "insensitive" } },
    };
  }

  if (minPrice || maxPrice) {
    filters.basePrice = {
      gte: minPrice ? Number.parseFloat(scalar(minPrice) ?? "0") : undefined,
      lte: maxPrice ? Number.parseFloat(scalar(maxPrice) ?? "0") : undefined,
    };
  }

  return filters;
}

export default async function ShopPage({ searchParams }: Readonly<ShopPageProps>) {
  const params = await searchParams;
  const { page, limit } = params;

  const currentPage = Math.max(1, Number.parseInt((page as string) || "1"));
  const pageSize = Math.min(48, Math.max(1, Number.parseInt((limit as string) || "12")));
  const skip = (currentPage - 1) * pageSize;

  // Build base query params string for pagination (preserves all active filters)
  const filterParams = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k !== "page" && v) filterParams.set(k, Array.isArray(v) ? v[0] : v);
  }
  const buildPageUrl = (p: number) => {
    const q = new URLSearchParams(filterParams);
    q.set("page", String(p));
    return `?${q.toString()}`;
  };

  const filters = buildFilters(params);

  // --- Fetch products ---
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: filters,
      include: {
        images: true,
        colorVariants: { include: { images: true } },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: filters }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <BreadcrumbComponent />

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-6">
          {/* Sidebar */}
          <aside className="hidden md:flex flex-col min-w-[300px] max-w-[300px] border border-black/10 rounded-[20px] p-6 space-y-6 bg-gray-50">
            <h2 className="text-xl font-bold text-black">Filters</h2>
            <Filters />
          </aside>

          {/* Mobile Filters + Products */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex justify-between items-center md:hidden">
              <MobileFilters />
              <h1 className="text-2xl font-bold">Shop</h1>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
              {products.length ? (
                products.map((p, index) => (
                  <ProductCard key={p.id} product={p} priority={index < 6} />
                ))
              ) : (
                <div className="col-span-full text-center text-black/60 py-20">
                  No products found.
                </div>
              )}
            </div>

            {/* Pagination — preserves all active filters */}
            {totalPages > 1 && (
              <Pagination className="justify-center mt-6">
                <PaginationPrevious
                  href={buildPageUrl(Math.max(1, currentPage - 1))}
                  className={`border border-black/10 ${
                    currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                  }`}
                />
                <PaginationContent>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href={buildPageUrl(pageNum)}
                          isActive={pageNum === currentPage}
                          className="text-black/50 font-medium text-sm"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                </PaginationContent>
                <PaginationNext
                  href={buildPageUrl(Math.min(totalPages, currentPage + 1))}
                  className={`border border-black/10 ${
                    currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
                  }`}
                />
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
