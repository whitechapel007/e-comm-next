"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const SizeSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected) params.set("size", selected);
    else params.delete("size");
    router.push(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, router]);

  const sizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Size
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, idx) => (
              <button
                key={idx}
                type="button"
                className={cn(
                  "px-4 py-2 rounded-full text-sm border border-gray-300 hover:border-black transition",
                  selected === size && "bg-black text-white font-medium"
                )}
                onClick={() => setSelected(size)}
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
