import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Disable body parser – webhook requires raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text(); // MUST use raw body for signature validation
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error("Missing PAYSTACK_SECRET_KEY");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    // Validate signature (important!)
    const expectedSignature = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Invalid Paystack signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Extract Paystack event details
    const { event: eventType, data } = event;

    if (!data?.reference) {
      console.error("Webhook missing reference");
      return NextResponse.json({ status: "ignored" });
    }

    const reference = data.reference;
    const orderId = data.metadata?.orderId;

    if (!orderId) {
      console.error("Webhook missing metadata.orderId");
      return NextResponse.json({ status: "ignored" });
    }

    // ----------------------------------------------------------------------
    // STEP 1 — Check if webhook already processed (avoid double processing)
    // ----------------------------------------------------------------------
    const existingTransaction = await prisma.transaction.findUnique({
      where: { transactionRef: reference },
    });

    if (!existingTransaction) {
      console.error("Webhook: Transaction not found in DB:", reference);
      return NextResponse.json({ status: "ignored" });
    }

    if (existingTransaction.status === "COMPLETED") {
      // Already processed — respond safely
      return NextResponse.json({ status: "already_processed" });
    }

    // ----------------------------------------------------------------------
    // STEP 2 — Handle Paystack Events
    // ----------------------------------------------------------------------

    if (eventType === "charge.success") {
      console.log("💰 Payment success webhook for:", reference);

      // Update transaction
      await prisma.transaction.update({
        where: { transactionRef: reference },
        data: {
          status: "COMPLETED",
          metadata: data,
        },
      });

      // Update order
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "COMPLETED",
          status: "PROCESSING",
        },
      });

      return NextResponse.json({ status: "payment_confirmed" });
    }

    if (eventType === "charge.failed") {
      console.log("❌ Payment failed webhook for:", reference);

      await prisma.transaction.update({
        where: { transactionRef: reference },
        data: {
          status: "FAILED",
          metadata: data,
        },
      });

      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "FAILED",
          status: "CANCELLED",
        },
      });

      return NextResponse.json({ status: "payment_failed" });
    }

    // Unhandled events
    console.log("⚠️ Unhandled Paystack webhook:", eventType);

    return NextResponse.json({ status: "ignored" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
