import Image from "next/image";

import { Button } from "@/components/ui/button";

import * as motion from "framer-motion/client";

export default function Hero() {
  return (
    <motion.section>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
        <div className="space-y-6">
          <motion.h1
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Quiet luxury. Loud character.
          </motion.h1>

          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="max-w-xl text-base sm:text-lg text-slate-600"
          >
            Curated wardrobe staples, sustainably produced and thoughtfully
            designed — pieces that last beyond the season.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex gap-3">
              <Button asChild>
                <a href="/shop" className="inline-flex items-center">
                  Shop new arrivals
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/about">Our story</a>
              </Button>
            </div>
          </motion.div>

          {/* small feature strip inspired by Everlane / Zara */}
          <div className="mt-6 flex gap-4 flex-wrap text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              Free shipping over ₦25,000
            </span>
            <span className="inline-flex items-center gap-2">
              30-day returns
            </span>
            <span className="inline-flex items-center gap-2">
              Sustainably sourced
            </span>
          </div>
        </div>

        {/* Hero image / composition */}
        <div className="relative h-[420px] sm:h-[520px]">
          <motion.div
            initial={{ scale: 1.03 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* In production replace with next/image for performance */}
            <Image
              src="/images/header.jpg"
              alt="Model wearing brand clothing"
              className="w-full object-cover hover:scale-110 transition-all duration-500"
              loading="lazy"
              width={600}
              height={600}
            />
          </motion.div>

          {/* floating product preview (micro-interaction) */}
          <motion.div
            whileHover={{ y: -6 }}
            className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-xl p-3 shadow-md w-56"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/images/pic1.png"
                alt="preview"
                className="w-14 h-14 object-cover rounded"
                width={56}
                height={56}
              />
              <div>
                <div className="text-sm font-medium">
                  T-shirt with Tape Details
                </div>
                <div className="text-xs text-slate-500">₦120</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
