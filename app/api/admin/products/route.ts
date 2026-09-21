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

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    const expectedToken = getExpectedSessionToken();

    if (!session || !expectedToken || session !== expectedToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      name,
      category,
      price,
      mrp,
      image_url,
      description,
      stock,
      is_new,
      is_best_seller,
      is_active,
    } = body;

    if (
      !name ||
      !category ||
      price === undefined ||
      mrp === undefined ||
      !image_url ||
      !description ||
      stock === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required product fields.",
        },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .insert({
        name,
        category,
        price: Number(price),
        mrp: Number(mrp),
        image_url,
        description,
        stock: Number(stock),
        is_new: Boolean(is_new),
        is_best_seller: Boolean(is_best_seller),
        is_active: Boolean(is_active),
      })
      .select()
      .single();

    if (error) {
      console.error("Add product error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Admin product API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to add product.",
      },
      { status: 500 }
    );
  }
}