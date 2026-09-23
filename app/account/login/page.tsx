"use client";

import {
  Suspense,
  useState,
} from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import StoreHeader from "../../StoreHeader";
import { supabase } from "../../../lib/supabase";

function AccountLoginContent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] =
    useState<"email" | "otp">("email");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo =
    searchParams.get("redirect") ||
    "/account";

  const handleSendOtp = async () => {
    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessage(
        "Please enter your email address."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } =
      await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
        },
      });

    if (error) {
      console.error(
        "OTP send error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to send verification code."
      );

      setLoading(false);
      return;
    }

    setEmail(cleanEmail);
    setStep("otp");

    setMessage(
      "We sent a 6-digit verification code to your email."
    );

    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setMessage(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } =
      await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

    if (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setMessage(
        error.message ||
          "Invalid or expired verification code."
      );

      setLoading(false);
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");

    const { error } =
      await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

    if (error) {
      setMessage(
        error.message ||
          "Unable to resend verification code."
      );
    } else {
      setMessage(
        "A new verification code has been sent."
      );
    }

    setLoading(false);
  };

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff7f3] to-[#fdf1ec] px-5 py-14 text-[#2a1f1d]">
        <div className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-[34px] border border-[#ead8cf] bg-gradient-to-b from-white via-[#fffdfc] to-[#fff7f3] p-7 shadow-[0_20px_60px_rgba(82,55,46,0.12)] sm:p-9">

            {/* Premium Gold Accent */}
            <div className="absolute left-1/2 top-0 h-[3px] w-28 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-[#dfbea4] via-[#b98b67] to-[#dfbea4]" />

            {/* Decorative Glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f4d9ca]/30 blur-3xl" />

            <div className="relative text-center">
              <h1 className="font-serif text-4xl leading-tight md:text-[42px]">
                Welcome Back
              </h1>

              <div className="mx-auto mt-3 h-px w-12 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#7c6a63]">
                Sign in to continue to checkout
                and view your orders.
              </p>
            </div>

            {step === "email" ? (
              <div className="relative mt-1">

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      handleSendOtp();
                    }
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="mt-3 w-full rounded-2xl border border-[#e2d0c7] bg-white/80 px-5 py-4 text-[#2a1f1d] shadow-[inset_0_1px_3px_rgba(70,45,38,0.04)] outline-none transition placeholder:text-[#aa9389] focus:border-[#b98b67] focus:ring-4 focus:ring-[#b98b67]/10"
                />

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="mt-5 w-full rounded-full bg-[#2a1f1d] py-4 text-sm font-semibold tracking-wide text-white shadow-[0_10px_25px_rgba(42,31,29,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] hover:shadow-[0_14px_30px_rgba(185,139,103,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Sending Code..."
                    : "Continue with Email"}
                </button>
              </div>
            ) : (
              <div className="relative mt-6">
                <p className="text-center text-sm text-[#7c6a63]">
                  Enter the 6-digit code
                  sent to
                </p>

                <p className="mt-2 break-all text-center text-sm font-semibold text-[#2a1f1d]">
                  {email}
                </p>

                <label className="mt-5 block text-center text-sm font-semibold tracking-wide">
                  Verification Code
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      handleVerifyOtp();
                    }
                  }}
                  placeholder="••••••"
                  autoComplete="one-time-code"
                  className="mt-3 w-full rounded-2xl border border-[#e2d0c7] bg-white/80 px-4 py-4 text-center text-xl font-semibold tracking-[0.55em] outline-none transition placeholder:text-[#c9b8b0] focus:border-[#b98b67] focus:ring-4 focus:ring-[#b98b67]/10"
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="mt-5 w-full rounded-full bg-[#2a1f1d] py-4 text-sm font-semibold tracking-wide text-white shadow-[0_10px_25px_rgba(42,31,29,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Verifying..."
                    : "Verify & Continue"}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="mt-5 w-full text-sm font-semibold text-[#b98b67] transition hover:text-[#8a6248] disabled:opacity-50"
                >
                  Resend Code
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setMessage("");
                  }}
                  disabled={loading}
                  className="mt-3 w-full text-sm font-medium text-[#7c6a63] transition hover:text-[#2a1f1d] disabled:opacity-50"
                >
                  Change Email
                </button>
              </div>
            )}

            {message && (
              <div className="mt-5 rounded-2xl border border-[#ecd8cd] bg-[#fff4ee] px-4 py-3 text-center">
                <p className="text-sm leading-6 text-[#8a6248]">
                  {message}
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-[#eee0da] pt-6">
              <p className="text-center text-xs leading-5 text-[#8b736b]">
                By continuing, you agree to
                our{" "}
                <Link
                  href="/terms-and-conditions"
                  className="font-semibold text-[#b98b67] transition hover:text-[#8a6248]"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-[#b98b67] transition hover:text-[#8a6248]"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function AccountLoginPage() {
  return (
    <Suspense
      fallback={
        <>
          <StoreHeader />

          <main className="min-h-screen bg-[#fffaf8] px-5 py-16">
            <p className="text-center text-sm text-[#7c6a63]">
              Loading login...
            </p>
          </main>
        </>
      }
    >
      <AccountLoginContent />
    </Suspense>
  );
}