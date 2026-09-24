"use client";

import AdminHeader from "./AdminHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  PackageX,
  RefreshCw,
  ShoppingBag,
  TimerReset,
} from "lucide-react";

type DashboardData = {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  totalOrders: number;
  pendingOrders: number;
  paidRevenue: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<DashboardData>({
      totalProducts: 0,
      lowStock: 0,
      outOfStock: 0,
      totalOrders: 0,
      pendingOrders: 0,
      paidRevenue: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/dashboard",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        console.log(
          "Dashboard API status:",
          response.status
        );

        console.log(
          "Dashboard API result:",
          result
        );

        if (response.status === 401) {
          router.replace(
            "/admin/login"
          );

          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          setError(
            result?.error ||
              `Unable to load dashboard. Status: ${response.status}`
          );

          return;
        }

        setDashboard(
          result.dashboard
        );
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          "Unable to connect to the dashboard API."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const cards = [
    {
      label: "Total Products",
      value:
        dashboard.totalProducts,
      description:
        "Products in inventory",
      icon: Boxes,
      href: "/admin/products",
      wrapper:
        "border-[#ead8cf]/70 bg-white/85",
      iconStyle:
        "bg-[#f5e3da] text-[#b98b67]",
      valueStyle:
        "text-[#2a1f1d]",
      descriptionStyle:
        "text-[#8b736b]",
    },
    {
      label: "Low Stock",
      value:
        dashboard.lowStock,
      description:
        "1–5 available",
      icon: AlertTriangle,
      href: "/admin/products",
      wrapper:
        "border-amber-200 bg-amber-50/80",
      iconStyle:
        "bg-amber-100 text-amber-700",
      valueStyle:
        "text-amber-800",
      descriptionStyle:
        "text-amber-700/70",
    },
    {
      label: "Out of Stock",
      value:
        dashboard.outOfStock,
      description:
        "0 available",
      icon: PackageX,
      href: "/admin/products",
      wrapper:
        "border-red-200 bg-red-50/80",
      iconStyle:
        "bg-red-100 text-red-600",
      valueStyle:
        "text-red-700",
      descriptionStyle:
        "text-red-600/70",
    },
    {
      label: "Total Orders",
      value:
        dashboard.totalOrders,
      description:
        "All customer orders",
      icon: ShoppingBag,
      href: "/admin/orders",
      wrapper:
        "border-[#ead8cf]/70 bg-white/85",
      iconStyle:
        "bg-[#f5e3da] text-[#b98b67]",
      valueStyle:
        "text-[#2a1f1d]",
      descriptionStyle:
        "text-[#8b736b]",
    },
    {
      label: "Pending Orders",
      value:
        dashboard.pendingOrders,
      description:
        "Need attention",
      icon: TimerReset,
      href: "/admin/orders",
      wrapper:
        "border-[#ead8cf]/70 bg-white/85",
      iconStyle:
        "bg-[#f5e3da] text-[#b98b67]",
      valueStyle:
        "text-[#2a1f1d]",
      descriptionStyle:
        "text-[#8b736b]",
    },
  ];

  return (
    <>
      <AdminHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-4 py-8 text-[#2a1f1d] sm:px-5 sm:py-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              The Stud House Elite
            </p>

            <h1 className="mt-2 font-serif text-4xl md:text-5xl">
              Admin Dashboard
            </h1>

            <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55]">
              Manage products, monitor
              inventory, track orders and
              review store performance.
            </p>
          </div>

          {loading ? (
            <div className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-10 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />

              <p className="mt-4 text-sm text-[#6e5b55]">
                Loading dashboard...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-[30px] border border-red-100 bg-red-50/80 p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle
                  size={24}
                />
              </div>

              <h2 className="mt-4 font-serif text-2xl text-red-700">
                Dashboard Error
              </h2>

              <p className="mt-3 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2a1f1d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
              >
                <RefreshCw
                  size={16}
                />
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">

                {cards.map(
                  (card) => {
                    const Icon =
                      card.icon;

                    return (
                      <Link
                        key={
                          card.label
                        }
                        href={
                          card.href
                        }
                        className={`group rounded-[22px] border p-4 shadow-[0_12px_35px_rgba(70,45,38,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,38,0.08)] sm:rounded-[26px] sm:p-5 lg:p-6 ${card.wrapper}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11 ${card.iconStyle}`}
                          >
                            <Icon
                              size={18}
                            />
                          </div>

                          <ChevronRight
                            size={15}
                            className="mt-1 text-[#b98b67] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                          />
                        </div>

                        <p className="mt-4 text-xs font-medium leading-5 text-[#6e5b55] sm:mt-5 sm:text-sm">
                          {
                            card.label
                          }
                        </p>

                        <h2
                          className={`mt-2 font-serif text-3xl sm:text-4xl ${card.valueStyle}`}
                        >
                          {
                            card.value
                          }
                        </h2>

                        <p
                          className={`mt-2 text-[11px] leading-4 sm:text-xs ${card.descriptionStyle}`}
                        >
                          {
                            card.description
                          }
                        </p>
                      </Link>
                    );
                  }
                )}

                {/* Revenue */}
                <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#241916] via-[#2b1d19] to-[#1f1512] p-4 text-white shadow-[0_18px_45px_rgba(42,31,29,0.16)] sm:rounded-[26px] sm:p-5 lg:p-6">

                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#e8c4ac]/10 blur-2xl" />

                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[#e8c4ac] sm:h-11 sm:w-11">
                      <CircleDollarSign
                        size={19}
                      />
                    </div>

                    <p className="mt-4 text-xs text-white/60 sm:mt-5 sm:text-sm">
                      Paid Revenue
                    </p>

                    <h2 className="mt-2 break-words font-serif text-2xl leading-tight text-[#e8c4ac] sm:text-3xl">
                      ₹
                      {Number(
                        dashboard.paidRevenue
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </h2>

                    <p className="mt-2 text-[11px] leading-4 text-white/40 sm:text-xs">
                      Successful paid orders
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-8 grid gap-5 md:grid-cols-2 sm:mt-10 sm:gap-6">

                <Link
                  href="/admin/products"
                  className="group relative overflow-hidden rounded-[26px] border border-[#ead8cf]/70 bg-white/85 p-6 shadow-[0_14px_40px_rgba(70,45,38,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(70,45,38,0.09)] sm:rounded-[30px] sm:p-8"
                >
                  <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#f3ded2] opacity-50 blur-2xl transition group-hover:scale-110" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                      <Boxes
                        size={21}
                      />
                    </div>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#b98b67]">
                      Products
                    </p>

                    <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                      Manage Products
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-7 text-[#6e5b55]">
                      Add products, edit
                      pricing, manage
                      inventory and control
                      homepage visibility.
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#b98b67]">
                      Open Products

                      <ChevronRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/orders"
                  className="group relative overflow-hidden rounded-[26px] border border-[#ead8cf]/70 bg-white/85 p-6 shadow-[0_14px_40px_rgba(70,45,38,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(70,45,38,0.09)] sm:rounded-[30px] sm:p-8"
                >
                  <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#f3ded2] opacity-50 blur-2xl transition group-hover:scale-110" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                      <ShoppingBag
                        size={21}
                      />
                    </div>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#b98b67]">
                      Orders
                    </p>

                    <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                      Manage Orders
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-7 text-[#6e5b55]">
                      Review customer
                      orders, payment
                      details, tracking
                      information and
                      delivery progress.
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#b98b67]">
                      Open Orders

                      <ChevronRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}