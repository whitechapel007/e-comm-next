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

const dressStylesData = [
  { title: "Casual", slug: "casual" },
  { title: "Formal", slug: "formal" },
  { title: "Party", slug: "party" },
  { title: "Gym", slug: "gym" },
];

const DressStyleSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("style");

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (current === slug) {
      params.delete("style");
    } else {
      params.set("style", slug);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-style">
      <AccordionItem value="filter-style" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Dress Style
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col text-black/60 space-y-1">
            {dressStylesData.map((style) => (
              <button
                key={style.slug}
                type="button"
                onClick={() => handleSelect(style.slug)}
                className={cn(
                  "flex items-center justify-between py-2 hover:text-black transition",
                  current === style.slug && "text-black font-medium"
                )}
              >
                {style.title} <ArrowRight />
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DressStyleSection;
