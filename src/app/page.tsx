import BrandsSlide from "@/components/common/BrandSlide";
import BrowseByCategory from "@/components/common/BrowseByStyle";
import ProductList from "@/components/common/ProductList";
import ReviewsCarousel from "@/components/common/ReviewsCarousel";
import Hero from "@/components/layout/hero/page";
import { prisma } from "@/lib/prisma";

const Home = async () => {
  const [topSellingProducts, newArrivals, latestReviews] = await Promise.all([
    prisma.product.findMany({
      where: { isTopSelling: true },
      include: { images: true, colorVariants: { include: { images: true } }, sizes: true },
    }),
    prisma.product.findMany({
      where: { isNewArrival: true },
      include: { images: true, colorVariants: { include: { images: true } }, sizes: true },
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

      {/* New arrivals */}
      <ProductList heading="New Arrivals" products={newArrivals} />

      {/* Browse by category */}
      <BrowseByCategory />

      {/* Top selling */}
      <ProductList heading="Top Selling" products={topSellingProducts} />

      {/* Brand story strip */}
      <section className="bg-black text-white py-14 px-4 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Eboya Boi — Akoka, Lagos</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 max-w-2xl mx-auto leading-tight">
          Tailored beyond ordinary —<br />
          <span className="italic font-serif font-normal">style in every thread.</span>
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base mb-8">
          Kaftans, Agbadas, shirts, 2-pieces and casualwears — every stitch a statement,
          every garment a story, crafted with precision right here in Akoka, Lagos Nigeria.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <span>📍 Akoka, Lagos Nigeria</span>
          <span>✂️ Made to order</span>
          <span>🎨 Custom colours & sizes</span>
          <span>🚚 Nationwide delivery</span>
        </div>
      </section>

      {/* Customer reviews */}
      <ReviewsCarousel reviews={serializedReviews} />
    </div>
  );
};

export default Home;
