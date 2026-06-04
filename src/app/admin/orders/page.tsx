"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2, Search, RefreshCw, ClipboardList,
  Clock, Package, Truck, CheckCircle2, XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

import { OrderType, OrderStatus } from "../../../../types/order";
import ViewOrderModal from "./ViewOrderModal";

// ── Badge styles ───────────────────────────────────────────────────────────

const STATUS_PILL: Record<OrderStatus, string> = {
  PENDING:           "bg-yellow-100 text-yellow-700",
  PROCESSING:        "bg-orange-100 text-orange-700",
  SHIPPED:           "bg-blue-100 text-blue-700",
  DELIVERED:         "bg-green-100 text-green-700",
  CANCELLED:         "bg-red-100 text-red-700",
  INITIATION_FAILED: "bg-gray-100 text-gray-600",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:           "Pending",
  PROCESSING:        "Processing",
  SHIPPED:           "Shipped",
  DELIVERED:         "Delivered",
  CANCELLED:         "Cancelled",
  INITIATION_FAILED: "Init Failed",
};

const PAYMENT_PILL: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  PENDING:   "bg-yellow-100 text-yellow-700",
  FAILED:    "bg-red-100 text-red-700",
  REFUNDED:  "bg-purple-100 text-purple-700",
};

const NEXT_STATUS: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  PENDING:    { label: "Mark Processing", status: "PROCESSING" },
  PROCESSING: { label: "Mark Shipped",    status: "SHIPPED"    },
  SHIPPED:    { label: "Mark Delivered",  status: "DELIVERED"  },
};

// ── Stat card ──────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, color,
}: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [updating, setUpdating]           = useState<string | null>(null);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<string>("ALL");

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json() as Promise<{ orders: OrderType[] }>;
    },
    retry: 1,
  });

  const orders = data?.orders ?? [];

  // Stats derived from the full list
  const stats = useMemo(() => ({
    total:      orders.length,
    pending:    orders.filter((o) => o.status === "PENDING").length,
    processing: orders.filter((o) => o.status === "PROCESSING").length,
    shipped:    orders.filter((o) => o.status === "SHIPPED").length,
    delivered:  orders.filter((o) => o.status === "DELIVERED").length,
  }), [orders]);

  // Client-side filter + search
  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== "ALL") {
      list = list.filter((o) => o.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o.shippingAddress?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, search]);

  const handleStatusUpdate = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update order");
      }
      toast.success(`Order marked as ${STATUS_LABEL[nextStatus]}`);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-red-500 font-medium">Failed to load orders.</p>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })}
        >
          Retry
        </Button>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders.length} total order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={isFetching}
          onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total"      value={stats.total}      icon={ClipboardList}  color="bg-slate-100 text-slate-600" />
        <StatCard label="Pending"    value={stats.pending}    icon={Clock}          color="bg-yellow-100 text-yellow-600" />
        <StatCard label="Processing" value={stats.processing} icon={Package}        color="bg-orange-100 text-orange-600" />
        <StatCard label="Shipped"    value={stats.shipped}    icon={Truck}          color="bg-blue-100 text-blue-600" />
        <StatCard label="Delivered"  value={stats.delivered}  icon={CheckCircle2}   color="bg-green-100 text-green-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-28">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((order) => {
                const next       = NEXT_STATUS[order.status];
                const isUpdating = updating === order.id;

                return (
                  <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">

                    {/* ID */}
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      <p className="font-medium text-sm leading-tight">
                        {order.user?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                    </TableCell>

                    {/* Total */}
                    <TableCell className="text-right font-semibold">
                      ₦{order.totalAmount?.toLocaleString()}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_PILL[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </TableCell>

                    {/* Payment */}
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_PILL[order.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.paymentStatus}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        day:   "numeric",
                        month: "short",
                        year:  "numeric",
                      })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View
                        </Button>
                        {next && (
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-black hover:bg-black/80 text-white"
                            disabled={isUpdating}
                            onClick={() => handleStatusUpdate(order.id, next.status)}
                          >
                            {isUpdating
                              ? <Loader2 className="h-3 w-3 animate-spin" />
                              : next.label}
                          </Button>
                        )}
                        {order.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                            disabled={isUpdating}
                            onClick={() => handleStatusUpdate(order.id, "CANCELLED")}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ClipboardList className="h-10 w-10 opacity-30" />
                    <p className="font-medium">
                      {search || statusFilter !== "ALL"
                        ? "No orders match your filters"
                        : "No orders yet"}
                    </p>
                    {(search || statusFilter !== "ALL") && (
                      <Button
                        variant="link"
                        className="text-xs"
                        onClick={() => { setSearch(""); setStatusFilter("ALL"); }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && filtered.length !== orders.length && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filtered.length} of {orders.length} orders
        </p>
      )}

      {/* Modal */}
      {selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={updating === selectedOrder.id}
        />
      )}
    </div>
  );
}
