"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import StoreHeader from "../../StoreHeader";
import { supabase } from "../../../lib/supabase";

type CustomerOrder = {
  id: number;
  customer_name: string;
  email: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

export default function AccountOrdersPage() {
  const [orders, setOrders] =
    useState<CustomerOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const router = useRouter();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session) {
          router.replace(
            "/account/login?redirect=/account/orders"
          );

          return;
        }

        const response = await fetch(
          "/api/customer/orders",
          {
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );

        const result =
          await response.json();

        if (
          response.status === 401
        ) {
          await supabase.auth.signOut();

          router.replace(
            "/account/login?redirect=/account/orders"
          );

          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          setError(
            result.error ||
              "Unable to load your orders."
          );

          return;
        }

        setOrders(
          result.orders || []
        );
      } catch (error) {
        console.error(
          "Orders loading error:",
          error
        );

        setError(
          "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  const formatDate = (
    dateValue: string
  ) => {
    return new Date(
      dateValue
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClasses = (
    status: string
  ) => {
    const normalized =
      status.toLowerCase();

    if (
      normalized === "confirmed" ||
      normalized === "delivered"
    ) {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (
      normalized === "shipped" ||
      normalized === "dispatched"
    ) {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (
      normalized === "cancelled"
    ) {
      return "border-red-200 bg-red-50 text-red-600";
    }

    return "border-[#ecd8cd] bg-[#fff4ee] text-[#8a6248]";
  };

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-5 pb-16 pt-10 text-[#2a1f1d] md:pb-20">
        <div className="mx-auto max-w-6xl">

          {/* Back */}
          <Link
            href="/account"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#8a6248] transition hover:text-[#b98b67]"
          >
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-1"
            />
            Back to My Account
          </Link>

          {/* Heading */}
          <div className="mb-9 mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
              Order History
            </p>

            <h1 className="mt-2 font-serif text-4xl md:text-5xl">
              My Orders
            </h1>

            <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
              View your completed
              purchases and track the
              latest status of each
              order.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-10 text-center shadow-[0_14px_40px_rgba(70,45,38,0.05)]">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />

              <p className="mt-4 text-sm text-[#6e5b55]">
                Loading your orders...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-[30px] border border-red-100 bg-red-50/80 p-8 text-center shadow-sm">
              <h2 className="font-serif text-2xl text-red-700">
                Unable to Load Orders
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* No Orders */}
          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-8 text-center shadow-[0_14px_40px_rgba(70,45,38,0.05)] sm:p-10">
                <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                  <ShoppingBag
                    size={29}
                    strokeWidth={1.7}
                  />
                </div>

                <h2 className="mt-6 font-serif text-3xl">
                  No Orders Yet
                </h2>

                <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6e5b55]">
                  Your completed
                  purchases will appear
                  here once you place an
                  order.
                </p>

                <Link
                  href="/shop"
                  className="group mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-8 py-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(42,31,29,0.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67]"
                >
                  Start Shopping

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}

          {/* Orders */}
          {!loading &&
            !error &&
            orders.length > 0 && (
              <div className="space-y-5">
                {orders.map(
                  (order) => (
                    <article
                      key={order.id}
                      className="group overflow-hidden rounded-[30px] border border-[#ead8cf]/70 bg-white/80 shadow-[0_12px_35px_rgba(70,45,38,0.05)] backdrop-blur-sm transition duration-300 hover:border-[#dfc6b8] hover:shadow-[0_18px_45px_rgba(70,45,38,0.10)]"
                    >
                      <div className="p-6 sm:p-7">

                        {/* Top */}
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                              <PackageCheck
                                size={21}
                                strokeWidth={1.8}
                              />
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b736b]">
                                Order Number
                              </p>

                              <h2 className="mt-1 font-serif text-2xl">
                                #{order.id}
                              </h2>

                              <div className="mt-2 flex items-center gap-2 text-sm text-[#8b736b]">
                                <CalendarDays
                                  size={15}
                                  className="text-[#b98b67]"
                                />

                                {formatDate(
                                  order.created_at
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <span
                              className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold capitalize ${getStatusClasses(
                                order.order_status
                              )}`}
                            >
                              {
                                order.order_status
                              }
                            </span>

                            <p className="mt-3 font-serif text-2xl text-[#2a1f1d]">
                              ₹
                              {Number(
                                order.total_amount
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Bottom */}
                        <div className="mt-6 flex flex-col gap-4 border-t border-[#ead8cf]/70 pt-5 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

                            <div>
                              <p className="text-[10px] uppercase tracking-[0.15em] text-[#8b736b]">
                                Payment
                              </p>

                              <p className="mt-1 text-sm font-semibold capitalize">
                                {
                                  order.payment_status
                                }
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/account/orders/${order.id}`}
                            className="group/button inline-flex items-center justify-center gap-2 rounded-full border border-[#b98b67] bg-white px-6 py-3 text-sm font-semibold text-[#2a1f1d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] hover:text-white"
                          >
                            View Order

                            <ArrowRight
                              size={16}
                              className="transition group-hover/button:translate-x-1"
                            />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
        </div>
      </main>
    </>
  );
}