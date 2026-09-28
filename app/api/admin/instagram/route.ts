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

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Admin session expired. Please login again.",
    },
    { status: 401 }
  );
}

export async function GET() {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return unauthorizedResponse();
    }

    const { data, error } =
      await supabaseAdmin
        .from("instagram_posts")
        .select("*")
        .order(
          "display_order",
          { ascending: true }
        )
        .order(
          "created_at",
          { ascending: false }
        );

    if (error) {
      console.error(
        "Instagram posts GET failed:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        posts: data || [],
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
      "Instagram admin GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load Instagram posts.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return unauthorizedResponse();
    }

    const body =
      await request.json();

    const title =
      String(
        body.title || ""
      ).trim();

    const imageUrl =
      String(
        body.image_url || ""
      ).trim();

    const instagramUrl =
      String(
        body.instagram_url || ""
      ).trim();

    const displayOrder =
      Number(
        body.display_order ?? 0
      );

    const isActive =
      body.is_active !== false;

    const { data, error } =
      await supabaseAdmin
        .from("instagram_posts")
        .insert({
          title,
          image_url: imageUrl,
          instagram_url:
            instagramUrl,
          display_order:
            Number.isFinite(
              displayOrder
            )
              ? displayOrder
              : 0,
          is_active:
            isActive,
        })
        .select()
        .single();

    if (error) {
      console.error(
        "Instagram post creation failed:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        post: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Instagram admin POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to add Instagram post.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return unauthorizedResponse();
    }

    const body =
      await request.json();

    const id =
      Number(body.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid Instagram post ID.",
        },
        { status: 400 }
      );
    }

    const title =
      String(
        body.title || ""
      ).trim();

    const imageUrl =
      String(
        body.image_url || ""
      ).trim();

    const instagramUrl =
      String(
        body.instagram_url || ""
      ).trim();

    const displayOrder =
      Number(
        body.display_order ?? 0
      );

    const isActive =
      Boolean(
        body.is_active
      );

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Image URL is required.",
        },
        { status: 400 }
      );
    }

    if (!instagramUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Instagram post or reel link is required.",
        },
        { status: 400 }
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from("instagram_posts")
        .update({
          title,
          image_url: imageUrl,
          instagram_url:
            instagramUrl,
          display_order:
            Number.isFinite(
              displayOrder
            )
              ? displayOrder
              : 0,
          is_active:
            isActive,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
      console.error(
        "Instagram post update failed:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post: data,
    });
  } catch (error) {
    console.error(
      "Instagram admin PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update Instagram post.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return unauthorizedResponse();
    }

    const body =
      await request.json();

    const id =
      Number(body.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid Instagram post ID.",
        },
        { status: 400 }
      );
    }

    const { error } =
      await supabaseAdmin
        .from("instagram_posts")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Instagram post deletion failed:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Instagram admin DELETE error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete Instagram post.",
      },
      { status: 500 }
    );
  }
}
