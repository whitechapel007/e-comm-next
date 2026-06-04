"use client";

import { useRouter } from "next/navigation";
import { addItem } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux";
import { RootState } from "@/store";
import { ProductType } from "../../../types/product";
import { toast } from "sonner";

interface AddToCartSectionProps {
  data: ProductType;
}

const AddToCartSection = ({ data }: AddToCartSectionProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { selectedSize, selectedColor, currentImage } = useAppSelector(
    (state: RootState) => state.product
  );

  const buildCartItem = () => ({
    productId: data.id,
    name: data.name,
    imageUrl: currentImage || data.images[0]?.url || "/placeholder.png",
    price: selectedColor?.price ?? data.basePrice,
    size: selectedSize ?? null,
    color: selectedColor?.name ?? null,
    discount: data.discount ?? null,
  });

  const handleAddToCart = () => {
    dispatch(addItem(buildCartItem()));
    toast.success(`${data.name} added to cart`);
  };

  const handleBuyNow = () => {
    dispatch(addItem(buildCartItem()));
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button
        type="button"
        onClick={handleAddToCart}
        className="flex-1 rounded-full h-11 md:h-[52px] text-sm sm:text-base font-medium transition-all border border-black bg-white text-black hover:bg-black hover:text-white"
      >
        Add to Cart
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        className="flex-1 rounded-full h-11 md:h-[52px] text-sm sm:text-base font-medium transition-all bg-black text-white hover:bg-black/80"
      >
        Buy Now
      </button>
    </div>
  );
};

export default AddToCartSection;
