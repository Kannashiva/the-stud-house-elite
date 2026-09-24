import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmationEmail } from "../../../lib/sendOrderConfirmationEmail";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Webhook secret is not configured.",
        },
        { status: 503 }
      );
    }

    const rawBody = await request.text();

    const signature =
      request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing webhook signature.",
        },
        { status: 400 }
      );
    }

    const expectedSignature = createHmac(
      "sha256",
      webhookSecret
    )
      .update(rawBody)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer =
      Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !==
        expectedBuffer.length ||
      !timingSafeEqual(
        signatureBuffer,
        expectedBuffer
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook signature.",
        },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);

    if (
      event.event !== "payment.captured" &&
      event.event !== "order.paid"
    ) {
      return NextResponse.json({
        success: true,
        message: "Event ignored.",
      });
    }

    const payment =
      event.payload?.payment?.entity;

    const razorpayOrderId =
      payment?.order_id;

    const razorpayPaymentId =
      payment?.id;

    if (
      !razorpayOrderId ||
      !razorpayPaymentId
    ) {
      return NextResponse.json({
        success: true,
        message:
          "Payment information missing.",
      });
    }

    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .select(
          "id, payment_status, razorpay_order_id"
        )
        .eq(
          "razorpay_order_id",
          razorpayOrderId
        )
        .single();

    if (orderError || !order) {
      console.error(
        "Webhook order lookup failed:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    if (
  order.payment_status === "paid"
) {
  await sendOrderConfirmationEmail(
    order.id
  );

  return NextResponse.json({
    success: true,
    message: "Order already finalized.",
  });
}

    const { error: finalizeError } =
      await supabaseAdmin.rpc(
        "finalize_paid_order",
        {
          p_order_id: order.id,
          p_razorpay_order_id:
            razorpayOrderId,
          p_razorpay_payment_id:
            razorpayPaymentId,
        }
      );

    if (finalizeError) {
      console.error(
        "Webhook finalization failed:",
        finalizeError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to finalize payment.",
        },
        { status: 500 }
      );
    }
const emailResult =
  await sendOrderConfirmationEmail(
    order.id
  );

if (!emailResult.success) {
  console.error(
    "Webhook finalized order but confirmation email could not be sent."
  );
}
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Razorpay webhook error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}