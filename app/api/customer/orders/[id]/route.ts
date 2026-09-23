import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order ID.",
        },
        { status: 400 }
      );
    }

    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const accessToken =
      authorization.replace("Bearer ", "");

    // Verify logged-in Supabase customer
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(
      accessToken
    );

    if (
      userError ||
      !user ||
      !user.email
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired session.",
        },
        { status: 401 }
      );
    }

    // Fetch only if this order belongs
    // to the verified customer's email
    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        customer_name,
        mobile,
        email,
        address,
        city,
        state,
        pincode,
        landmark,
        total_amount,
        payment_status,
        order_status,
        razorpay_payment_id,
        created_at
        `
      )
      .eq("id", orderId)
      .ilike("email", user.email)
      .eq("payment_status", "paid")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order not found or you do not have access to this order.",
        },
        { status: 404 }
      );
    }

    const {
      data: items,
      error: itemsError,
    } = await supabaseAdmin
      .from("order_items")
      .select(
        `
        id,
        product_id,
        product_name,
        price,
        quantity
        `
      )
      .eq("order_id", order.id)
      .order("id", {
        ascending: true,
      });

    if (itemsError) {
      console.error(
        "Customer order items error:",
        itemsError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load order items.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
      items: items || [],
    });
  } catch (error) {
    console.error(
      "Customer order details API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load order details.",
      },
      { status: 500 }
    );
  }
}