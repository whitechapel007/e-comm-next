"use client";

import { Separator } from "@/components/ui/separator";
import CategoriesSection from "./CategoriesSection";
import ColorsSection from "./ColorsSection";
import PriceSection from "./PriceSection";
import DressStyleSection from "./DressStyle";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-col space-y-6">
      <CategoriesSection />
      <Separator />
      <PriceSection />
      <Separator />
      <ColorsSection />
      <Separator />
      <DressStyleSection />
      <Separator />
      <Button
        type="button"
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
        onClick={handleClearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default Filters;
