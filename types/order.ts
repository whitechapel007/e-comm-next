// types/order.ts

import { ProductType } from "./product";

// --------------------------------------------------
// Order Item
// --------------------------------------------------
export interface OrderItem {
  id: string;
  product: ProductType;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  price: number; // final price per item after discount
  subtotal: number; // quantity * price
  imageUrl?: string;
  name: string;
}

// --------------------------------------------------
// Customer Info
// --------------------------------------------------
export interface CustomerInfo {
  id: string;
  name: string;

  email: string;
  phone?: string;
  role?: "CUSTOMER" | "ADMIN";
}

// --------------------------------------------------
// Shipping Details
// --------------------------------------------------
export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  state: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface ShippingInfo {
  method: string; // e.g., "Standard", "Express"
  cost: number;
  address: ShippingAddress;
}

// --------------------------------------------------
// Payment Details
// --------------------------------------------------
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod =
  | "card"
  | "bank_transfer"
  | "pay_on_delivery"
  | "wallet";

// --------------------------------------------------
// Order Status
// --------------------------------------------------
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// --------------------------------------------------
// Main Order Type
// --------------------------------------------------
export interface OrderType {
  id: string;
  orderNumber: string;
  phoneNumber: string;
  orderItems: OrderItem[];
  user: CustomerInfo;

  totalAmount: number;
  subTotal: number;
  shippingFee: number;
  discountTotal?: number;

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  shippingAddress: string;
  status: OrderStatus;

  createdAt: string;
  updatedAt?: string;
}
