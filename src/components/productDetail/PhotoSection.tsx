"use client";

import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/lib/redux";
import { RootState } from "@/store";
import { setCurrentImageIndex, setCurrentImage } from "@/store/productSlice";
import { useEffect } from "react";
import { ProductType } from "../../../types/product";

const PhotoSection = ({ data }: { data: ProductType }) => {
  const dispatch = useAppDispatch();
  const { selectedColor, currentImageIndex } = useAppSelector(
    (state: RootState) => state.product
  );

  // Determine current color variant
  const currentColorVariant = selectedColor?.name
    ? data.colorVariants.find(
        (variant) => variant.colorName === selectedColor.name
      )
    : data.colorVariants[0];

  // Use images from selected color variant or fallback to product images
  const currentImages = currentColorVariant?.images?.length
    ? currentColorVariant.images.map((img) => img.url)
    : data.images.map((img) => img.url);

  // Current image to display
  const currentImage =
    currentImages[currentImageIndex] || currentImages[0] || "";

  // Update Redux current image
  useEffect(() => {
    if (currentImage) dispatch(setCurrentImage(currentImage));
  }, [currentImage, dispatch]);

  // Reset image index when color changes
  useEffect(() => {
    dispatch(setCurrentImageIndex(0));
  }, [selectedColor, dispatch]);

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-4">
      {/* Thumbnail Gallery */}
      <div className="flex lg:flex-col gap-3 w-full lg:w-fit items-center justify-center lg:justify-start">
        {currentImages.length
          ? currentImages.map((url, idx) => (
              <button
                key={`${currentColorVariant?.id || "default"}-${idx}`}
                type="button"
                aria-label={`View image ${idx + 1} of ${currentImages.length}`}
                className={`bg-[#F0EEED] rounded-lg xl:rounded-[20px] aspect-square w-full max-w-[111px] xl:max-w-[152px] max-h-[106px] xl:max-h-[167px] overflow-hidden transition-all duration-300 ${
                  currentImageIndex === idx
                    ? "ring-2 ring-black ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-300"
                }`}
                onClick={() => dispatch(setCurrentImageIndex(idx))}
              >
                <Image
                  src={url}
                  alt={`${data.name} - View ${idx + 1}`}
                  width={152}
                  height={167}
                  className="w-full h-full object-cover rounded-md hover:scale-110 transition-transform duration-500"
                  priority={idx === 0}
                />
              </button>
            ))
          : // Skeleton placeholders
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-200 animate-pulse rounded-lg xl:rounded-[20px] w-full max-w-[111px] xl:max-w-[152px] max-h-[106px] xl:max-h-[167px] aspect-square"
              />
            ))}
      </div>

      {/* Main Image */}
      <div className="flex items-center justify-center bg-[#F0EEED] rounded-lg sm:rounded-[20px] w-full sm:w-96 md:w-full mx-auto h-full max-h-[530px] min-h-[330px] lg:min-h-[380px] xl:min-h-[530px] overflow-hidden mb-3 lg:mb-0">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={`${data.name}${
              currentColorVariant ? ` - ${currentColorVariant.colorName}` : ""
            }`}
            width={444}
            height={530}
            className="w-full h-full object-cover rounded-md hover:scale-110 transition-transform duration-500"
            priority
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No image available
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoSection;
