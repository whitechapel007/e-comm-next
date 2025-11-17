import ProductList from "@/components/common/ProductList";
import BreadcrumbComponent from "@/components/common/BreadcrumbComponent";
import Tabs from "@/components/productPage/tabs";
import ProductDetail from "@/components/productDetail";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartSection from "@/components/productDetail/AddToCartSection";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Fetch product data
  const productData = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      colorVariants: { include: { images: true } },
      sizes: true,
    },
  });

  if (!productData) notFound();

  // Fetch related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      AND: [
        { slug: { not: slug } },
        { category: productData.category || undefined },
      ],
    },
    take: 8,
    include: {
      images: true,
      colorVariants: { include: { images: true } },
    },
  });

  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <hr className="border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbComponent details={productData.slug} />

        <section className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
          {/* Product Details */}
          <div className="lg:col-span-2">
            <ProductDetail data={productData} />
          </div>
        </section>

        {/* Tabs Section */}
        <Tabs />
      </div>

      {/* Mobile Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-black/10 p-4 shadow-md">
        <AddToCartSection data={productData} />
      </div>

      {/* Related Products */}
      <div className="my-12 sm:my-20 max-w-7xl mx-auto px-4 xl:px-0">
        <ProductList heading="You might also like" products={relatedProducts} />
      </div>
    </main>
  );
}
