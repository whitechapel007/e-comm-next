"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteProductModalProps {
  readonly productId: string;
  readonly productName: string;
  readonly onCloseAction: () => void;
}

export default function DeleteProductModal({
  productId,
  productName,
  onCloseAction,
}: DeleteProductModalProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Failed to delete product");
      }
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      onCloseAction();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onCloseAction}>
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
            <Button variant="outline" onClick={onCloseAction}>
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
