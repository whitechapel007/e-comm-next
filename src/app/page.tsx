import BrandsSlide from "@/components/common/BrandSlide";

import ProductList from "@/components/common/ProductList";
import ReviewsCarousel from "@/components/common/ReviewsCarousel";

import Hero from "@/components/layout/hero/page";
import { prisma } from "@/lib/prisma";

const Home = async () => {
  const topSellingProducts = await prisma.product.findMany({
    where: { isTopSelling: true },
    include: {
      images: true,
      colorVariants: {
        include: {
          images: true,
        },
      },
    },
  });

  // Get new arrivals (flagged manually)

  const newArrivals = await prisma.product.findMany({
    where: { isNewArrival: true },
    include: {
      images: true,
      colorVariants: {
        include: {
          images: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Hero />
      <BrandsSlide />
      <div className="space-y-10">
        <ProductList heading="New Arrivals" products={newArrivals} />
        <ProductList heading="Top Selling" products={topSellingProducts} />
      </div>
      <ReviewsCarousel />
    </div>
  );
};

export default Home;
