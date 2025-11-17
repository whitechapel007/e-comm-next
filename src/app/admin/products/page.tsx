"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import ProductTable from "./components/ProductTable";
import AddProductModal from "./components/AddProductModal";

export default function AdminProductsPage() {
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/products", {
        params: { page, limit },
      });
      return res.data;
    },
  });

  // Handle empty state
  const isEmpty = !isLoading && products?.length === 0;
  const totalPages = products?.totalPages ?? 1;

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
          {(error as Error).message || "Failed to load products"}
        </p>
      )}

      {/* Empty state */}
      {isEmpty && (
        <p className="text-center mt-10 text-gray-500">
          No products found. Click Add New Product to get started.
        </p>
      )}

      {/* Product table */}
      {products && products.length > 0 && (
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
