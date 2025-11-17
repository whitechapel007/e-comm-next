"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams } from "next/navigation";

const PriceSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const minFromUrl = parseFloat(searchParams.get("minPrice") || "0");
  const maxFromUrl = parseFloat(searchParams.get("maxPrice") || "1000000");

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minFromUrl,
    maxFromUrl,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange, router]);

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <Slider
            value={priceRange}
            min={0}
            max={1000000}
            step={100}
            onValueChange={(val) => setPriceRange(val as [number, number])}
          />
          <div className="flex justify-between text-sm text-black/70 mt-2">
            <span>₦{priceRange[0]}</span>
            <span>₦{priceRange[1]}</span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
