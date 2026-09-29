import { createHmac, randomInt, timingSafeEqual } from "crypto";

export const ADMIN_2FA_COOKIE = "admin_2fa_challenge";
export const ADMIN_2FA_MAX_AGE = 10 * 60;
export const ADMIN_2FA_MAX_ATTEMPTS = 5;

type Admin2FAChallenge = {
  email: string;
  otpHash: string;
  expiresAt: number;
  attemptsLeft: number;
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured.");
  return secret;
}

function signPayload(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function hashAdminOtp(email: string, otp: string) {
  return createHmac("sha256", getSecret())
    .update(`${email}:${otp}`)
    .digest("hex");
}

export function generateAdminOtp() {
  return randomInt(100000, 1000000).toString();
}

export function createAdmin2FAToken(challenge: Admin2FAChallenge) {
  const payload = Buffer.from(JSON.stringify(challenge)).toString("base64url");
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function readAdmin2FAToken(token: string | undefined): Admin2FAChallenge | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as Admin2FAChallenge;

    if (
      !parsed.email ||
      !parsed.otpHash ||
      !parsed.expiresAt ||
      typeof parsed.attemptsLeft !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function createAdminSessionToken(email: string) {
  return createHmac("sha256", getSecret()).update(email).digest("hex");
}

export async function sendAdminOtpEmail({ to, otp }: { to: string; otp: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ADMIN_2FA_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error("Admin 2FA email is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject: "Your Admin Login Code - The Stud House Elite",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px;color:#2a1f1d">
          <h2 style="margin:0 0 14px">Admin Login Verification</h2>
          <p style="line-height:1.6;color:#6e5b55">
            Use the verification code below to continue signing in to The Stud House Elite admin panel.
          </p>
          <div style="margin:26px 0;padding:18px 22px;border-radius:16px;background:#fff4ee;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px;color:#b98b67">
            ${otp}
          </div>
          <p style="line-height:1.6;color:#6e5b55">
            This code expires in 10 minutes. If you did not attempt to sign in, you can ignore this email.
          </p>
        </div>
      `,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Resend admin OTP error:", result);
    throw new Error("Unable to send admin verification code.");
  }

  return result;
}
