"use client";

import { useAppSelector } from "@/lib/redux";
import { RootState } from "@/store";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CartIcon = () => {
  const { totalQuantity } = useAppSelector((state: RootState) => state.cart);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link href="/cart" className="relative p-1">
      <ShoppingCart />
      {mounted && totalQuantity > 0 && (
        <span className="border bg-black text-white rounded-full px-1 text-xs absolute -top-3 left-1/2 -translate-x-1/2">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
