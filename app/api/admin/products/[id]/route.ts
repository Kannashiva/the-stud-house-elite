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

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error || !product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Load product error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load product.",
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

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update({
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
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      console.error("Update product error:", error);

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
    console.error("Update product API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update product.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const { is_active } = body;

    if (typeof is_active !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status value.",
        },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update({
        is_active,
      })
      .eq("id", Number(id))
      .select()
      .single();

    if (error || !product) {
      console.error("Update product status error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error?.message || "Unable to update product status.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Product status API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update product status.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const productId = Number(id);

    const { data: usedItems, error: usageError } = await supabaseAdmin
      .from("order_items")
      .select("id")
      .eq("product_id", productId)
      .limit(1);

    if (usageError) {
      console.error("Product usage check error:", usageError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to check product usage.",
        },
        { status: 500 }
      );
    }

    if (usedItems && usedItems.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This product is linked to an existing order. Deactivate it instead of deleting it.",
        },
        { status: 409 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      console.error("Delete product error:", deleteError);

      return NextResponse.json(
        {
          success: false,
          error: deleteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete product API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete product.",
      },
      { status: 500 }
    );
  }
}