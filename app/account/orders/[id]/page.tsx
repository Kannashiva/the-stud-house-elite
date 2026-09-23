"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import StoreHeader from "../../../StoreHeader";
import { supabase } from "../../../../lib/supabase";

type Order = {
  id: number;
  customer_name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  total_amount: number;
  payment_status: string;
  order_status: string;
  razorpay_payment_id: string | null;
  created_at: string;
};

type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
};

export default function CustomerOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [items, setItems] =
    useState<OrderItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session) {
          router.replace(
            `/account/login?redirect=/account/orders/${orderId}`
          );

          return;
        }

        const response = await fetch(
          `/api/customer/orders/${orderId}`,
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
            `/account/login?redirect=/account/orders/${orderId}`
          );

          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          setError(
            result.error ||
              "Unable to load order."
          );

          return;
        }

        setOrder(result.order);
        setItems(result.items || []);
      } catch (error) {
        console.error(
          "Order loading error:",
          error
        );

        setError(
          "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, router]);

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
        hour: "2-digit",
        minute: "2-digit",
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
      return "bg-green-500/15 text-green-300";
    }

    if (
      normalized === "shipped" ||
      normalized === "dispatched"
    ) {
      return "bg-blue-500/15 text-blue-300";
    }

    if (normalized === "cancelled") {
      return "bg-red-500/15 text-red-300";
    }

    return "bg-white/10 text-white";
  };

  if (loading) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-[#2a1f1d]">
          <p className="text-center text-sm text-[#6e5b55]">
            Loading your order...
          </p>
        </main>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-[#2a1f1d]">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-serif text-4xl">
              Order Not Available
            </h1>

            <p className="mt-4 text-[#6e5b55]">
              {error ||
                "We could not find this order."}
            </p>

            <Link
              href="/account/orders"
              className="mt-7 inline-block rounded-full bg-[#2a1f1d] px-8 py-4 text-sm font-semibold text-white"
            >
              Back to My Orders
            </Link>
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
          <Link
            href="/account/orders"
            className="text-sm font-semibold text-[#b98b67] transition hover:text-[#2a1f1d]"
          >
            ← Back to My Orders
          </Link>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Order Details
            </p>

            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              Order #{order.id}
            </h1>

            <p className="mt-3 text-[#6e5b55]">
              Placed on{" "}
              {formatDate(
                order.created_at
              )}
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Order Items */}
            <section className="rounded-[28px] border border-[#ead8cf] bg-white p-7">
              <h2 className="font-serif text-2xl">
                Items
              </h2>

              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] bg-[#fffaf8] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${item.product_id}`}
                          className="font-serif text-lg transition hover:text-[#b98b67]"
                        >
                          {item.product_name}
                        </Link>

                        <p className="mt-2 text-sm text-[#8b736b]">
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-[#8b736b]">
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}{" "}
                          each
                        </p>
                      </div>

                      <p className="font-semibold">
                        ₹
                        {(
                          Number(
                            item.price
                          ) *
                          item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Order Summary */}
            <aside className="h-fit rounded-[28px] bg-[#2a1f1d] p-7 text-white">
              <h2 className="font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <p className="text-white/50">
                    Order Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-4 py-2 text-xs font-semibold capitalize ${getStatusClasses(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>
                </div>

                <div>
                  <p className="text-white/50">
                    Payment Status
                  </p>

                  <p className="mt-1 font-semibold capitalize">
                    {order.payment_status}
                  </p>
                </div>

                <div>
                  <p className="text-white/50">
                    Payment Method
                  </p>

                  <p className="mt-1 font-semibold">
                    Razorpay
                  </p>
                </div>

                {order.razorpay_payment_id && (
                  <div>
                    <p className="text-white/50">
                      Payment ID
                    </p>

                    <p className="mt-1 break-all text-xs font-medium text-white/80">
                      {
                        order.razorpay_payment_id
                      }
                    </p>
                  </div>
                )}

                <div className="border-t border-white/15 pt-5">
                  <div className="flex justify-between">
                    <span className="text-white/60">
                      Total
                    </span>

                    <span className="text-xl font-semibold text-[#e8c4ac]">
                      ₹
                      {Number(
                        order.total_amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Shipping Details */}
          <section className="mt-6 rounded-[28px] border border-[#ead8cf] bg-white p-7">
            <h2 className="font-serif text-2xl">
              Shipping Details
            </h2>

            <div className="mt-5 grid gap-6 text-sm sm:grid-cols-2">
              <div>
                <p className="text-[#8b736b]">
                  Customer
                </p>

                <p className="mt-1 font-semibold">
                  {order.customer_name}
                </p>
              </div>

              <div>
                <p className="text-[#8b736b]">
                  Mobile
                </p>

                <p className="mt-1 font-semibold">
                  {order.mobile}
                </p>
              </div>

              <div>
                <p className="text-[#8b736b]">
                  Email
                </p>

                <p className="mt-1 break-all font-semibold">
                  {order.email}
                </p>
              </div>

              <div>
                <p className="text-[#8b736b]">
                  PIN Code
                </p>

                <p className="mt-1 font-semibold">
                  {order.pincode}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[#8b736b]">
                  Delivery Address
                </p>

                <p className="mt-1 font-semibold leading-6">
                  {order.address}
                  {order.landmark
                    ? `, ${order.landmark}`
                    : ""}
                  , {order.city},{" "}
                  {order.state} -{" "}
                  {order.pincode}
                </p>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="mt-6 rounded-[28px] bg-[#f4e3da] p-7">
            <h2 className="font-serif text-2xl">
              Need Help With This Order?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6e5b55]">
              Contact our support team for help with shipping,
              delivery, cancellation, or returns.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-block rounded-full bg-[#2a1f1d] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}