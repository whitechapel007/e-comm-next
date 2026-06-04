"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ProductDetailsContent from "./ProductDetailsContent";
import ReviewsContent from "./ReviewsContent";
import { ProductType } from "../../../../types/product";

interface TabsProps {
  product: ProductType;
}

const tabBtnData = [
  { id: 1, label: "Product Details" },
  { id: 2, label: "Rating & Reviews" },
];

const Tabs = ({ product }: Readonly<TabsProps>) => {
  const [active, setActive] = useState<number>(1);

  return (
    <div>
      <div className="flex items-center mb-6 sm:mb-8 overflow-x-auto">
        {tabBtnData.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            type="button"
            className={cn([
              active === tab.id
                ? "border-black border-b-2 font-medium"
                : "border-b border-black/10 text-black/60 font-normal",
              "p-5 sm:p-6 rounded-none flex-1",
            ])}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="mb-12 sm:mb-16">
        {active === 1 && <ProductDetailsContent product={product} />}
        {active === 2 && <ReviewsContent productId={product.id} productSlug={product.slug} />}
      </div>
    </div>
  );
};

export default Tabs;
