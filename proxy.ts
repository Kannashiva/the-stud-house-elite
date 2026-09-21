import { NextRequest, NextResponse } from "next/server";

async function createExpectedToken(
  email: string,
  secret: string
) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(email)
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminEmail || !sessionSecret) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  const session =
    request.cookies.get("admin_session")?.value;

  if (!session) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  const expectedToken = await createExpectedToken(
    adminEmail,
    sessionSecret
  );

  if (session !== expectedToken) {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );

    response.cookies.delete("admin_session");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};