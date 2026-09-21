import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

function createSessionToken(email: string) {
  const secret = process.env.ADMIN_SESSION_SECRET!;

  return createHmac("sha256", secret)
    .update(email)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminEmail || !adminPassword || !sessionSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin login is not configured.",
        },
        { status: 500 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const emailMatches = email === adminEmail;

    const passwordBuffer = Buffer.from(password);
    const adminPasswordBuffer = Buffer.from(adminPassword);

    const passwordMatches =
      passwordBuffer.length === adminPasswordBuffer.length &&
      timingSafeEqual(passwordBuffer, adminPasswordBuffer);

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const token = createSessionToken(adminEmail);

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to login.",
      },
      { status: 500 }
    );
  }
}