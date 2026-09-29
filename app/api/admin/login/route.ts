import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  ADMIN_2FA_COOKIE,
  ADMIN_2FA_MAX_AGE,
  ADMIN_2FA_MAX_ATTEMPTS,
  createAdmin2FAToken,
  generateAdminOtp,
  hashAdminOtp,
  sendAdminOtpEmail,
} from "../../../../lib/admin-2fa";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminEmail || !adminPassword || !sessionSecret) {
      return NextResponse.json(
        { success: false, error: "Admin login is not configured." },
        { status: 500 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedAdminEmail = adminEmail.trim().toLowerCase();
    const emailMatches = normalizedEmail === normalizedAdminEmail;

    const passwordBuffer = Buffer.from(String(password));
    const adminPasswordBuffer = Buffer.from(adminPassword);

    const passwordMatches =
      passwordBuffer.length === adminPasswordBuffer.length &&
      timingSafeEqual(passwordBuffer, adminPasswordBuffer);

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const otp = generateAdminOtp();
    const expiresAt = Date.now() + ADMIN_2FA_MAX_AGE * 1000;

    const challengeToken = createAdmin2FAToken({
      email: normalizedAdminEmail,
      otpHash: hashAdminOtp(normalizedAdminEmail, otp),
      expiresAt,
      attemptsLeft: ADMIN_2FA_MAX_ATTEMPTS,
    });

    await sendAdminOtpEmail({
      to: normalizedAdminEmail,
      otp,
    });

    const response = NextResponse.json({
      success: true,
      requires2FA: true,
      message: "Verification code sent to your admin email.",
    });

    response.cookies.set(ADMIN_2FA_COOKIE, challengeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_2FA_MAX_AGE,
    });

    response.cookies.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to send verification code." },
      { status: 500 }
    );
  }
}
