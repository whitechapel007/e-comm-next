"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { ProductType } from "../../../../../types/product";

interface ProductTableProps {
  products: ProductType[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductTable({
  products,
  page,
  totalPages,
  onPageChange,
}: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const getProductImage = (product: ProductType) =>
    product.colorVariants?.[0]?.images?.[0]?.url ||
    product.images?.[0]?.url ||
    "/placeholder.png";

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Top Selling</TableHead>
              <TableHead>New Arrival</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  {/* Image */}
                  <TableCell>
                    <div className="relative h-14 w-14 overflow-hidden rounded-md border bg-gray-50">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>

                  {/* Info */}
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>₦{product.basePrice.toLocaleString()}</TableCell>
                  <TableCell>{product.discount ?? 0}%</TableCell>
                  <TableCell>{product.isTopSelling ? "✅" : "❌"}</TableCell>
                  <TableCell>{product.isNewArrival ? "✅" : "❌"}</TableCell>

                  {/* Actions */}
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No products available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <p>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </p>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>

      {/* Modals */}
      {selectedProduct && !deleteModalOpen && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {deleteModalOpen && selectedProduct && (
        <DeleteProductModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
}
