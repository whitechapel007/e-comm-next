"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, RefreshCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ProductTable from "./components/ProductTable";
import { ProductType } from "../../../../types/product";

interface ProductsResponse {
  products: ProductType[];
  totalPages: number;
  totalCount: number;
  page: number;
  search?: string;
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 10;
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => globalThis.clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError, error } = useQuery<ProductsResponse, Error>(
    {
      queryKey: ["admin-products", page, debouncedSearch],
      queryFn: async () => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (debouncedSearch) params.set("search", debouncedSearch);

        const res = await fetch(`/api/admin/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      },
    },
  );

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;
  const isEmpty = !isLoading && products.length === 0;

  return (
    <div className="max-w-7xl mx-auto p-3  space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Manage Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Edit, delete, or add new catalog items from one place.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or description"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <Button
            variant="outline"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["admin-products"] })
            }
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>

          <Button variant="default" asChild>
            <Link href="/admin/products/new">Add New Product</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total products</p>
          <p className="mt-2 text-2xl font-semibold">{totalCount}</p>
        </div>
        <div className="rounded-3xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Current page</p>
          <p className="mt-2 text-2xl font-semibold">{page}</p>
        </div>
        <div className="rounded-3xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Search active</p>
          <p className="mt-2 text-2xl font-semibold">
            {debouncedSearch || "None"}
          </p>
        </div>
      </div>

      {isLoading && (
        <p className="text-center text-sm text-gray-500">
          Loading products, please wait...
        </p>
      )}

      {isError && (
        <p className="text-center text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load products"}
        </p>
      )}

      {isEmpty && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
          No products found. Use the search box or add a new product to begin.
        </div>
      )}

      {products.length > 0 && (
        <ProductTable
          products={products}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
