"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderType, OrderStatus } from "../../../../types/order";
import ViewOrderModal from "./ViewOrderModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const STATUS_BADGE: Record<OrderStatus, React.ReactNode> = {
  PENDING:           <span className="text-yellow-600 font-medium">Pending</span>,
  PROCESSING:        <span className="text-orange-500 font-medium">Processing</span>,
  SHIPPED:           <span className="text-blue-600 font-medium">Shipped</span>,
  DELIVERED:         <span className="text-green-600 font-medium">Delivered</span>,
  CANCELLED:         <span className="text-red-600 font-medium">Cancelled</span>,
  INITIATION_FAILED: <span className="text-gray-500 font-medium">Init Failed</span>,
};

const NEXT_STATUS: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  PENDING:    { label: "Mark Processing", status: "PROCESSING" },
  PROCESSING: { label: "Mark Shipped",    status: "SHIPPED"    },
  SHIPPED:    { label: "Mark Delivered",  status: "DELIVERED"  },
};

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [updating, setUpdating]           = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json() as Promise<{ orders: OrderType[] }>;
    },
    retry: 1,
  });

  const orders = data?.orders ?? [];

  const handleStatusUpdate = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update order");
      }
      toast.success(`Order marked as ${nextStatus.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500 mt-10">Failed to load orders.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const next = NEXT_STATUS[order.status];
                const isUpdating = updating === order.id;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}…</TableCell>
                    <TableCell>{order.user?.name ?? order.user?.email}</TableCell>
                    <TableCell>₦{order.totalAmount?.toLocaleString()}</TableCell>
                    <TableCell>{STATUS_BADGE[order.status] ?? order.status}</TableCell>
                    <TableCell>
                      <span className={order.paymentStatus === "COMPLETED" ? "text-green-600 text-xs font-medium" : "text-yellow-600 text-xs font-medium"}>
                        {order.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </Button>
                      {next && (
                        <Button
                          size="sm"
                          variant="default"
                          disabled={isUpdating}
                          onClick={() => handleStatusUpdate(order.id, next.status)}
                        >
                          {isUpdating
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : next.label}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No orders yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
