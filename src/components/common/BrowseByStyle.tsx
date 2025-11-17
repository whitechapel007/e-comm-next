// components/BrowseByStyle.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Shirt, PartyPopper, Dumbbell, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Customize/extend this array for more styles!
const styles = [
  {
    label: "Casual",
    href: "/shop?style=casual",
    icon: <Shirt size={44} className="text-blue-600 mb-2" />,
    color: "bg-blue-50",
    desc: "Relaxed fits for everyday essentials.",
  },
  {
    label: "Formal",
    href: "/shop?style=formal",
    icon: <Briefcase size={44} className="text-gray-700 mb-2" />,
    color: "bg-gray-50",
    desc: "Elegance for meetings, work, and events.",
  },
  {
    label: "Party",
    href: "/shop?style=party",
    icon: <PartyPopper size={44} className="text-fuchsia-500 mb-2" />,
    color: "bg-fuchsia-50",
    desc: "Stand out styles for night outs.",
  },
  {
    label: "Gym",
    href: "/shop?style=gym",
    icon: <Dumbbell size={44} className="text-green-700 mb-2" />,
    color: "bg-green-50",
    desc: "Activewear for comfort and performance.",
  },
];

export default function BrowseByStyle() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-tight">
        Browse By Dress Style
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {styles.map((style) => (
          <motion.div
            key={style.label}
            whileHover={{ scale: 1.07, y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link href={style.href} className="block">
              <Card
                className={`flex flex-col items-center justify-center p-6 rounded-xl shadow ${style.color} cursor-pointer transition`}
              >
                {style.icon}
                <div className="text-xl font-semibold ">{style.label}</div>
                <div className="text-sm text-gray-500 text-center">
                  {style.desc}
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
