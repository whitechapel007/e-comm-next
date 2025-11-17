"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const ColorsSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const colorMap: Record<string, string> = {
    "bg-green-600": "green",
    "bg-red-600": "red",
    "bg-yellow-300": "yellow",
    "bg-orange-600": "orange",
    "bg-cyan-400": "cyan",
    "bg-blue-600": "blue",
    "bg-purple-600": "purple",
    "bg-pink-600": "pink",
    "bg-white": "white",
    "bg-black": "black",
  };

  const reverseColorMap = Object.fromEntries(
    Object.entries(colorMap).map(([k, v]) => [v, k])
  );

  const colorFromUrl = searchParams.get("color");
  const [selected, setSelected] = useState<string | null>(
    colorFromUrl ? reverseColorMap[colorFromUrl] : null
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected) params.set("color", colorMap[selected]);
    else params.delete("color");
    router.push(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, router]);

  return (
    <Accordion type="single" collapsible defaultValue="filter-colors">
      <AccordionItem value="filter-colors" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Colors
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-wrap gap-2.5 md:grid grid-cols-5">
            {Object.keys(colorMap).map((color, idx) => (
              <button
                key={idx}
                type="button"
                className={cn(
                  color,
                  "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20 transition-all duration-200",
                  selected === color && "ring-2 ring-offset-2 ring-black"
                )}
                onClick={() => setSelected(selected === color ? null : color)}
              >
                {selected === color && (
                  <Check
                    className={cn(
                      "text-base",
                      color === "bg-white" ? "text-black" : "text-white"
                    )}
                  />
                )}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ColorsSection;
