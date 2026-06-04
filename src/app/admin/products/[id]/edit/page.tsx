import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm, {
  ProductFormValues,
} from "@/app/admin/products/components/ProductForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditProductPageProps {
  readonly params: { readonly id: string };
}

function mapProductToFormValues(product: any): ProductFormValues {
  return {
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    prevPrice: product.prevPrice ?? undefined,
    discount: product.discount ?? undefined,
    category: product.category,
    isNewArrival: product.isNewArrival,
    isTopSelling: product.isTopSelling,
    images:
      product.images?.map((image: { url: string }) => ({ url: image.url })) ??
      [],
    colorVariants:
      product.colorVariants?.map((variant: any) => ({
        colorName: variant.colorName,
        colorCode: variant.colorCode,
        price: variant.price,
        inStock: variant.inStock,
        images:
          variant.images?.map((img: { url: string }) => ({ url: img.url })) ??
          [],
      })) ?? [],
    sizes:
      product.sizes?.map(
        (size: { id: string; name: string; quantity: string }) => ({
          id: size.id,
          name: size.name,
          quantity: size.quantity,
        }),
      ) ?? [],
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      colorVariants: { include: { images: true } },
      sizes: true,
    },
  });

  if (!product) {
    notFound();
  }

  const initialValues = mapProductToFormValues(product);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-600">Admin • Products</p>
          <h1 className="text-3xl font-semibold">Edit product</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Update product content, pricing, variants, and stock for an existing
            catalog item.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to catalog
          </Link>
        </Button>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm
          mode="edit"
          productId={params.id}
          initialValues={initialValues}
          cancelHref="/admin/products"
        />
      </div>
    </div>
  );
}
