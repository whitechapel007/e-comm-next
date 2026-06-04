"use client";

import { useAppSelector, useAppDispatch } from "@/lib/redux";
import { RootState } from "@/store";
import { clearCart } from "@/store/cartSlice";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const schema = z.object({
  address:     z.string().min(5, "Enter a full address"),
  city:        z.string().min(2, "Enter your city"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
});

type FormData = z.infer<typeof schema>;

function nairaToKobo(amount: number): number {
  return Math.round(amount * 100);
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const dispatch   = useAppDispatch();
  const cart       = useAppSelector((state: RootState) => state.cart.items);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Compute totals the same way the cart page does — use real per-item discounts
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = cart.reduce((sum, item) => {
    const pct = item.discount ?? 0;
    return sum + (item.price * item.quantity * pct) / 100;
  }, 0);
  const totalAmount = Math.round((subtotal - discountAmount) * 100) / 100; // kobo-safe rounding

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { address: "", city: "", phoneNumber: "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.email) {
      setErrorMessage("You must be logged in to checkout.");
      return;
    }
    if (!cart.length) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // 1. Create order
      const orderRes = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems:       cart,
          totalAmount,
          shippingAddress: `${data.address}, ${data.city}`,
          phoneNumber:     data.phoneNumber,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. Initialise Paystack payment
      const paymentRes = await fetch("/api/admin/payments/initialize", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:   session.user.email,
          amount:  nairaToKobo(totalAmount),
          orderId: orderData.orderId,
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData.error || "Payment initialization failed");

      // 3. Open Paystack popup
      if (typeof window !== "undefined" && window.PaystackPop) {
        // Clear cart optimistically — order is placed and payment popup is opening
        dispatch(clearCart());

        const paystack = new window.PaystackPop();
        paystack.resumeTransaction(paymentData.authorization.access_code);

        toast.success("Order placed! Complete your payment in the popup.");
      } else {
        setErrorMessage("Payment system not ready. Please refresh and try again.");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Show spinner while session loads — avoids blank flash and hydration mismatch
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] space-y-4 text-center px-4">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground max-w-sm">
          Add items to your cart to proceed to checkout.
        </p>
        <Button asChild>
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg p-4 py-8">
      <Card className="shadow-md rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Order summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({cart.length} item{cart.length !== 1 ? "s" : ""})</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₦{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1 border-t">
              <span>Total</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Input placeholder="House number and street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City / State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Lagos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 08012345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  `Pay ₦${totalAmount.toLocaleString()}`
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
