import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as motion from "framer-motion/client";

export default function Hero() {
  return (
    <motion.section>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
        <div className="space-y-6">
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-semibold uppercase tracking-widest text-slate-500"
          >
            Akoka, Lagos Nigeria
          </motion.p>

          <motion.h1
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Style in every{" "}
            <span className="italic font-serif font-normal">thread.</span>
          </motion.h1>

          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="max-w-xl text-base sm:text-lg text-slate-600"
          >
            Kaftans, Agbadas, shirts, 2-pieces & casualwears — tailored beyond
            ordinary at Eboya Boi. Rediscover your fashion story today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex gap-3">
              <Button asChild size="lg">
                <Link href="/shop">Shop the collection</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/shop?category=clothing">Our styles</Link>
              </Button>
            </div>
          </motion.div>

          <div className="mt-6 flex gap-6 flex-wrap text-sm text-slate-500">
            <span>📍 Akoka, Lagos</span>
            <span>✂️ Tailored to order</span>
            <span>🎨 Custom colours & sizes</span>
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
              alt="Eboya Boi — fashion tailored beyond ordinary"
              className="w-full object-cover hover:scale-110 transition-all duration-500"
              priority
              fill
            />
          </motion.div>

          {/* Brand badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -4 }}
            className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow-md"
          >
            <p className="text-xs text-slate-500 uppercase tracking-wide">Est. Akoka Lagos</p>
            <p className="font-bold text-base leading-tight">Eboya Boi</p>
            <p className="text-xs text-slate-500">Fashion Hub</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
