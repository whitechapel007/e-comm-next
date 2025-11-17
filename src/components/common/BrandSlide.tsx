"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// For better styles, you might want to import brand fonts/SVGs. Here we use text.
const brands = [
  { name: "VERSACE", className: "font-serif text-3xl font-normal" },
  { name: "ZARA", className: "font-serif text-3xl font-normal" },
  { name: "GUCCI", className: "font-serif text-3xl font-normal" },
  { name: "PRADA", className: "font-serif text-3xl font-bold" },
  { name: "Calvin Klein", className: "font-sans text-3xl font-light" },
];

export default function BrandsSlide() {
  return (
    <section className="bg-black w-full py-6 overflow-hidden">
      <Card className="bg-black border-none shadow-none p-0">
        <div className="relative w-full h-14 flex items-center overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 12,
              ease: "linear",
            }}
            className="flex gap-x-10 whitespace-nowrap"
          >
            {[...brands, ...brands].map((brand, idx) => (
              <span
                key={`${brand.name}-${idx}`}
                className={cn(
                  "text-white mx-2",
                  brand.className,
                  "whitespace-nowrap"
                )}
              >
                {brand.name}
              </span>
            ))}
          </motion.div>
        </div>
      </Card>
    </section>
  );
}
