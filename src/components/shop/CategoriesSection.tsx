"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const categoriesData = [
  { title: "Kaftans",    slug: "kaftan"     },
  { title: "Agbada",     slug: "agbada"     },
  { title: "Shirts",     slug: "shirts"     },
  { title: "2-Piece",    slug: "two_piece"  },
  { title: "Casualwear", slug: "casualwear" },
];

const CategoriesSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category");

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (current === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
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
            {categoriesData.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleSelect(cat.slug)}
                className={cn(
                  "flex items-center justify-between py-2 hover:text-black transition",
                  current === cat.slug && "text-black font-medium"
                )}
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
