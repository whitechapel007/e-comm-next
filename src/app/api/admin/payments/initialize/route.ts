import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, amount, orderId } = await req.json();

    if (!email || !amount || !orderId) {
      return NextResponse.json(
        { error: "email, amount, and orderId are required" },
        { status: 400 }
      );
    }


    const payload = {
      email,
      amount: String(amount), // Paystack expects string
      reference: `order_${orderId}_${Date.now()}`,
      metadata: { orderId },
    };

    // EXACT equivalent of Paystack's HTTPS request in their docs
    console.log("secret", process.env.PAYSTACK_SECRET_KEY);
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result }, { status: response.status });
    }

    // Save transaction into DB (optional but recommended)
    await prisma.transaction.create({
      data: {
        orderId,
        transactionRef: payload.reference,
        accessCode: result.data.access_code,
        status: "PENDING",
        metadata: result.data,
        amount: Number(amount),
        currency: "NGN",
        paymentMethod: "paystack",
        channel: "online",
      },
    });

    // Same as console.log(JSON.parse(data)) in the Node example
    return NextResponse.json({
      status: "success",
      authorization: result.data, // contains access_code and authorization_url
    });
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
