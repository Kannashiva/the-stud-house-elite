"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StoreHeader from "../StoreHeader";
import { supabase } from "../../lib/supabase";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace(
          "/account/login?redirect=/account"
        );
        return;
      }

      setEmail(user.email || "");
      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.replace("/account/login");
        } else {
          setEmail(
            session.user.email || ""
          );
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    setLoading(true);

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );

      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  };

  if (loading) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-[#2a1f1d]">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-sm text-[#6e5b55]">
              Loading your account...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-[#2a1f1d]">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Customer Account
            </p>

            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              My Account
            </h1>

            <p className="mt-3 max-w-2xl text-[#6e5b55]">
              Manage your account and
              view your order history.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Details */}
            <div className="rounded-[28px] border border-[#ead8cf] bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b98b67]">
                Account
              </p>

              <h2 className="mt-3 font-serif text-2xl">
                Your Details
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div>
                  <p className="text-[#8b736b]">
                    Email
                  </p>

                  <p className="mt-1 break-all font-semibold">
                    {email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-7 rounded-full border border-[#b98b67] px-6 py-3 text-sm font-semibold text-[#2a1f1d] transition hover:bg-[#b98b67] hover:text-white"
              >
                Logout
              </button>
            </div>

            {/* My Orders */}
            <div className="rounded-[28px] bg-[#2a1f1d] p-7 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e8c4ac]">
                Orders
              </p>

              <h2 className="mt-3 font-serif text-2xl">
                My Orders
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/65">
                View your recent purchases
                and check the latest order
                status.
              </p>

              <Link
                href="/account/orders"
                className="mt-7 inline-block rounded-full bg-[#e8c4ac] px-7 py-3 text-sm font-semibold text-[#2a1f1d] transition hover:bg-white"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="mt-6 rounded-[28px] border border-[#ead8cf] bg-white p-7">
            <h2 className="font-serif text-2xl">
              Need Help?
            </h2>

            <p className="mt-2 text-sm text-[#6e5b55]">
              Contact us if you need
              assistance with an order,
              payment, shipping, or return.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-block text-sm font-semibold text-[#b98b67] transition hover:text-[#2a1f1d]"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}