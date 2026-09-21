import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getExpectedSessionToken() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminEmail || !sessionSecret) {
    return null;
  }

  return createHmac("sha256", sessionSecret)
    .update(adminEmail)
    .digest("hex");
}

async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const session = cookieStore.get("admin_session")?.value;
  const expectedToken = getExpectedSessionToken();

  return Boolean(
    session &&
      expectedToken &&
      session === expectedToken
  );
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          price,
          quantity
        )
      `)
      .eq("id", Number(id))
      .single();

    if (error || !order) {
      console.error("Load order error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Admin order GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load order.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const { order_status } = body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(order_status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order status.",
        },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update({
        order_status,
      })
      .eq("id", Number(id))
      .select()
      .single();

    if (error || !order) {
      console.error("Update order status error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error?.message || "Unable to update order.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Admin order PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update order status.",
      },
      { status: 500 }
    );
  }
}