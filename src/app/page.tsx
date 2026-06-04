import BrandsSlide from "@/components/common/BrandSlide";

import ProductList from "@/components/common/ProductList";
import ReviewsCarousel from "@/components/common/ReviewsCarousel";

import Hero from "@/components/layout/hero/page";
import { prisma } from "@/lib/prisma";

const Home = async () => {
  const [topSellingProducts, newArrivals, latestReviews] = await Promise.all([
    prisma.product.findMany({
      where: { isTopSelling: true },
      include: { images: true, colorVariants: { include: { images: true } } },
    }),
    prisma.product.findMany({
      where: { isNewArrival: true },
      include: { images: true, colorVariants: { include: { images: true } } },
    }),
    prisma.review.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      where: { rating: { gte: 4 } },
      include: { user: { select: { id: true, name: true, image: true } } },
    }),
  ]);

  // Prisma returns Date objects; serialize to strings for client components
  const serializedReviews = latestReviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Hero />
      <BrandsSlide />
      <div className="space-y-10">
        <ProductList heading="New Arrivals" products={newArrivals} />
        <ProductList heading="Top Selling" products={topSellingProducts} />
      </div>
      {/* Brand story strip */}
      <section className="bg-black text-white py-14 px-4 text-center my-10">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Our Promise</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 max-w-2xl mx-auto leading-tight">
          Tailored beyond ordinary —<br />
          <span className="italic font-serif font-normal">style in every thread.</span>
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
          At Eboya Boi, every Kaftan, Agbada, shirt, 2-piece and casualwear is crafted
          with precision and passion right here in Akoka, Lagos Nigeria. Your fashion
          story starts here.
        </p>
      </section>
      <ReviewsCarousel reviews={serializedReviews} />
    </div>
  );
};

export default Home;
