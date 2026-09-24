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
        payment_mode,
        courier_name,
        tracking_number,
        tracking_url,
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

    const productIds = [
      ...new Set(
        (items || []).map(
          (item) => item.product_id
        )
      ),
    ];

    let imageMap =
      new Map<number, string | null>();

    if (productIds.length > 0) {
      const {
        data: products,
        error: productsError,
      } = await supabaseAdmin
        .from("products")
        .select("id, image_url")
        .in("id", productIds);

      if (productsError) {
        console.error(
          "Customer order product images error:",
          productsError
        );
      } else {
        imageMap = new Map(
          (products || []).map(
            (product) => [
              Number(product.id),
              product.image_url || null,
            ]
          )
        );
      }
    }

    const enhancedItems = (items || []).map(
      (item) => ({
        ...item,
        image_url:
          imageMap.get(
            Number(item.product_id)
          ) || null,
      })
    );

    return NextResponse.json({
      success: true,
      order,
      items: enhancedItems,
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
