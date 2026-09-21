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

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load orders error:", error);

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
      orders: orders || [],
    });
  } catch (error) {
    console.error("Admin orders API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load orders.",
      },
      { status: 500 }
    );
  }
}