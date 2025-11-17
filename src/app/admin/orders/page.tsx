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
import { OrderType } from "../../../../types/order"; // adjust path
import ViewOrderModal from "./ViewOrderModal"; // modal to view order details
import { useQuery } from "@tanstack/react-query";

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json() as Promise<{ orders: OrderType[] }>;
    },
    retry: false,
  });

  const orders = data?.orders || [];
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-yellow-600 font-medium">Pending</span>;
      case "shipped":
        return <span className="text-blue-600 font-medium">Shipped</span>;
      case "delivered":
        return <span className="text-green-600 font-medium">Delivered</span>;
      case "cancelled":
        return <span className="text-red-600 font-medium">Cancelled</span>;
      default:
        return <span className="text-gray-600 font-medium">{status}</span>;
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading orders, please wait...</p>;
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
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.length > 0 ? (
              orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order?.user?.name}</TableCell>
                  <TableCell>₦{order?.totalAmount?.toLocaleString()}</TableCell>
                  <TableCell>{statusBadge(order?.status)}</TableCell>
                  <TableCell>
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </Button>
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => console.log("Mark as shipped", order.id)}
                      >
                        Mark Shipped
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No orders available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
