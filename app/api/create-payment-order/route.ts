import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay is not configured yet.",
        },
        { status: 503 }
      );
    }

    // Fetch trusted order total from Supabase
    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .select(
          "id, total_amount, payment_status, order_status"
        )
        .eq("id", Number(orderId))
        .single();

    if (orderError || !order) {
      console.error(
        "Order fetch error:",
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

    if (order.payment_status === "paid") {
      return NextResponse.json(
        {
          success: false,
          error: "Order is already paid.",
        },
        { status: 400 }
      );
    }

    const amount = Number(order.total_amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order amount.",
        },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret:
        process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentOrder =
      await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `order_${order.id}`,
        notes: {
          internal_order_id: String(order.id),
        },
      });

    // Store Razorpay order ID against our order
    const { error: updateError } =
      await supabaseAdmin
        .from("orders")
        .update({
          razorpay_order_id:
            paymentOrder.id,
        })
        .eq("id", order.id);

    if (updateError) {
      console.error(
        "Failed to save Razorpay order ID:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to prepare payment order.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(
      "Razorpay order creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create payment order.",
      },
      { status: 500 }
    );
  }
}