"use client";

import AdminHeader from "../AdminHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Mail,
  PackageCheck,
  Phone,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";

type Order = {
  id: number;
  customer_name: string;
  mobile: string;
  email: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const response = await fetch(
        "/api/admin/orders"
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        console.error(
          "Failed to load orders:",
          result
        );

        setLoading(false);
        return;
      }

      setOrders(
        result.orders || []
      );

      setLoading(false);
    };

    loadOrders();
  }, []);

  const getOrderStatusStyle = (
    status: string
  ) => {
    const normalized =
      status.toLowerCase();

    if (normalized === "confirmed") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (normalized === "shipped") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    if (normalized === "delivered") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (normalized === "cancelled") {
      return "border-red-200 bg-red-50 text-red-600";
    }

    return "border-[#ead8cf] bg-[#fff4ee] text-[#9a6b48]";
  };

  return (
    <>
      <AdminHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-4 py-8 text-[#2a1f1d] sm:px-5 sm:py-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Admin Orders
            </p>

            <h1 className="mt-2 font-serif text-4xl md:text-5xl">
              Orders
            </h1>

            <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55]">
              View customer orders,
              payment status and delivery
              progress from one place.
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-10 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />

              <p className="mt-4 text-sm text-[#6e5b55]">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-10 text-center shadow-[0_14px_40px_rgba(70,45,38,0.05)]">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                <ShoppingBag
                  size={28}
                />
              </div>

              <h2 className="mt-5 font-serif text-3xl">
                No Orders Yet
              </h2>

              <p className="mt-3 text-sm text-[#6e5b55]">
                Customer orders will
                appear here.
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE ORDER CARDS */}
              <div className="space-y-4 md:hidden">

                {orders.map(
                  (order) => (
                    <div
                      key={order.id}
                      className="rounded-[24px] border border-[#ead8cf]/70 bg-white/90 p-4 shadow-[0_12px_35px_rgba(70,45,38,0.05)]"
                    >

                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8eee8] text-[#b98b67]">
                            <ReceiptText
                              size={18}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold">
                              Order #{order.id}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8b736b]">
                              <CalendarDays
                                size={12}
                              />

                              {new Date(
                                order.created_at
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month:
                                    "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="shrink-0 font-serif text-xl font-semibold">
                          ₹
                          {Number(
                            order.total_amount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      {/* Customer */}
                      <div className="mt-5 rounded-[18px] bg-[#fffaf8] p-4">

                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b837a]">
                          Customer
                        </p>

                        <p className="mt-2 font-semibold">
                          {
                            order.customer_name
                          }
                        </p>

                        <div className="mt-3 space-y-2">

                          <div className="flex items-start gap-2 text-xs text-[#6e5b55]">
                            <Mail
                              size={13}
                              className="mt-0.5 shrink-0 text-[#b98b67]"
                            />

                            <span className="break-all">
                              {
                                order.email
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[#6e5b55]">
                            <Phone
                              size={13}
                              className="shrink-0 text-[#b98b67]"
                            />

                            {
                              order.mobile
                            }
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mt-4 flex flex-wrap gap-2">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold capitalize ${
                            order.payment_status ===
                            "paid"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              order.payment_status ===
                              "paid"
                                ? "bg-green-500"
                                : "bg-amber-500"
                            }`}
                          />

                          Payment:{" "}
                          {
                            order.payment_status
                          }
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold capitalize ${getOrderStatusStyle(
                            order.order_status
                          )}`}
                        >
                          <PackageCheck
                            size={12}
                          />

                          {
                            order.order_status
                          }
                        </span>
                      </div>

                      {/* Action */}
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#b98b67]"
                      >
                        View Order

                        <ChevronRight
                          size={14}
                        />
                      </Link>
                    </div>
                  )
                )}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden overflow-hidden rounded-[30px] border border-[#ead8cf]/70 bg-white/80 shadow-[0_16px_45px_rgba(70,45,38,0.06)] backdrop-blur-sm md:block">

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-left text-sm">

                    <thead className="border-b border-[#ead8cf]/80 bg-[#fff7f2]">
                      <tr>
                        <th className="px-5 py-4">
                          Order
                        </th>

                        <th className="px-5 py-4">
                          Customer
                        </th>

                        <th className="px-5 py-4">
                          Contact
                        </th>

                        <th className="px-5 py-4">
                          Total
                        </th>

                        <th className="px-5 py-4">
                          Payment
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4">
                          Date
                        </th>

                        <th className="px-5 py-4 text-right">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map(
                        (order) => (
                          <tr
                            key={
                              order.id
                            }
                            className="border-b border-[#f0e4df] transition hover:bg-[#fffaf8] last:border-b-0"
                          >

                            {/* Order */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8eee8] text-[#b98b67]">
                                  <ReceiptText
                                    size={
                                      17
                                    }
                                  />
                                </div>

                                <div>
                                  <p className="font-semibold">
                                    #
                                    {
                                      order.id
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-[#9b837a]">
                                    Order ID
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="px-5 py-4">
                              <p className="font-semibold">
                                {
                                  order.customer_name
                                }
                              </p>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8b736b]">
                                <Mail
                                  size={
                                    12
                                  }
                                />

                                <span>
                                  {
                                    order.email
                                  }
                                </span>
                              </div>
                            </td>

                            {/* Contact */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2 text-[#6e5b55]">
                                <Phone
                                  size={
                                    14
                                  }
                                />

                                {
                                  order.mobile
                                }
                              </div>
                            </td>

                            {/* Total */}
                            <td className="px-5 py-4">
                              <p className="font-semibold">
                                ₹
                                {Number(
                                  order.total_amount
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </td>

                            {/* Payment */}
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                  order.payment_status ===
                                  "paid"
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                }`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    order.payment_status ===
                                    "paid"
                                      ? "bg-green-500"
                                      : "bg-amber-500"
                                  }`}
                                />

                                {
                                  order.payment_status
                                }
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getOrderStatusStyle(
                                  order.order_status
                                )}`}
                              >
                                <PackageCheck
                                  size={
                                    13
                                  }
                                />

                                {
                                  order.order_status
                                }
                              </span>
                            </td>

                            {/* Date */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2 text-[#6e5b55]">
                                <CalendarDays
                                  size={
                                    14
                                  }
                                />

                                {new Date(
                                  order.created_at
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month:
                                      "short",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                            </td>

                            {/* Action */}
                            <td className="px-5 py-4">
                              <div className="flex justify-end">
                                <Link
                                  href={`/admin/orders/${order.id}`}
                                  className="inline-flex items-center gap-2 rounded-full border border-[#d9b69f] bg-white px-4 py-2 text-xs font-semibold text-[#8a6248] transition hover:bg-[#b98b67] hover:text-white"
                                >
                                  View Order

                                  <ChevronRight
                                    size={
                                      14
                                    }
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}