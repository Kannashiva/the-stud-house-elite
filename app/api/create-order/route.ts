import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type CartItemInput = {
  id: string | number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
      landmark,
      items,
    } = body;

    // Basic customer validation
    if (
      !customer_name ||
      !mobile ||
      !email ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required customer details.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart is empty.",
        },
        { status: 400 }
      );
    }

    // Normalize cart items
    const normalizedItems: CartItemInput[] = items.map(
      (item: CartItemInput) => ({
        id: Number(item.id),
        quantity: Number(item.quantity),
      })
    );

    for (const item of normalizedItems) {
      if (
        !Number.isInteger(Number(item.id)) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid cart item.",
          },
          { status: 400 }
        );
      }
    }

    const productIds = [
      ...new Set(
        normalizedItems.map((item) => Number(item.id))
      ),
    ];

    // Fetch trusted product data
    const { data: products, error: productsError } =
      await supabaseAdmin
        .from("products")
        .select(
          `
          id,
          name,
          price,
          stock,
          reserved_stock,
          is_active
          `
        )
        .in("id", productIds);

    if (productsError) {
      console.error(
        "Product validation error:",
        productsError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to validate products.",
        },
        { status: 500 }
      );
    }

    if (
      !products ||
      products.length !== productIds.length
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "One or more products are no longer available.",
        },
        { status: 400 }
      );
    }

    let totalAmount = 0;

    const orderItems = normalizedItems.map(
      (cartItem) => {
        const product = products.find(
          (product) =>
            Number(product.id) ===
            Number(cartItem.id)
        );

        if (!product) {
          throw new Error("Product not found.");
        }

        if (!product.is_active) {
          throw new Error(
            `${product.name} is currently unavailable.`
          );
        }

        const totalStock = Number(
          product.stock || 0
        );

        const reservedStock = Number(
          product.reserved_stock || 0
        );

        const availableStock = Math.max(
          0,
          totalStock - reservedStock
        );

        if (
          cartItem.quantity >
          availableStock
        ) {
          throw new Error(
            `Only ${availableStock} unit(s) available for ${product.name}.`
          );
        }

        const unitPrice = Number(
          product.price
        );

        if (
          !Number.isFinite(unitPrice) ||
          unitPrice < 0
        ) {
          throw new Error(
            `Invalid price for ${product.name}.`
          );
        }

        totalAmount +=
          unitPrice *
          cartItem.quantity;

        return {
          product_id: Number(
            product.id
          ),
          product_name:
            product.name,
          price: unitPrice,
          quantity:
            cartItem.quantity,
        };
      }
    );

    // Create order using server-calculated total
    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .insert({
          customer_name,
          mobile,
          email,
          address,
          city,
          state,
          pincode,
          landmark: landmark || "",

          total_amount:
            totalAmount,

          payment_status:
            "pending",

          order_status:
            "pending",

          reservation_status:
            "none",

          reservation_expires_at:
            null,
        })
        .select()
        .single();

    if (orderError || !order) {
      console.error(
        "Supabase order error:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            orderError?.message ||
            "Unable to create order.",
        },
        { status: 500 }
      );
    }

    const trustedOrderItems =
      orderItems.map((item) => ({
        order_id: order.id,
        ...item,
      }));

    const { error: itemsError } =
      await supabaseAdmin
        .from("order_items")
        .insert(
          trustedOrderItems
        );

    if (itemsError) {
      console.error(
        "Order items error:",
        itemsError
      );

      await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to save order items.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      order: {
        ...order,
        total_amount:
          totalAmount,
      },
    });
  } catch (error) {
    console.error(
      "Create order API error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create order.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}