import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
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

    // Verify Supabase customer session
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

    // Fetch only orders belonging to
    // the verified customer's email.
    const {
      data: orders,
      error: ordersError,
    } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        customer_name,
        email,
        total_amount,
        payment_status,
        order_status,
        created_at
        `
      )
      .ilike("email", user.email)
      .eq("payment_status", "paid")
      .order("created_at", {
        ascending: false,
      });

    if (ordersError) {
      console.error(
        "Customer orders fetch error:",
        ordersError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load orders.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (error) {
    console.error(
      "Customer orders API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load orders.",
      },
      { status: 500 }
    );
  }
}