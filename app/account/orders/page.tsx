"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
        } = await supabase.auth.getSession();

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

        if (response.status === 401) {
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

        setOrders(result.orders || []);
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
      return "bg-green-50 text-green-700";
    }

    if (
      normalized === "shipped" ||
      normalized === "dispatched"
    ) {
      return "bg-blue-50 text-blue-700";
    }

    if (normalized === "cancelled") {
      return "bg-red-50 text-red-600";
    }

    return "bg-[#fff4ee] text-[#8a6248]";
  };

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-[#2a1f1d]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <Link
              href="/account"
              className="text-sm font-semibold text-[#b98b67] transition hover:text-[#2a1f1d]"
            >
              ← Back to My Account
            </Link>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Order History
            </p>

            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 text-[#6e5b55]">
              Track your purchases and view the latest status of each order.
            </p>
          </div>

          {loading && (
            <div className="rounded-[28px] border border-[#ead8cf] bg-white p-8 text-center">
              <p className="text-sm text-[#6e5b55]">
                Loading your orders...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[28px] border border-red-100 bg-red-50 p-8 text-center">
              <h2 className="font-serif text-2xl text-red-700">
                Unable to Load Orders
              </h2>

              <p className="mt-3 text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="rounded-[28px] border border-[#ead8cf] bg-white p-8 text-center">
                <h2 className="font-serif text-2xl">
                  No Orders Yet
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6e5b55]">
                  Your completed purchases will appear here.
                </p>

                <Link
                  href="/shop"
                  className="mt-7 inline-block rounded-full bg-[#2a1f1d] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
                >
                  Start Shopping
                </Link>
              </div>
            )}

          {!loading &&
            !error &&
            orders.length > 0 && (
              <div className="space-y-5">
                {orders.map(
                  (order) => (
                    <div
                      key={order.id}
                      className="rounded-[28px] border border-[#ead8cf] bg-white p-6 transition hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-[#8b736b]">
                            Order
                          </p>

                          <h2 className="mt-1 font-serif text-2xl">
                            #{order.id}
                          </h2>

                          <p className="mt-2 text-sm text-[#8b736b]">
                            {formatDate(
                              order.created_at
                            )}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <span
                            className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold capitalize ${getStatusClasses(
                              order.order_status
                            )}`}
                          >
                            {order.order_status}
                          </span>

                          <p className="mt-3 text-lg font-semibold">
                            ₹
                            {Number(
                              order.total_amount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-4 border-t border-[#ead8cf] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs text-[#8b736b]">
                            Payment
                          </p>

                          <p className="mt-1 text-sm font-semibold capitalize">
                            {
                              order.payment_status
                            }
                          </p>
                        </div>

                        <Link
                          href={`/account/orders/${order.id}`}
                          className="rounded-full border border-[#b98b67] px-6 py-3 text-center text-sm font-semibold transition hover:bg-[#b98b67] hover:text-white"
                        >
                          View Order
                        </Link>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      </main>
    </>
  );
}