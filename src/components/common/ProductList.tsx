"use client";

import * as motion from "framer-motion/client";
import Link from "next/link";

import ProductCard from "./ProductCard";
import { ProductType as Product } from "../../../types/product";

export default function ProductList({
  heading,
  products,
}: {
  heading: string;
  products: Product[];
}) {
  return (
    <section className="py-14 px-4 max-w-7xl mx-auto">
      <motion.h2
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl mb-8 md:mb-14 capitalize"
      >
        {heading}
      </motion.h2>

      <motion.div
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          {products.map((product) => (
            <div key={product.id} className="mb-6 md:mb-8">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="w-full px-4 sm:px-0 text-center">
          <Link
            href="/shop"
            className="w-full inline-block sm:w-[218px] px-[54px] py-4 border rounded-full hover:bg-black hover:text-white text-black transition-all font-medium text-sm sm:text-base border-black/10"
          >
            View All
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
