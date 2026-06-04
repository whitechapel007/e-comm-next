import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
}

// POST: Customer creates their own order
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: OrderPayload = await req.json();
  const { cartItems, totalAmount, shippingAddress, phoneNumber } = body;

  if (!Array.isArray(cartItems) || !cartItems.length) {
    return NextResponse.json(
      { error: "Cart items must be a non-empty array" },
      { status: 400 }
    );
  }

  if (typeof totalAmount !== "number" || totalAmount <= 0) {
    return NextResponse.json({ error: "Invalid total amount" }, { status: 400 });
  }

  if (!shippingAddress?.trim() || !phoneNumber?.trim()) {
    return NextResponse.json(
      { error: "Shipping address and phone number are required" },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
          shippingAddress,
          phoneNumber,
          status: "PENDING",
          paymentStatus: "PENDING",
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size ?? null,
          colorName: item.colorName ?? null,
        })),
      });

      return newOrder;
    });

    return NextResponse.json(
      { message: "Order created successfully", orderId: order.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET: Customer views their own orders
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderItems: {
          include: { product: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
