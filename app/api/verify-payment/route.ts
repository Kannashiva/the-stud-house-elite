import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay is not configured yet.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();

    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing payment details.",
        },
        { status: 400 }
      );
    }

    const generatedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed.",
        },
        { status: 400 }
      );
    }

    const { error: finalizeError } = await supabaseAdmin.rpc(
  "finalize_paid_order",
  {
    p_order_id: Number(orderId),
    p_razorpay_order_id: razorpay_order_id,
    p_razorpay_payment_id: razorpay_payment_id,
  }
);

if (finalizeError) {
  console.error("Order finalization failed:", finalizeError);

  return NextResponse.json(
    {
      success: false,
      error: finalizeError.message,
    },
    { status: 500 }
  );
}

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}