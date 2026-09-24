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
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Headphones,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
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
  payment_mode: string | null;

  courier_name: string | null;
  tracking_number: string | null;
  tracking_url: string | null;

  razorpay_payment_id: string | null;
  created_at: string;
};

type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string | null;
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

  const [copied, setCopied] =
    useState(false);

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

        if (
          response.status === 401
        ) {
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
      return "border-green-400/20 bg-green-500/15 text-green-300";
    }

    if (
      normalized === "shipped" ||
      normalized === "dispatched"
    ) {
      return "border-blue-400/20 bg-blue-500/15 text-blue-300";
    }

    if (
      normalized === "cancelled"
    ) {
      return "border-red-400/20 bg-red-500/15 text-red-300";
    }

    return "border-white/10 bg-white/10 text-white";
  };

  const copyTrackingNumber =
    async () => {
      if (
        !order?.tracking_number
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          order.tracking_number
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1800);
      } catch {
        // Clipboard may be unavailable.
      }
    };

  if (loading) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fff3ee] px-5 py-16 text-[#2a1f1d]">
          <div className="flex min-h-[55vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />

              <p className="mt-4 text-sm text-[#6e5b55]">
                Loading your order...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fff3ee] px-5 py-16 text-[#2a1f1d]">
          <div className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center">
            <div className="w-full max-w-xl rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-8 text-center shadow-[0_16px_45px_rgba(70,45,38,0.07)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                <ReceiptText
                  size={27}
                />
              </div>

              <h1 className="mt-5 font-serif text-4xl">
                Order Not Available
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#6e5b55]">
                {error ||
                  "We could not find this order."}
              </p>

              <Link
                href="/account/orders"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#2a1f1d] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
              >
                <ArrowLeft size={17} />
                Back to My Orders
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const hasTracking =
    Boolean(
      order.courier_name ||
        order.tracking_number ||
        order.tracking_url
    );

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-5 pb-16 pt-10 text-[#2a1f1d] md:pb-20">
        <div className="mx-auto max-w-6xl">

          {/* Back */}
          <Link
            href="/account/orders"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#8a6248] transition hover:text-[#b98b67]"
          >
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-1"
            />

            Back to My Orders
          </Link>

          {/* Header + Tracking */}
          <div className="mt-7 grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-stretch">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
                Order Details
              </p>

              <h1 className="mt-2 font-serif text-4xl md:text-5xl">
                Order #{order.id}
              </h1>

              <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

              <div className="mt-4 flex items-center gap-2 text-sm text-[#6e5b55]">
                <CalendarDays
                  size={16}
                  className="text-[#b98b67]"
                />

                <span>
                  Placed on {formatDate(order.created_at)}
                </span>
              </div>
            </div>

            {hasTracking && (
              <section className="relative h-full overflow-hidden rounded-[30px] border border-[#dac0ae] bg-gradient-to-r from-[#fff7f2] via-white to-[#f8ebe3] p-6 shadow-[0_14px_40px_rgba(70,45,38,0.07)] sm:p-7">
                <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#eac8b5]/25 blur-3xl" />

                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2a1f1d] text-[#e8c4ac]">
                      <Truck size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b98b67]">
                        Shipment Tracking
                      </p>

                      <h2 className="mt-1 font-serif text-2xl leading-tight">
                        Your Order is on the Way
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[#6e5b55]">
                        Use the tracking details below to follow your shipment.
                      </p>
                    </div>
                  </div>

                  {order.order_status.toLowerCase() === "delivered" && (
                    <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                      <CheckCircle2 size={15} />
                      Delivered
                    </div>
                  )}

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {order.courier_name && (
                      <div className="rounded-[20px] border border-[#ead8cf]/70 bg-white/80 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-[#8b736b]">
                          Courier Partner
                        </p>

                        <p className="mt-2 font-semibold">
                          {order.courier_name}
                        </p>
                      </div>
                    )}

                    {order.tracking_number && (
                      <div className="rounded-[20px] border border-[#ead8cf]/70 bg-white/80 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-[#8b736b]">
                          Tracking Number
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <p className="break-all font-semibold">
                            {order.tracking_number}
                          </p>

                          <button
                            type="button"
                            onClick={copyTrackingNumber}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b98b67] transition hover:text-[#2a1f1d]"
                          >
                            {copied ? (
                              <>
                                <CheckCircle2 size={14} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="group mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67]"
                    >
                      Track Your Order

                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Main */}
          <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

            {/* Left Column: Items + Shipping */}
            <div className="flex min-w-0 flex-col gap-6">
              {/* Items */}
              <section className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-6 shadow-[0_14px_40px_rgba(70,45,38,0.06)] backdrop-blur-sm sm:p-7">

              <div className="flex items-center gap-4 border-b border-[#ead8cf]/70 pb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                  <ShoppingBag
                    size={20}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b98b67]">
                    Purchase
                  </p>

                  <h2 className="mt-1 font-serif text-2xl">
                    Items
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {items.map(
                  (item) => {
                    const lineTotal =
                      Number(
                        item.price
                      ) *
                      item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="rounded-[22px] border border-[#ead8cf]/60 bg-[#fffaf8] p-4 transition hover:border-[#dfc6b8] sm:p-5"
                      >
                        <div className="flex items-start gap-4">
                          <Link
                            href={`/product/${item.product_id}`}
                            className="h-24 w-24 shrink-0 overflow-hidden rounded-[18px] border border-[#ead8cf]/70 bg-white sm:h-28 sm:w-28"
                          >
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#b98b67]">
                                <ShoppingBag size={24} />
                              </div>
                            )}
                          </Link>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <Link
                                  href={`/product/${item.product_id}`}
                                  className="font-serif text-lg transition hover:text-[#b98b67] sm:text-xl"
                                >
                                  {item.product_name}
                                </Link>

                                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#8b736b]">
                                  <span>
                                    Quantity:{" "}
                                    <strong className="text-[#2a1f1d]">
                                      {item.quantity}
                                    </strong>
                                  </span>

                                  <span>
                                    ₹
                                    {Number(
                                      item.price
                                    ).toLocaleString(
                                      "en-IN"
                                    )}{" "}
                                    each
                                  </span>
                                </div>
                              </div>

                              <div className="shrink-0 sm:text-right">
                                <p className="text-[11px] uppercase tracking-[0.14em] text-[#9b837a]">
                                  Item Total
                                </p>

                                <p className="mt-1 font-serif text-lg sm:text-xl">
                                  ₹
                                  {lineTotal.toLocaleString(
                                    "en-IN"
                                  )}
                                </p>
                              </div>
                            </div>

                            <Link
                              href={`/product/${item.product_id}`}
                              className="group mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#b98b67] transition hover:text-[#2a1f1d]"
                            >
                              View Product

                              <ArrowRight
                                size={14}
                                className="transition group-hover:translate-x-1"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </section>

                {/* Shipping Details */}
                <section className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-6 shadow-[0_12px_35px_rgba(70,45,38,0.05)] sm:p-7">

              <div className="flex items-start gap-4 border-b border-[#ead8cf]/70 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                  <Truck size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b98b67]">
                    Delivery
                  </p>

                  <h2 className="mt-1 font-serif text-2xl">
                    Shipping Details
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-[20px] bg-[#fffaf8] p-5">
                  <div className="flex gap-3">
                    <PackageCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-[#b98b67]"
                    />

                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8b736b]">
                        Customer
                      </p>

                      <p className="mt-2 font-semibold">
                        {
                          order.customer_name
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[20px] bg-[#fffaf8] p-5">
                  <div className="flex gap-3">
                    <Phone
                      size={18}
                      className="mt-0.5 shrink-0 text-[#b98b67]"
                    />

                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8b736b]">
                        Mobile
                      </p>

                      <p className="mt-2 font-semibold">
                        {order.mobile}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[20px] bg-[#fffaf8] p-5">
                  <div className="flex gap-3">
                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-[#b98b67]"
                    />

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8b736b]">
                        Email
                      </p>

                      <p className="mt-2 break-all font-semibold">
                        {order.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[20px] bg-[#fffaf8] p-5">
                  <div className="flex gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#b98b67]"
                    />

                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8b736b]">
                        PIN Code
                      </p>

                      <p className="mt-2 font-semibold">
                        {order.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[20px] bg-[#fffaf8] p-5 sm:col-span-2">
                  <div className="flex gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#b98b67]"
                    />

                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8b736b]">
                        Delivery Address
                      </p>

                      <p className="mt-2 font-semibold leading-7">
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
                </div>
              </div>
            </section>
            </div>

            {/* Summary */}
            <aside className="h-full overflow-hidden rounded-[30px] border border-[#b98b67]/20 bg-gradient-to-br from-[#241916] via-[#2b1d19] to-[#1f1512] p-7 text-white shadow-[0_22px_60px_rgba(42,31,29,0.18)]">

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d9aa86]">
                Purchase Summary
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-4 h-px w-12 bg-[#b98b67]/70" />

              <div className="mt-7 space-y-5 text-sm">

                <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <PackageCheck
                      size={18}
                      className="text-[#e8c4ac]"
                    />

                    <div>
                      <p className="text-xs text-white/45">
                        Order Status
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClasses(
                          order.order_status
                        )}`}
                      >
                        {
                          order.order_status
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#e8c4ac]"
                  />

                  <div>
                    <p className="text-white/45">
                      Payment Status
                    </p>

                    <p className="mt-1 font-semibold capitalize">
                      {
                        order.payment_status
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard
                    size={18}
                    className="mt-0.5 shrink-0 text-[#e8c4ac]"
                  />

                  <div className="space-y-3">
                    <div>
                      <p className="text-white/45">
                        Payment Gateway
                      </p>

                      <p className="mt-1 font-semibold">
                        Razorpay
                      </p>
                    </div>

                    <div>
                      <p className="text-white/45">
                        Payment Mode
                      </p>

                      <p className="mt-1 font-semibold">
                        {order.payment_mode ||
                          "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                {order.razorpay_payment_id && (
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs text-white/45">
                      Payment ID
                    </p>

                    <p className="mt-2 break-all text-xs font-medium leading-5 text-white/75">
                      {
                        order.razorpay_payment_id
                      }
                    </p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        Total Paid
                      </p>

                      <p className="mt-1 text-[11px] text-white/40">
                        Order total
                      </p>
                    </div>

                    <span className="font-serif text-2xl text-[#e8c4ac]">
                      ₹
                      {Number(
                        order.total_amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/45">
                  <ShieldCheck
                    size={16}
                    className="text-[#e8c4ac]"
                  />

                  Secure payment processed
                  through Razorpay
                </div>
                {/* Support */}
                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-start gap-3">
                    <Headphones
                      size={18}
                      className="mt-0.5 shrink-0 text-[#e8c4ac]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8c4ac]">
                        Need Help?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/50">
                        Contact us for help with shipping,
                        delivery, cancellation, or returns.
                      </p>

                      <Link
                        href="/contact"
                        className="group mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#e8c4ac] hover:text-[#2a1f1d]"
                      >
                        Contact Support

                        <ArrowRight
                          size={14}
                          className="transition group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </aside>
          </div>

        </div>
      </main>
    </>
  );
}