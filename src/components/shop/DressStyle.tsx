"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const dressStylesData = [
  { title: "Casual", slug: "casual" },
  { title: "Formal", slug: "formal" },
  { title: "Party", slug: "party" },
  { title: "Gym", slug: "gym" },
];

const DressStyleSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (style: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (style) params.set("style", style);
    else params.delete("style");
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
            {dressStylesData.map((style, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(style.slug)}
                className="flex items-center justify-between py-2 hover:text-black transition"
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
