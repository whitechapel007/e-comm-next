"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams } from "next/navigation";

const MIN = 0;
const MAX = 1_000_000;

const PriceSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const minFromUrl = Number.parseFloat(searchParams.get("minPrice") || String(MIN));
  const maxFromUrl = Number.parseFloat(searchParams.get("maxPrice") || String(MAX));

  const [priceRange, setPriceRange] = useState<[number, number]>([minFromUrl, maxFromUrl]);

  const handleChange = (val: number[]) => {
    setPriceRange(val as [number, number]);
  };

  const handleCommit = (val: number[]) => {
    const [min, max] = val as [number, number];
    const params = new URLSearchParams(searchParams.toString());

    if (min === MIN) params.delete("minPrice");
    else params.set("minPrice", String(min));

    if (max === MAX) params.delete("maxPrice");
    else params.set("maxPrice", String(max));

    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <Slider
            value={priceRange}
            min={MIN}
            max={MAX}
            step={500}
            onValueChange={handleChange}
            onValueCommit={handleCommit}
          />
          <div className="flex justify-between text-sm text-black/70 mt-2">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
