"use client";

import { setSizeSelection } from "@/store/productSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { ProductType as Product } from "../../../types/product";

const SizeSelection = ({ data }: { data: Product }) => {
  const { selectedSize } = useAppSelector((state: RootState) => state.product);
  const dispatch = useAppDispatch();

  const handleSizeChange = (size: string) => {
    dispatch(setSizeSelection(size));
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4 font-medium">
        Choose Size
      </span>
      <div className="flex flex-wrap gap-2 lg:gap-3">
        {data.sizes?.map((size, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={selectedSize === size.name}
            onClick={() => handleSizeChange(size.name)}
            className={cn(
              "flex items-center justify-center px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black",
              selectedSize === size.name
                ? "bg-black text-white font-medium border-black"
                : "bg-gray-100 text-black hover:bg-gray-200 border-gray-200"
            )}
          >
            {size.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;
