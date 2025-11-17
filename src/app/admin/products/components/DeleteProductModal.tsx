"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import axios from "axios";

interface DeleteProductModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export default function DeleteProductModal({
  productId,
  productName,
  onClose,
}: DeleteProductModalProps) {
  const [loading, setLoading] = useState(false);

  async function deleteProduct(id: string) {
    return await axios.delete(`/api/admin/products/${id}`);
  }

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-center">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{productName}</strong>? This
            action cannot be undone.
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
