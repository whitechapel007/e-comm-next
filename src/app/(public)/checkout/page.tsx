"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const cart = useSelector((state: RootState) => state.cart.items);

  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function nairaToKobo(amount: number) {
    return (amount * 100).toFixed(0);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
      // Create order
      const orderRes = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cart,
          totalAmount,
          shippingAddress: `${data.address}, ${data.city}`,
          phoneNumber: data.phoneNumber,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok)
        throw new Error(orderData.message || "Order creation failed");

      // Initialize payment
      const paymentRes = await fetch("/api/admin/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          amount: nairaToKobo(totalAmount),
          orderId: orderData.orderId,
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok)
        throw new Error(paymentData.message || "Payment initialization failed");

      // Redirect or open payment gateway

      if (typeof window !== "undefined" && window.PaystackPop) {
        const paystack = new window.PaystackPop();
        paystack.resumeTransaction(paymentData.authorization.access_code);

        console.log("here");
      } else {
        setErrorMessage(
          "Payment system not ready. Please refresh and try again."
        );
      }
      console.log("Payment initialized:", paymentData);
    } catch (err) {
      if (err instanceof Error)
        setErrorMessage(err.message || "Something went wrong during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Prevent SSR hydration mismatch
  if (!isMounted || status === "loading") return null;

  if (!cart.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground max-w-sm">
          Add items to your cart to proceed to checkout.
        </p>
        <Link href="/shop">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto max-w-md p-4">
      <Card className="shadow-md rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
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
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city" {...field} />
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
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="font-medium">
                Total: ₦{totalAmount.toLocaleString()}
              </p>

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isProcessing || !cart.length}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Checkout"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
