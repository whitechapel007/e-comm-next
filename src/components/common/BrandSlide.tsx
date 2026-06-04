"use client";

import { motion } from "framer-motion";

const items = [
  { text: "KAFTANS",   style: "font-serif text-2xl font-light italic" },
  { text: "•",         style: "text-gray-500 text-lg" },
  { text: "AGBADA",    style: "font-serif text-2xl font-normal" },
  { text: "•",         style: "text-gray-500 text-lg" },
  { text: "SHIRTS",    style: "font-sans text-2xl font-semibold tracking-widest" },
  { text: "•",         style: "text-gray-500 text-lg" },
  { text: "2-PIECE",   style: "font-serif text-2xl font-light italic" },
  { text: "•",         style: "text-gray-500 text-lg" },
  { text: "CASUALWEAR", style: "font-sans text-2xl font-normal tracking-wide" },
  { text: "•",         style: "text-gray-500 text-lg" },
  { text: "TAILORED IN AKOKA",   style: "font-sans text-sm font-bold uppercase tracking-widest" },
  { text: "•",         style: "text-gray-500 text-lg" },
  { text: "LAGOS NIGERIA",       style: "font-serif text-2xl font-normal italic" },
  { text: "•",         style: "text-gray-500 text-lg" },
];

// Double the items so the loop is seamless
const ticker = [...items, ...items];

export default function BrandsSlide() {
  return (
    <section className="bg-black w-full py-5 overflow-hidden">
      <div className="relative w-full h-12 flex items-center overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 22, ease: "linear" }}
          className="flex items-center gap-8 whitespace-nowrap"
        >
          {ticker.map((item, idx) => (
            <span
              key={idx}
              className={`text-white ${item.style}`}
            >
              {item.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
