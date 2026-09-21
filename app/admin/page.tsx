"use client";

import AdminHeader from "./AdminHeader";
import { useEffect, useState } from "react";
import Link from "next/link";

type DashboardData = {
  totalProducts: number;
  lowStock: number;
  totalOrders: number;
  pendingOrders: number;
  paidRevenue: number;
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    pendingOrders: 0,
    paidRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const response = await fetch("/api/admin/dashboard");

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error("Failed to load dashboard:", result);
        setLoading(false);
        return;
      }

      setDashboard(result.dashboard);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  return (
    <>
      <AdminHeader />

      <main className="min-h-screen bg-[#fffaf8] px-5 py-10 text-[#2a1f1d]">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              The Stud House Elite
            </p>

            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-[#6e5b55]">
              Manage products, stock, orders and store activity.
            </p>
          </div>

          {loading ? (
            <div className="rounded-[24px] border border-[#ead8cf] bg-white p-10 text-center text-[#6e5b55]">
              Loading dashboard...
            </div>
          ) : (
            <>
              {/* Dashboard Summary */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-[24px] border border-[#ead8cf] bg-white p-6">
                  <p className="text-sm text-[#8b736b]">
                    Total Products
                  </p>

                  <h2 className="mt-2 font-serif text-3xl">
                    {dashboard.totalProducts}
                  </h2>
                </div>

                <div className="rounded-[24px] border border-[#ead8cf] bg-white p-6">
                  <p className="text-sm text-[#8b736b]">
                    Low Stock
                  </p>

                  <h2 className="mt-2 font-serif text-3xl">
                    {dashboard.lowStock}
                  </h2>

                  <p className="mt-2 text-xs text-[#8b736b]">
                    5 units or less
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#ead8cf] bg-white p-6">
                  <p className="text-sm text-[#8b736b]">
                    Total Orders
                  </p>

                  <h2 className="mt-2 font-serif text-3xl">
                    {dashboard.totalOrders}
                  </h2>
                </div>

                <div className="rounded-[24px] border border-[#ead8cf] bg-white p-6">
                  <p className="text-sm text-[#8b736b]">
                    Pending Orders
                  </p>

                  <h2 className="mt-2 font-serif text-3xl">
                    {dashboard.pendingOrders}
                  </h2>
                </div>

                <div className="rounded-[24px] border border-[#ead8cf] bg-[#2a1f1d] p-6 text-white">
                  <p className="text-sm text-white/60">
                    Paid Revenue
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-[#e8c4ac]">
                    ₹
                    {Number(
                      dashboard.paidRevenue
                    ).toLocaleString("en-IN")}
                  </h2>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <Link
                  href="/admin/products"
                  className="group rounded-[28px] border border-[#ead8cf] bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b98b67]">
                    Products
                  </p>

                  <h2 className="mt-3 font-serif text-3xl">
                    Manage Products
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#6e5b55]">
                    Add products, edit pricing, update stock and control homepage
                    visibility.
                  </p>

                  <p className="mt-6 text-sm font-semibold text-[#b98b67]">
                    Open Products →
                  </p>
                </Link>

                <Link
                  href="/admin/orders"
                  className="group rounded-[28px] border border-[#ead8cf] bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b98b67]">
                    Orders
                  </p>

                  <h2 className="mt-3 font-serif text-3xl">
                    Manage Orders
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#6e5b55]">
                    View customer orders, payment details and update delivery
                    status.
                  </p>

                  <p className="mt-6 text-sm font-semibold text-[#b98b67]">
                    Open Orders →
                  </p>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}