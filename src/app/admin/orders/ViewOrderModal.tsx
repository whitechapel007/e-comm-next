"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { OrderType } from "../../../../types/order"; // adjust path

interface ViewOrderModalProps {
  order: OrderType;
  onClose: () => void;
}

export default function ViewOrderModal({
  order,
  onClose,
}: ViewOrderModalProps) {
  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Order Details</span>
          </DialogTitle>
        </DialogHeader>

        {/* Order Info */}
        <div className="mt-4 space-y-6">
          {/* Order Summary */}
          <section className="border rounded-md p-4">
            <h3 className="font-semibold mb-2">Order Information</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>ID:</strong> {order.id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{order.status}</span>
              </p>
            </div>
          </section>

          {/* Customer */}
          <section className="border rounded-md p-4">
            <h3 className="font-semibold mb-2">Customer</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Name:</strong> {order.user.email}
              </p>
              <p>
                <strong>Email:</strong> {order.user.email}
              </p>
              {order.phoneNumber && (
                <p>
                  <strong>Phone:</strong> {order.phoneNumber}
                </p>
              )}
            </div>
          </section>

          {/* Items */}
          <section className="border rounded-md p-4">
            <h3 className="font-semibold mb-3">Items</h3>

            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border rounded-md p-2"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600">
                        Size: {item.selectedSize}
                      </p>
                    )}
                    {item.selectedColor && (
                      <p className="text-sm text-gray-600">
                        Color: {item.selectedColor}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      ₦{item.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping */}
          <section className="border rounded-md p-4">
            <h3 className="font-semibold mb-2">Shipping Details</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Address:</strong> {order.shippingAddress}
              </p>
            </div>
          </section>

          {/* Payment */}
          <section className="border rounded-md p-4">
            <h3 className="font-semibold mb-2">Payment Summary</h3>

            <div className="text-sm">
              <div className="flex justify-between py-1">
                <span>Subtotal:</span>
                {/* <span>₦{order.totalAmount.toLocaleString()}</span> */}
              </div>
              <div className="flex justify-between py-1">
                <span>Shipping:</span>
                {/* <span>₦{order.shippingFee.toLocaleString()}</span> */}
              </div>

              {order.discountTotal ? (
                <div className="flex justify-between py-1 text-green-600">
                  <span>Discount:</span>
                  <span>-₦{order.discountTotal.toLocaleString()}</span>
                </div>
              ) : null}

              <hr className="my-2" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₦{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
