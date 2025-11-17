"use client";

import { setColorSelection, setCurrentImageIndex } from "@/store/productSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux";
import { RootState } from "@/store";
import { Check } from "lucide-react";
import { ProductType } from "../../../types/product";
import { cn } from "@/lib/utils";

const ColorSelection = ({ data }: { data: ProductType }) => {
  const { selectedColor } = useAppSelector((state: RootState) => state.product);
  const dispatch = useAppDispatch();

  const currentColorVariant = selectedColor
    ? data.colorVariants.find((c) => c.colorName === selectedColor.name)
    : data.colorVariants[0];

  if (!currentColorVariant)
    return (
      <div className="text-sm text-gray-500">No color variants available</div>
    );

  const handleColorChange = (colorName: string) => {
    const variant = data.colorVariants.find((c) => c.colorName === colorName);
    if (variant) {
      dispatch(
        setColorSelection({
          name: variant.colorName,
          code: variant.colorCode,
          price: variant.price,
          images: variant.images,
        })
      );
      dispatch(setCurrentImageIndex(0));
    }
  };

  // Function to determine if checkmark should be white or black
  const getCheckColor = (bgColor: string) => {
    // Simple luminance check: dark background => white, light => black
    const c = bgColor.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186 ? "black" : "white";
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Select Colors
      </span>
      <div className="flex flex-wrap gap-3">
        {data.colorVariants.map((variant) => {
          const isSelected = selectedColor?.name === variant.colorName;
          return (
            <button
              key={variant.colorName}
              type="button"
              onClick={() => handleColorChange(variant.colorName)}
              className={cn(
                "relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black/20 flex items-center justify-center transition-all duration-200 hover:ring-2 hover:ring-offset-2 hover:ring-black",
                isSelected && "ring-2 ring-offset-2 ring-black"
              )}
              style={{ backgroundColor: variant.colorCode }}
            >
              {isSelected && (
                <Check
                  className={cn("text-base", getCheckColor(variant.colorCode))}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelection;
