"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/lib/redux";
import { RootState } from "@/store";
import { removeItem, updateQuantity } from "@/store/cartSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, Tag } from "lucide-react";

export default function CartPage() {
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const dispatch = useAppDispatch();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center"
      >
        <div className="bg-muted rounded-full p-6 shadow-inner">
          <ShoppingCart size={60} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground max-w-md">
          Looks like you haven’t added anything yet. Start shopping and fill
          your cart with something amazing.
        </p>
        <Link href="/shop">
          <Button className="mt-4">Start Shopping</Button>
        </Link>
      </motion.div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight"
      >
        Your Cart
      </motion.h1>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 space-y-4"
        >
          {cart.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-muted shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">
                    {item.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dispatch(removeItem(item.productId))}
                    className="text-red-500 hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>

                <CardContent className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-md object-cover border"
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Product ID: {item.productId}
                      </p>
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">
                      Qty:
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          updateQuantity({
                            productId: item.productId,
                            quantity: Number(e.target.value),
                          })
                        )
                      }
                      className="w-20 text-center"
                      aria-label="Update quantity"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="text-lg font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="p-6 shadow-md border-muted">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount (-7%)</span>
                <span className="text-red-500 font-semibold">
                  -${(total * 0.07).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(total - total * 0.07).toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-6 flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Add promo code" className="pl-8" />
              </div>
              <Button variant="outline">Apply</Button>
            </div>

            {/* Checkout */}
            <Link href="/checkout">
              <Button
                className="w-full mt-6 text-base font-semibold py-6"
                size="lg"
              >
                Go to Checkout →
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
