import Image from "next/image";
import Link from "next/link";
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
                <Link href="/shop">Shop new arrivals</Link>
              </Button>
              <Button variant="ghost">Our story</Button>
            </div>
          </motion.div>

          <div className="mt-6 flex gap-4 flex-wrap text-sm text-slate-500">
            <span>Free shipping over ₦25,000</span>
            <span>30-day returns</span>
            <span>Sustainably sourced</span>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative h-[420px] sm:h-[520px]">
          <motion.div
            initial={{ scale: 1.03 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/model.jpg"
              alt="Model wearing brand clothing"
              className="w-full object-cover hover:scale-110 transition-all duration-500"
              priority
              fill
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
