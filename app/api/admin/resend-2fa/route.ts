import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_2FA_COOKIE,
  ADMIN_2FA_MAX_AGE,
  ADMIN_2FA_MAX_ATTEMPTS,
  createAdmin2FAToken,
  generateAdminOtp,
  hashAdminOtp,
  readAdmin2FAToken,
  sendAdminOtpEmail,
} from "../../../../lib/admin-2fa";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const currentChallenge = readAdmin2FAToken(
      cookieStore.get(ADMIN_2FA_COOKIE)?.value
    );

    if (!currentChallenge) {
      return NextResponse.json(
        {
          success: false,
          error: "Verification session is missing. Please login again.",
        },
        { status: 401 }
      );
    }

    const otp = generateAdminOtp();
    const expiresAt = Date.now() + ADMIN_2FA_MAX_AGE * 1000;

    const newChallenge = createAdmin2FAToken({
      email: currentChallenge.email,
      otpHash: hashAdminOtp(currentChallenge.email, otp),
      expiresAt,
      attemptsLeft: ADMIN_2FA_MAX_ATTEMPTS,
    });

    await sendAdminOtpEmail({
      to: currentChallenge.email,
      otp,
    });

    const response = NextResponse.json({
      success: true,
      message: "A new verification code has been sent.",
    });

    response.cookies.set(ADMIN_2FA_COOKIE, newChallenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_2FA_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Admin 2FA resend error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to resend verification code." },
      { status: 500 }
    );
  }
}
