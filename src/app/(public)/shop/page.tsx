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

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { category, color, size, minPrice, maxPrice, page, limit } = params;

  const currentPage = parseInt((page as string) || "1");
  const pageSize = parseInt((limit as string) || "12");
  const skip = (currentPage - 1) * pageSize;

  // --- Build Filters ---
  const filters: Prisma.ProductWhereInput = {};

  const categoryMap: Record<
    string,
    "SHOES" | "BAGS" | "CLOTHING" | "ACCESSORIES"
  > = {
    shoes: "SHOES",
    bags: "BAGS",
    clothing: "CLOTHING",
    accessories: "ACCESSORIES",
  };

  if (typeof category === "string" && categoryMap[category.toLowerCase()]) {
    filters.category = categoryMap[category.toLowerCase()];
  }

  const colorValue = Array.isArray(color) ? color[0] : color;
  const sizeValue = Array.isArray(size) ? size[0] : size;

  // Handle color filter
  if (colorValue) {
    filters.colorVariants = {
      some: {
        colorName: { equals: colorValue },
      },
    };
  }

  // Handle size filter (sizes are on Product, not ColorVariant)
  if (sizeValue) {
    filters.sizes = {
      some: {
        name: { equals: sizeValue },
      },
    };
  }

  if (minPrice || maxPrice) {
    filters.basePrice = {
      gte: minPrice ? parseFloat(minPrice as string) : undefined,
      lte: maxPrice ? parseFloat(maxPrice as string) : undefined,
    };
  }

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
            <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
              {products.length ? (
                products.map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                <div className="col-span-full text-center text-black/60 py-20">
                  No products found.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="justify-center mt-6">
                <PaginationPrevious
                  href={`?page=${Math.max(1, currentPage - 1)}`}
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
                          href={`?page=${pageNum}`}
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
                  href={`?page=${Math.min(totalPages, currentPage + 1)}`}
                  className={`border border-black/10 ${
                    currentPage === totalPages
                      ? "opacity-50 pointer-events-none"
                      : ""
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
