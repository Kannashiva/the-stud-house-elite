"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || "Invalid login credentials.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf8] px-5 py-10 text-[#2a1f1d]">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute left-[-80px] top-[-80px] h-56 w-56 rounded-full bg-[#f4dfd2] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-80px] h-64 w-64 rounded-full bg-[#ecd6c8] opacity-40 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center">
        <div className="relative w-full overflow-hidden rounded-[34px] border border-[#ead8cf] bg-white/90 shadow-[0_20px_60px_rgba(94,63,52,0.12)] backdrop-blur-xl">
          {/* top premium line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#e8c4ac] via-[#b98b67] to-[#e8c4ac]" />

          <div className="p-7 sm:p-9">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full border border-[#ead8cf] bg-[#fffaf8] p-2 shadow-sm">
                <Image
                  src="/images/logo/studlogo.png"
                  alt="The Stud House Elite"
                  width={84}
                  height={84}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#b98b67]">
                The Stud House Elite
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                Admin Login
              </h1>

              <div className="mx-auto mt-4 h-[1px] w-16 bg-[#d9b79e]" />

              <p className="mt-4 text-sm leading-6 text-[#6e5b55] sm:text-base">
                Sign in to manage products, stock, orders and store activity.
              </p>
            </div>

            {/* Form */}
            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2a1f1d]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleLogin();
                    }
                  }}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-[#dcc9bf] bg-[#fffaf8] px-5 py-4 text-[#2a1f1d] outline-none transition placeholder:text-[#9b857c] focus:border-[#b98b67] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2a1f1d]">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleLogin();
                    }
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-[#dcc9bf] bg-[#fffaf8] px-5 py-4 text-[#2a1f1d] outline-none transition placeholder:text-[#9b857c] focus:border-[#b98b67] focus:bg-white"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="mt-2 w-full rounded-full bg-[#2a1f1d] py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(42,31,29,0.18)] transition hover:bg-[#b98b67] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Login"}
              </button>
            </div>

            {/* Bottom text */}
            <p className="mt-7 text-center text-xs leading-5 text-[#8b736b]">
              Protected admin access for The Stud House Elite store management.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}