"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SizeSection = () => {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const selected     = searchParams.get("size") ?? "";

  const handleSelect = (size: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected === size) {
      params.delete("size");
    } else {
      params.set("size", size);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Size
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={selected === size}
                className={cn(
                  "px-4 py-2 rounded-full text-sm border border-gray-300 hover:border-black transition",
                  selected === size && "bg-black text-white border-black font-medium"
                )}
                onClick={() => handleSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SizeSection;
