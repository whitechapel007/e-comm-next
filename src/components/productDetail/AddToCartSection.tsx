"use client";

import { useRouter } from "next/navigation";
import { addItem } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux";
import { RootState } from "@/store";
import { ProductType } from "../../../types/product";

interface BuyNowBtnProps {
  data: ProductType;
}

const BuyNowBtn = ({ data }: BuyNowBtnProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { selectedSize, selectedColor, currentImage } = useAppSelector(
    (state: RootState) => state.product
  );

  // const isDisabled = !selectedSize || !selectedColor;

  const handleBuyNow = () => {
    // if (isDisabled) return;

    // Add the item to cart
    dispatch(
      addItem({
        productId: data.id,
        name: data.name,
        imageUrl: currentImage ?? "/placeholder.png",
        price: data.basePrice,
        attributes: [selectedColor?.name ?? "", selectedSize ?? ""],
        discount: String(data.discount ?? 0),
      })
    );

    // Redirect to checkout page
    router.push("/checkout");
  };

  return (
    <button
      type="button"
      className={`w-full rounded-full h-11 md:h-[52px] text-sm sm:text-base font-medium transition-all bg-indigo-600 text-white hover:bg-indigo-700
        disabled:bg-gray-300 disabled:cursor-not-allowed
      `}
      onClick={handleBuyNow}
    >
      Buy Now
    </button>
  );
};

export default BuyNowBtn;
