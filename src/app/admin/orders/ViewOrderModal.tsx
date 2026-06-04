"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { OrderType } from "../../../../types/order";

interface ViewOrderModalProps {
  order: OrderType;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-600",
  PROCESSING: "text-orange-500",
  SHIPPED: "text-blue-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-600",
};

export default function ViewOrderModal({ order, onClose }: ViewOrderModalProps) {
  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Order Summary */}
          <section className="border rounded-md p-4">
            <h3 className="font-semibold mb-2">Order Information</h3>
            <div className="text-sm space-y-1">
              <p><strong>ID:</strong> {order.id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p>
                <strong>Order Status:</strong>{" "}
                <span className={`capitalize font-medium ${statusColors[order.status] ?? "text-gray-600"}`}>
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Payment:</strong>{" "}
                <span className={order.paymentStatus === "COMPLETED" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </section>

          {/* Customer */}
          <section className="border rounded-md p-4">
            <h3 className="font-semibold mb-2">Customer</h3>
            <div className="text-sm space-y-1">
              <p><strong>Name:</strong> {order.user.name ?? "—"}</p>
              <p><strong>Email:</strong> {order.user.email}</p>
              {order.phoneNumber && (
                <p><strong>Phone:</strong> {order.phoneNumber}</p>
              )}
            </div>
          </section>

          {/* Items */}
          <section className="border rounded-md p-4">
            <h3 className="font-semibold mb-3">Items</h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border rounded-md p-3 gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name ?? item.productId}</p>
                    {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                    {item.colorName && <p className="text-sm text-gray-500">Color: {item.colorName}</p>}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium whitespace-nowrap">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping */}
          <section className="border rounded-md p-4">
            <h3 className="font-semibold mb-2">Shipping</h3>
            <p className="text-sm">{order.shippingAddress}</p>
          </section>

          {/* Total */}
          <section className="border rounded-md p-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₦{order.totalAmount.toLocaleString()}</span>
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
