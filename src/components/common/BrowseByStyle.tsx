"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    label: "Kaftans",
    href: "/shop?category=kaftan",
    emoji: "👘",
    bg: "bg-amber-50 border-amber-100",
    desc: "Flowing fabrics, royal drape. Tailored for kings and queens.",
  },
  {
    label: "Agbada",
    href: "/shop?category=agbada",
    emoji: "🫅",
    bg: "bg-stone-50 border-stone-100",
    desc: "The pinnacle of Nigerian formal elegance — layered, grand, unforgettable.",
  },
  {
    label: "Shirts",
    href: "/shop?category=shirts",
    emoji: "👔",
    bg: "bg-sky-50 border-sky-100",
    desc: "Crisp, bespoke shirts cut for comfort and tailored to impress.",
  },
  {
    label: "2-Piece",
    href: "/shop?category=two_piece",
    emoji: "✂️",
    bg: "bg-rose-50 border-rose-100",
    desc: "Perfectly matched sets — wear them together, turn every head.",
  },
  {
    label: "Casualwear",
    href: "/shop?category=casualwear",
    emoji: "👕",
    bg: "bg-green-50 border-green-100",
    desc: "Effortless everyday style, still sewn with that Eboya Boi touch.",
  },
];

export default function BrowseByStyle() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <p className="text-xs uppercase tracking-widest text-slate-400 text-center mb-2">
        What we make
      </p>
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3 tracking-tight">
        Browse the collection
      </h2>
      <p className="text-center text-slate-500 mb-10 max-w-xl mx-auto text-sm sm:text-base">
        Every piece is cut, sewn, and finished in Akoka, Lagos — tailored beyond ordinary.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <motion.div
            key={cat.label}
            whileHover={{ scale: 1.04, y: -4 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <Link
              href={cat.href}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border ${cat.bg} cursor-pointer transition-shadow hover:shadow-md h-full`}
            >
              <span className="text-4xl mb-3">{cat.emoji}</span>
              <p className="font-bold text-lg mb-1">{cat.label}</p>
              <p className="text-sm text-gray-500 leading-snug">{cat.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
