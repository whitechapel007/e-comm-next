"use client";

import { useAppSelector } from "@/lib/redux";
import { RootState } from "@/store";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
const CartIcon = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const { totalQuantity } = useAppSelector((state: RootState) => state.cart);

  if (!isClient) return null; // prevents SSR mismatch
  return (
    <Link href="/cart" className="relative  p-1">
      <ShoppingCart />
      {totalQuantity > 0 && (
        <span className="border bg-black text-white rounded-full w-fit-h-fit px-1 text-xs absolute -top-3 left-1/2 -translate-x-1/2">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
