"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  customer_name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  order_items: OrderItem[];
};

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      const response = await fetch(
        `/api/admin/orders/${orderId}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.error || "Unable to load order.");
        setLoading(false);
        return;
      }

      setOrder(result.order);
      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  const updateOrderStatus = async (
    newStatus: string
  ) => {
    if (!order) return;

    setSaving(true);
    setMessage("");

    const response = await fetch(
      `/api/admin/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_status: newStatus,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      setMessage(
        result.error || "Unable to update order status."
      );
      setSaving(false);
      return;
    }

    setOrder({
      ...order,
      order_status: result.order.order_status,
    });

    setMessage("Order status updated successfully.");
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf8]">
        <p className="text-[#6e5b55]">
          Loading order...
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf8] px-5">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-[#2a1f1d]">
            Order Not Found
          </h1>

          <p className="mt-3 text-[#6e5b55]">
            {message || "Unable to load this order."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/admin/orders")}
            className="mt-6 rounded-full bg-[#2a1f1d] px-7 py-3 text-sm font-semibold text-white"
          >
            Back to Orders
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf8] px-5 py-10 text-[#2a1f1d]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Admin Order
            </p>

            <h1 className="mt-2 font-serif text-4xl">
              Order #{order.id}
            </h1>

            <p className="mt-2 text-sm text-[#6e5b55]">
              {new Date(order.created_at).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/orders")}
            className="rounded-full border border-[#b98b67] px-6 py-3 text-sm font-semibold transition hover:bg-[#b98b67] hover:text-white"
          >
            Back to Orders
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* Customer Details */}
            <section className="rounded-[28px] border border-[#ead8cf] bg-white p-6 md:p-8">
              <h2 className="font-serif text-2xl">
                Customer Details
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9b837a]">
                    Name
                  </p>

                  <p className="mt-1 font-semibold">
                    {order.customer_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9b837a]">
                    Mobile
                  </p>

                  <p className="mt-1 font-semibold">
                    {order.mobile}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9b837a]">
                    Email
                  </p>

                  <p className="mt-1">
                    {order.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9b837a]">
                    Pincode
                  </p>

                  <p className="mt-1">
                    {order.pincode}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9b837a]">
                    Delivery Address
                  </p>

                  <p className="mt-1 leading-7">
                    {order.address}
                    <br />
                    {order.landmark &&
                      `${order.landmark}, `}
                    {order.city}, {order.state} -{" "}
                    {order.pincode}
                  </p>
                </div>
              </div>
            </section>

            {/* Order Items */}
            <section className="rounded-[28px] border border-[#ead8cf] bg-white p-6 md:p-8">
              <h2 className="font-serif text-2xl">
                Order Items
              </h2>

              <div className="mt-6 divide-y divide-[#f0e4df]">
                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-5 py-5 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.product_name}
                      </p>

                      <p className="mt-1 text-sm text-[#8b736b]">
                        ₹
                        {Number(item.price).toLocaleString(
                          "en-IN"
                        )}{" "}
                        × {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ₹
                      {(
                        Number(item.price) * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-[28px] bg-[#2a1f1d] p-7 text-white">
            <h2 className="font-serif text-2xl">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">
                  Payment
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.payment_status === "paid"
                      ? "bg-green-500/15 text-green-300"
                      : "bg-yellow-500/15 text-yellow-300"
                  }`}
                >
                  {order.payment_status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">
                  Order Status
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#e8c4ac]">
                  {order.order_status}
                </span>
              </div>

              <div className="border-t border-white/15 pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-semibold text-[#e8c4ac]">
                    ₹
                    {Number(
                      order.total_amount
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {order.razorpay_order_id && (
                <div className="border-t border-white/15 pt-5 text-xs text-white/50">
                  <p>
                    Razorpay Order:
                  </p>
                  <p className="mt-1 break-all">
                    {order.razorpay_order_id}
                  </p>
                </div>
              )}

              {order.razorpay_payment_id && (
                <div className="text-xs text-white/50">
                  <p>
                    Razorpay Payment:
                  </p>
                  <p className="mt-1 break-all">
                    {order.razorpay_payment_id}
                  </p>
                </div>
              )}
            </div>

            {/* Status Update */}
            <div className="mt-8 border-t border-white/15 pt-6">
              <label className="mb-2 block text-sm font-semibold">
                Update Order Status
              </label>

              <select
                value={order.order_status}
                disabled={saving}
                onChange={(e) =>
                  updateOrderStatus(e.target.value)
                }
                className="w-full rounded-[14px] border border-white/15 bg-white px-4 py-3 text-sm text-[#2a1f1d] outline-none"
              >
                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="shipped">
                  Shipped
                </option>

                <option value="delivered">
                  Delivered
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

              {saving && (
                <p className="mt-3 text-xs text-white/60">
                  Updating...
                </p>
              )}

              {message && (
                <p className="mt-3 text-xs text-[#e8c4ac]">
                  {message}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}