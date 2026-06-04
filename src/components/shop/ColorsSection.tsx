"use client";

import { useState, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

// color display class → URL-safe name
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

const reverseColorMap: Record<string, string> = Object.fromEntries(
  Object.entries(colorMap).map(([k, v]) => [v, k])
);

const ColorsSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const colorFromUrl = searchParams.get("color");
  const [selected, setSelected] = useState<string | null>(
    colorFromUrl ? (reverseColorMap[colorFromUrl] ?? null) : null
  );
  const isMounted = useRef(false);

  const handleSelect = (color: string) => {
    const next = selected === color ? null : color;
    setSelected(next);

    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("color", colorMap[next]);
    else params.delete("color");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  // Mark as mounted after first render so the ref trick is available for future renders
  if (!isMounted.current) isMounted.current = true;

  return (
    <Accordion type="single" collapsible defaultValue="filter-colors">
      <AccordionItem value="filter-colors" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Colors
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-wrap gap-2.5 md:grid grid-cols-5">
            {Object.keys(colorMap).map((color) => (
              <button
                key={color}
                type="button"
                aria-label={colorMap[color]}
                aria-pressed={selected === color}
                className={cn(
                  color,
                  "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20 transition-all duration-200",
                  selected === color && "ring-2 ring-offset-2 ring-black"
                )}
                onClick={() => handleSelect(color)}
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
