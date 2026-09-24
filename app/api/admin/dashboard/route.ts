import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getExpectedSessionToken() {
  const adminEmail =
    process.env.ADMIN_EMAIL;

  const sessionSecret =
    process.env.ADMIN_SESSION_SECRET;

  if (
    !adminEmail ||
    !sessionSecret
  ) {
    return null;
  }

  return createHmac(
    "sha256",
    sessionSecret
  )
    .update(adminEmail)
    .digest("hex");
}

async function isAdminAuthenticated() {
  const cookieStore =
    await cookies();

  const session =
    cookieStore.get(
      "admin_session"
    )?.value;

  const expectedToken =
    getExpectedSessionToken();

  return Boolean(
    session &&
      expectedToken &&
      session === expectedToken
  );
}

export async function GET() {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      console.error(
        "Dashboard auth failed."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Admin session expired. Please login again.",
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
  .select("id, stock, reserved_stock"),

      supabaseAdmin
        .from("orders")
        .select("id"),

      supabaseAdmin
        .from("orders")
        .select("id")
        .eq(
          "order_status",
          "pending"
        ),

      supabaseAdmin
        .from("orders")
        .select(
          "total_amount"
        )
        .eq(
          "payment_status",
          "paid"
        ),
    ]);

    if (
      productsResult.error
    ) {
      console.error(
        "Products dashboard query failed:",
        productsResult.error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            `Products query failed: ${productsResult.error.message}`,
        },
        { status: 500 }
      );
    }

    if (ordersResult.error) {
      console.error(
        "Orders dashboard query failed:",
        ordersResult.error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            `Orders query failed: ${ordersResult.error.message}`,
        },
        { status: 500 }
      );
    }

    if (
      pendingOrdersResult.error
    ) {
      console.error(
        "Pending orders query failed:",
        pendingOrdersResult.error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            `Pending orders query failed: ${pendingOrdersResult.error.message}`,
        },
        { status: 500 }
      );
    }

    if (
      paidOrdersResult.error
    ) {
      console.error(
        "Paid orders query failed:",
        paidOrdersResult.error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            `Paid orders query failed: ${paidOrdersResult.error.message}`,
        },
        { status: 500 }
      );
    }

    const products =
      productsResult.data || [];

    const orders =
      ordersResult.data || [];

    const pendingOrders =
      pendingOrdersResult.data || [];

    const paidOrders =
      paidOrdersResult.data || [];

    const lowStock =
  products.filter((product) => {
    const stock =
      Number(product.stock || 0);

    const reservedStock =
      Number(
        product.reserved_stock || 0
      );

    const availableStock =
      Math.max(
        stock - reservedStock,
        0
      );

    return (
      availableStock > 0 &&
      availableStock <= 5
    );
  }).length;

const outOfStock =
  products.filter((product) => {
    const stock =
      Number(product.stock || 0);

    const reservedStock =
      Number(
        product.reserved_stock || 0
      );

    const availableStock =
      Math.max(
        stock - reservedStock,
        0
      );

    return availableStock === 0;
  }).length;

    const paidRevenue =
      paidOrders.reduce(
        (total, order) =>
          total +
          Number(
            order.total_amount ||
              0
          ),
        0
      );

    return NextResponse.json(
      {
        success: true,

        dashboard: {
  totalProducts:
    products.length,

  lowStock,

  outOfStock,

  totalOrders:
    orders.length,

  pendingOrders:
    pendingOrders.length,

  paidRevenue,
},
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Admin dashboard API error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown dashboard error.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}