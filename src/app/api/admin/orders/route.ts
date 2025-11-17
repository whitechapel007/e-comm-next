import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid"; // to generate unique paymentRef

interface OrderItemPayload {
  productId: string;
  quantity: number;
  price: number;
  size?: string | null;
  colorName?: string | null;
}

interface OrderPayload {
  cartItems: OrderItemPayload[];
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  paymentRef?: string; // optional, will auto-generate if missing
}

// Helper: validate admin session
async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw { status: 401, message: "Unauthorized" };
  if (session.user.role !== "ADMIN")
    throw { status: 403, message: "Forbidden, admin only" };
  return session;
}

// POST: Create a new order
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    const {
      cartItems,
      totalAmount,
      shippingAddress,
      phoneNumber,
      paymentRef,
    }: OrderPayload = await req.json();

    if (!Array.isArray(cartItems) || !cartItems.length)
      return NextResponse.json(
        { error: "Cart items must be a non-empty array" },
        { status: 400 }
      );

    if (typeof totalAmount !== "number")
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );

    // Ensure unique paymentRef
    const uniquePaymentRef = paymentRef || nanoid(12);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        shippingAddress,
        phoneNumber,
        paymentRef: uniquePaymentRef,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
    });

    // Create order items
    const orderItemsData = cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      size: item.size ?? null,
      colorName: item.colorName ?? null,
    }));

    await prisma.orderItem.createMany({ data: orderItemsData });

    return NextResponse.json(
      { message: "Order created successfully", orderId: order.id },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ err }, { status: 500 });
  }
}

// GET: Retrieve all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) console.error("Get orders error:", err);

    return NextResponse.json({ err }, { status: 500 });
  }
}
