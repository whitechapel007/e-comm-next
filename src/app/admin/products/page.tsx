"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import ProductTable from "./components/ProductTable";
import AddProductModal from "./components/AddProductModal";
import { ProductType } from "../../../../types/product";

interface ProductsResponse {
  products: ProductType[];
  totalPages: number;
  totalCount: number;
  page: number;
}

export default function AdminProductsPage() {
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<ProductsResponse>({
    queryKey: ["admin-products", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/products?page=${page}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to load products");
      return res.json();
    },
  });

  const products = data?.products ?? [];
  const isEmpty = !isLoading && products.length === 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Products</h2>
        <Button
          onClick={() => setAddProductModalOpen(true)}
          className="cursor-pointer"
        >
          Add New Product
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <p className="text-center mt-10">Loading products, please wait...</p>
      )}

      {/* Error state */}
      {isError && (
        <p className="text-center mt-10 text-red-600">
          {error instanceof Error ? error.message : "Failed to load products"}
        </p>
      )}

      {/* Empty state */}
      {isEmpty && (
        <p className="text-center mt-10 text-gray-500">
          No products found. Click Add New Product to get started.
        </p>
      )}

      {/* Product table */}
      {products.length > 0 && (
        <ProductTable
          products={products}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Add product modal */}
      {addProductModalOpen && (
        <AddProductModal
          onClose={() => {
            setAddProductModalOpen(false);
            // Refetch products after adding
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
          }}
        />
      )}
    </div>
  );
}
