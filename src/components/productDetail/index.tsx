"use client";

import PhotoSection from "./PhotoSection";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCartSection from "./AddToCartSection";
import RenderStars from "../ui/RenderStars";
import { ProductType as Product } from "../../../types/product";
import { cn } from "@/lib/utils";

const ProductDetail = ({ data }: { data: Product }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
      {/* Product Images */}
      <PhotoSection data={data} />

      {/* Product Info */}
      <div className="flex flex-col">
        {/* Product Name */}
        <h1
          className={cn(
            "text-2xl md:text-4xl font-bold capitalize mb-3 md:mb-4"
          )}
        >
          {data.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <RenderStars rating={data.rating} />
          <span className="ml-3 text-sm sm:text-base text-black/60">
            {data.rating.toFixed(1)}/5
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl sm:text-3xl font-bold text-black">
            ${data.basePrice.toFixed(2)}
          </span>
          {data.prevPrice && (
            <span className="text-gray-400 line-through text-base sm:text-lg">
              ${data.prevPrice.toFixed(2)}
            </span>
          )}
          {data.discount && (
            <span className="bg-pink-100 text-pink-600 px-2 py-1 text-xs rounded-full font-medium">
              {data.discount}% OFF
            </span>
          )}
        </div>

        {/* Category */}
        <div className="flex items-center mb-4 space-x-2">
          <span className="text-sm sm:text-base text-black/60 font-medium">
            Category:
          </span>
          <span className="text-sm sm:text-base text-black font-semibold">
            {data.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-black/70 mb-5">
          {data.description}
        </p>

        <hr className="border-t-black/10 mb-5" />

        {/* Color Selection */}
        <ColorSelection data={data} />

        <hr className="border-t-black/10 my-5" />

        {/* Size Selection */}
        <SizeSelection data={data} />

        <hr className="hidden md:block border-t-black/10 my-5" />

        {/* Add to Cart & Buy Now */}
        <AddToCartSection data={data} />
      </div>
    </div>
  );
};

export default ProductDetail;
