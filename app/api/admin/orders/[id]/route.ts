import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { sendOrderStatusEmail } from "../../../../../lib/sendOrderStatusEmail";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getExpectedSessionToken() {
  const adminEmail =
    process.env.ADMIN_EMAIL;

  const sessionSecret =
    process.env.ADMIN_SESSION_SECRET;

  if (!adminEmail || !sessionSecret) {
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

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } =
      await context.params;

    const {
      data: order,
      error,
    } = await supabaseAdmin
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
      console.error(
        "Load order error:",
        error
      );

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
    console.error(
      "Admin order GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load order.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } =
      await context.params;

    const orderId =
      Number(id);

    const body =
      await request.json();

    const {
      order_status,
      courier_name,
      tracking_number,
      tracking_url,
    } = body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      !allowedStatuses.includes(
        order_status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid order status.",
        },
        { status: 400 }
      );
    }

    const {
      data: currentOrder,
      error: currentOrderError,
    } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        order_status,
        payment_status
        `
      )
      .eq("id", orderId)
      .single();

    if (
      currentOrderError ||
      !currentOrder
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order not found.",
        },
        { status: 404 }
      );
    }

    const updateData: {
      order_status: string;
      courier_name?: string | null;
      tracking_number?: string | null;
      tracking_url?: string | null;
    } = {
      order_status,
    };

    if (
      courier_name !== undefined
    ) {
      updateData.courier_name =
        courier_name?.trim() || null;
    }

    if (
      tracking_number !== undefined
    ) {
      updateData.tracking_number =
        tracking_number?.trim() ||
        null;
    }

    if (
      tracking_url !== undefined
    ) {
      updateData.tracking_url =
        tracking_url?.trim() || null;
    }

    const {
      data: order,
      error,
    } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single();

    if (error || !order) {
      console.error(
        "Update order status error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error?.message ||
            "Unable to update order.",
        },
        { status: 500 }
      );
    }

    /*
      Only send an email when the
      status actually CHANGES into
      shipped/delivered.
    */

    const statusChanged =
      currentOrder.order_status !==
      order_status;

    if (
      statusChanged &&
      order_status === "shipped"
    ) {
      const emailResult =
        await sendOrderStatusEmail(
          orderId,
          "shipped"
        );

      if (!emailResult.success) {
        console.error(
          "Order was marked shipped but shipped email failed."
        );
      }
    }

    if (
      statusChanged &&
      order_status === "delivered"
    ) {
      const emailResult =
        await sendOrderStatusEmail(
          orderId,
          "delivered"
        );

      if (!emailResult.success) {
        console.error(
          "Order was marked delivered but delivered email failed."
        );
      }
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Admin order PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update order status.",
      },
      { status: 500 }
    );
  }
}