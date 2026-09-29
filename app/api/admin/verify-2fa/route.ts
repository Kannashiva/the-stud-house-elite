import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import {
  ADMIN_2FA_COOKIE,
  createAdmin2FAToken,
  createAdminSessionToken,
  hashAdminOtp,
  readAdmin2FAToken,
} from "../../../../lib/admin-2fa";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { otp } = await request.json();
    const cleanOtp = String(otp || "").replace(/\D/g, "").slice(0, 6);

    if (cleanOtp.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Please enter the 6-digit verification code." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const challenge = readAdmin2FAToken(
      cookieStore.get(ADMIN_2FA_COOKIE)?.value
    );

    if (!challenge) {
      return NextResponse.json(
        {
          success: false,
          error: "Verification session is missing or invalid. Please login again.",
        },
        { status: 401 }
      );
    }

    if (Date.now() > challenge.expiresAt) {
      const response = NextResponse.json(
        { success: false, error: "Verification code has expired. Please login again." },
        { status: 401 }
      );
      response.cookies.set(ADMIN_2FA_COOKIE, "", { path: "/", maxAge: 0 });
      return response;
    }

    if (challenge.attemptsLeft <= 0) {
      const response = NextResponse.json(
        { success: false, error: "Too many incorrect attempts. Please login again." },
        { status: 429 }
      );
      response.cookies.set(ADMIN_2FA_COOKIE, "", { path: "/", maxAge: 0 });
      return response;
    }

    const submittedHash = hashAdminOtp(challenge.email, cleanOtp);
    const submittedBuffer = Buffer.from(submittedHash);
    const expectedBuffer = Buffer.from(challenge.otpHash);

    const otpMatches =
      submittedBuffer.length === expectedBuffer.length &&
      timingSafeEqual(submittedBuffer, expectedBuffer);

    if (!otpMatches) {
      const attemptsLeft = challenge.attemptsLeft - 1;

      const response = NextResponse.json(
        {
          success: false,
          error:
            attemptsLeft > 0
              ? `Invalid verification code. ${attemptsLeft} attempt${
                  attemptsLeft === 1 ? "" : "s"
                } remaining.`
              : "Too many incorrect attempts. Please login again.",
        },
        { status: attemptsLeft > 0 ? 401 : 429 }
      );

      if (attemptsLeft > 0) {
        const updatedToken = createAdmin2FAToken({
          ...challenge,
          attemptsLeft,
        });

        const remainingSeconds = Math.max(
          1,
          Math.floor((challenge.expiresAt - Date.now()) / 1000)
        );

        response.cookies.set(ADMIN_2FA_COOKIE, updatedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: remainingSeconds,
        });
      } else {
        response.cookies.set(ADMIN_2FA_COOKIE, "", { path: "/", maxAge: 0 });
      }

      return response;
    }

    const token = createAdminSessionToken(challenge.email);

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    response.cookies.set(ADMIN_2FA_COOKIE, "", { path: "/", maxAge: 0 });

    return response;
  } catch (error) {
    console.error("Admin 2FA verification error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to verify code." },
      { status: 500 }
    );
  }
}
