"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Sliders } from "lucide-react";
import Filters from "./Filters";

const MobileFilters = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="md:hidden h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Sliders className="text-black" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90%] p-5">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold">Filters</DrawerTitle>
        </DrawerHeader>
        <Filters />
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilters;
