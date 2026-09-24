"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Headphones,
  Mail,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";
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
          router.replace(
            "/account/login"
          );
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


  if (loading) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fff3ee] px-5 py-16 text-[#2a1f1d]">
          <div className="mx-auto flex min-h-[55vh] max-w-5xl items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />

              <p className="mt-4 text-sm text-[#6e5b55]">
                Loading your account...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-5 pb-16 pt-10 text-[#2a1f1d] md:pb-20">
        <div className="mx-auto max-w-6xl">

          {/* Heading */}
          <div className="mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
              Customer Account
            </p>

            <h1 className="mt-2 font-serif text-4xl md:text-5xl">
              My Account
            </h1>

            <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
              Manage your account,
              review your purchases,
              and access support whenever
              you need it.
            </p>
          </div>

          {/* Main Cards */}
          <div className="grid gap-6 md:grid-cols-2">

            {/* Account Details */}
            <section className="relative overflow-hidden rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-7 shadow-[0_14px_40px_rgba(70,45,38,0.06)] backdrop-blur-sm sm:p-8">

              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f4d9ca]/30 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b98b67]">
                      Account
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      Your Details
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                    <User
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                <div className="mt-7 rounded-[20px] border border-[#ead8cf]/70 bg-[#fffaf8] p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#b98b67] shadow-sm">
                      <Mail size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#8b736b]">
                        Email Address
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold sm:text-base">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-[#8b736b]">
                  <ShieldCheck
                    size={16}
                    className="text-[#b98b67]"
                  />

                  <span>
                    Your account is secured
                    with email verification.
                  </span>
                </div>
              </div>
            </section>

            {/* Orders */}
            <section className="relative overflow-hidden rounded-[30px] border border-[#b98b67]/20 bg-gradient-to-br from-[#241916] via-[#2b1d19] to-[#1f1512] p-7 text-white shadow-[0_20px_55px_rgba(42,31,29,0.18)] sm:p-8">

              <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[#b98b67]/15 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e8c4ac]">
                      Orders
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      My Orders
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[#e8c4ac]">
                    <ShoppingBag
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                  View your recent
                  purchases, payment
                  details, shipping
                  information, and latest
                  order status.
                </p>

                <div className="mt-6 flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                  <PackageCheck
                    size={20}
                    className="shrink-0 text-[#e8c4ac]"
                  />

                  <p className="text-xs leading-5 text-white/60">
                    Completed purchases
                    appear automatically in
                    your order history.
                  </p>
                </div>

                <Link
                  href="/account/orders"
                  className="group mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#e8c4ac] px-7 py-3.5 text-sm font-semibold text-[#2a1f1d] shadow-[0_10px_24px_rgba(232,196,172,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  View Orders

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </section>
          </div>

          {/* Support */}
          <section className="mt-6 overflow-hidden rounded-[30px] border border-[#ead8cf]/70 bg-gradient-to-r from-white via-[#fffaf8] to-[#f9ebe4] p-7 shadow-[0_12px_35px_rgba(70,45,38,0.05)] sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4e3da] text-[#b98b67]">
                  <Headphones
                    size={21}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b98b67]">
                    Support
                  </p>

                  <h2 className="mt-1 font-serif text-2xl">
                    Need Help?
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e5b55]">
                    Contact us if you need
                    assistance with an
                    order, payment,
                    shipping, cancellation,
                    or return.
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67]"
              >
                Contact Support

                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}