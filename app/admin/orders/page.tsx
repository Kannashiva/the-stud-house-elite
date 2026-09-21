"use client";
import AdminHeader from "../AdminHeader";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
  const response = await fetch("/api/admin/orders");

  const result = await response.json();

  if (!response.ok || !result.success) {
    console.error("Failed to load orders:", result);
    setLoading(false);
    return;
  }

  setOrders(result.orders || []);
  setLoading(false);
};

    loadOrders();
  }, []);

  return (
  <>
    <AdminHeader />

    <main className="min-h-screen bg-[#fffaf8] px-5 py-10 text-[#2a1f1d]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
            Admin
          </p>

          <h1 className="mt-2 font-serif text-4xl">
            Orders
          </h1>

          <p className="mt-2 text-sm text-[#6e5b55]">
            View customer orders, payment status and delivery progress.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-[#ead8cf] bg-white p-10 text-center text-[#6e5b55]">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[24px] border border-[#ead8cf] bg-white p-10 text-center">
            <h2 className="font-serif text-2xl">
              No Orders Yet
            </h2>

            <p className="mt-2 text-sm text-[#6e5b55]">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[24px] border border-[#ead8cf] bg-white">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-[#ead8cf] bg-[#fffaf8]">
                <tr>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Order Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#f0e4df] transition hover:bg-[#fffaf8] last:border-b-0"
                  >
                    <td className="px-5 py-4 font-semibold">
                      #{order.id}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold">
                          {order.customer_name}
                        </p>

                        <p className="mt-1 text-xs text-[#8b736b]">
                          {order.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {order.mobile}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.payment_status === "paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#f8efe7] px-3 py-1 text-xs font-semibold text-[#9a6b48]">
                        {order.order_status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[#6e5b55]">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex rounded-full border border-[#b98b67] px-4 py-2 text-xs font-semibold transition hover:bg-[#b98b67] hover:text-white"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  </>
);
}