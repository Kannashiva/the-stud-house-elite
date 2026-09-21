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

export async function GET() {
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

    const [
      productsResult,
      ordersResult,
      pendingOrdersResult,
      paidOrdersResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("products")
        .select("id, stock"),

      supabaseAdmin
        .from("orders")
        .select("id"),

      supabaseAdmin
        .from("orders")
        .select("id")
        .eq("order_status", "pending"),

      supabaseAdmin
        .from("orders")
        .select("total_amount")
        .eq("payment_status", "paid"),
    ]);

    if (
      productsResult.error ||
      ordersResult.error ||
      pendingOrdersResult.error ||
      paidOrdersResult.error
    ) {
      console.error("Dashboard query error:", {
        products: productsResult.error,
        orders: ordersResult.error,
        pending: pendingOrdersResult.error,
        paid: paidOrdersResult.error,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load dashboard data.",
        },
        { status: 500 }
      );
    }

    const products = productsResult.data || [];
    const orders = ordersResult.data || [];
    const pendingOrders = pendingOrdersResult.data || [];
    const paidOrders = paidOrdersResult.data || [];

    const lowStock = products.filter(
      (product) => Number(product.stock) <= 5
    ).length;

    const paidRevenue = paidOrders.reduce(
      (total, order) =>
        total + Number(order.total_amount || 0),
      0
    );

    return NextResponse.json({
      success: true,
      dashboard: {
        totalProducts: products.length,
        lowStock,
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        paidRevenue,
      },
    });
  } catch (error) {
    console.error("Admin dashboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load dashboard.",
      },
      { status: 500 }
    );
  }
}