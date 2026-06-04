import { ProductType } from "./product";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Pick<ProductType, "id" | "name" | "slug">;
  quantity: number;
  colorName: string | null;
  size: string | null;
  price: number;
  createdAt: string;
}

export interface OrderUser {
  id: string;
  name: string | null;
  email: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "INITIATION_FAILED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface OrderType {
  id: string;
  userId: string;
  user: OrderUser;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentRef: string | null;
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
