"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const categoriesData = [
  { title: "Men's Clothes", slug: "men" },
  { title: "Women's Clothes", slug: "women" },
  { title: "Shoes", slug: "shoes" },
  { title: "Bags", slug: "bags" },
  { title: "Gowns", slug: "gowns" },
];

const CategoriesSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-category">
      <AccordionItem value="filter-category" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl p-0 py-0.5 hover:no-underline">
          Categories
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col text-black/60 space-y-1">
            {categoriesData.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(cat.slug)}
                className="flex items-center justify-between py-2 hover:text-black transition"
              >
                {cat.title} <ArrowRight />
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoriesSection;
