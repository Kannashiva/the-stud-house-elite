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

    const numericOrderId = Number(orderId);

    if (
      !Number.isInteger(numericOrderId) ||
      numericOrderId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid order ID is required.",
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

    // Fetch trusted order details from Supabase
    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .select(
          `
          id,
          total_amount,
          payment_status,
          order_status,
          reservation_status,
          reservation_expires_at
          `
        )
        .eq("id", numericOrderId)
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

    // Do not create another payment for a paid order
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

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order amount.",
        },
        { status: 400 }
      );
    }

    /*
      If this order previously had a reservation
      that has already expired, release it first.

      If the reservation is still active,
      this function simply does nothing.
    */
    if (order.reservation_status === "reserved") {
      const { error: releaseError } =
        await supabaseAdmin.rpc(
          "release_order_reservation",
          {
            p_order_id: order.id,
          }
        );

      if (releaseError) {
        console.error(
          "Reservation cleanup error:",
          releaseError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to check the existing stock reservation.",
          },
          { status: 500 }
        );
      }
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret:
        process.env.RAZORPAY_KEY_SECRET,
    });

    /*
      Create Razorpay order.

      This does NOT charge the customer.
      It only prepares the payment order.
    */
    const paymentOrder =
      await razorpay.orders.create({
        amount: Math.round(
          amount * 100
        ),
        currency: "INR",
        receipt: `order_${order.id}`,
        notes: {
          internal_order_id: String(
            order.id
          ),
        },
      });

    // Store Razorpay order ID
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

    /*
      Reserve stock for this order.

      Default reservation duration:
      15 minutes.
    */
    const {
      error: reservationError,
    } = await supabaseAdmin.rpc(
      "reserve_order_stock",
      {
        p_order_id: order.id,
        p_reservation_minutes: 15,
      }
    );

    if (reservationError) {
      console.error(
        "Stock reservation error:",
        reservationError
      );

      const message =
        reservationError.message ||
        "Unable to reserve stock.";

      // Most likely another customer reserved/bought the stock
      if (
        message
          .toLowerCase()
          .includes(
            "insufficient available stock"
          )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Sorry, one or more items are no longer available in the requested quantity. Please refresh your cart.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to reserve the selected items. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentOrder,
      keyId:
        process.env.RAZORPAY_KEY_ID,

      reservation: {
        status: "reserved",
        durationMinutes: 15,
      },
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