"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      setError(result.error || "Invalid login details.");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf8] px-5">
      <div className="w-full max-w-md rounded-[28px] border border-[#ead8cf] bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
            The Stud House Elite
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#2a1f1d]">
            Admin Login
          </h1>

          <p className="mt-3 text-sm text-[#6e5b55]">
            Sign in to manage products, stock and orders.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2a1f1d]">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2a1f1d]">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              placeholder="Enter password"
              className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            className="w-full rounded-full bg-[#2a1f1d] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}

