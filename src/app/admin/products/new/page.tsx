import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductForm from "@/app/admin/products/components/ProductForm";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-600">Admin • Products</p>
          <h1 className="text-3xl font-semibold">Add a new product</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Create a polished catalog item with images, variants, and stock
            details.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to catalog
          </Link>
        </Button>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
