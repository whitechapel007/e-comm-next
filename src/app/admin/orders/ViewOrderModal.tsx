"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Loader2, Copy, Check, MapPin, Phone, Mail, User } from "lucide-react";
import { useState } from "react";
import { OrderType, OrderStatus } from "../../../../types/order";

interface ViewOrderModalProps {
  order: OrderType;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  isUpdating: boolean;
}

const TIMELINE: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_COLOR: Record<OrderStatus, { dot: string; text: string; bg: string }> = {
  PENDING:           { dot: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50" },
  PROCESSING:        { dot: "bg-orange-400", text: "text-orange-700", bg: "bg-orange-50" },
  SHIPPED:           { dot: "bg-blue-400",   text: "text-blue-700",   bg: "bg-blue-50"   },
  DELIVERED:         { dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50"  },
  CANCELLED:         { dot: "bg-red-400",    text: "text-red-700",    bg: "bg-red-50"    },
  INITIATION_FAILED: { dot: "bg-gray-400",   text: "text-gray-600",   bg: "bg-gray-50"   },
};

const NEXT_STATUS: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  PENDING:    { label: "Mark as Processing", status: "PROCESSING" },
  PROCESSING: { label: "Mark as Shipped",    status: "SHIPPED"    },
  SHIPPED:    { label: "Mark as Delivered",  status: "DELIVERED"  },
};

export default function ViewOrderModal({
  order,
  onClose,
  onStatusUpdate,
  isUpdating,
}: ViewOrderModalProps) {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timelineIndex  = TIMELINE.indexOf(order.status);
  const isCancelled    = order.status === "CANCELLED" || order.status === "INITIATION_FAILED";
  const next           = NEXT_STATUS[order.status];
  const statusStyle    = STATUS_COLOR[order.status] ?? STATUS_COLOR.PENDING;
  const itemCount      = order.orderItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0">

        {/* Top header strip */}
        <div className={`px-6 pt-6 pb-4 ${statusStyle.bg} rounded-t-lg`}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-3">
              <span className="text-lg font-bold">Order Details</span>
              <button
                onClick={copyId}
                className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-black transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                #{order.id.slice(0, 12).toUpperCase()}
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text} border border-current/20`}>
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
              {order.status.replace("_", " ")}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              order.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-700" :
              order.paymentStatus === "FAILED"    ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              Payment: {order.paymentStatus}
            </span>
            <span className="text-sm text-muted-foreground ml-auto">
              {new Date(order.createdAt).toLocaleString("en-NG", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Order timeline */}
          {!isCancelled && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Order Progress
              </p>
              <div className="flex items-center gap-0">
                {TIMELINE.map((step, idx) => {
                  const done    = idx <= timelineIndex;
                  const current = idx === timelineIndex;
                  const last    = idx === TIMELINE.length - 1;
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          current ? "border-black bg-black text-white scale-110" :
                          done    ? "border-black bg-black/10 text-black" :
                                    "border-gray-200 bg-white text-gray-300"
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-xs mt-1 whitespace-nowrap ${done ? "text-black font-medium" : "text-gray-400"}`}>
                          {step.charAt(0) + step.slice(1).toLowerCase()}
                        </span>
                      </div>
                      {!last && (
                        <div className={`flex-1 h-0.5 mb-4 mx-1 ${idx < timelineIndex ? "bg-black" : "bg-gray-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 font-medium">
              This order has been {order.status === "CANCELLED" ? "cancelled" : "flagged as failed"}.
            </div>
          )}

          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Customer</p>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">{order.user.name ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{order.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{order.phoneNumber ?? "—"}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Delivery Address</p>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="leading-relaxed">{order.shippingAddress}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Items ({itemCount} piece{itemCount !== 1 ? "s" : ""})
            </p>
            <div className="border rounded-xl overflow-hidden divide-y">
              {order.orderItems.map((item, idx) => (
                <div key={item.id ?? idx} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.product?.name ?? "Product"}
                    </p>
                    <div className="flex gap-3 mt-0.5">
                      {item.colorName && (
                        <span className="text-xs text-muted-foreground">Color: {item.colorName}</span>
                      )}
                      {item.size && (
                        <span className="text-xs text-muted-foreground">Size: {item.size}</span>
                      )}
                      <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-semibold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">₦{item.price.toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-black text-white rounded-xl px-5 py-4 flex items-center justify-between">
            <span className="font-semibold">Order Total</span>
            <span className="text-xl font-bold">₦{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Footer actions */}
        <DialogFooter className="px-6 py-4 flex flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:mr-auto">
            Close
          </Button>
          {order.status === "PENDING" && (
            <Button
              variant="destructive"
              disabled={isUpdating}
              onClick={() => { onStatusUpdate(order.id, "CANCELLED"); onClose(); }}
            >
              Cancel Order
            </Button>
          )}
          {next && (
            <Button
              className="bg-black hover:bg-black/80 text-white"
              disabled={isUpdating}
              onClick={() => { onStatusUpdate(order.id, next.status); onClose(); }}
            >
              {isUpdating
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating…</>
                : next.label}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
