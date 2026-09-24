"use client";

import AdminHeader from "../../AdminHeader";
import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  Save,
  Truck,
  UserRound,
} from "lucide-react";

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

  courier_name: string | null;
  tracking_number: string | null;
  tracking_url: string | null;

  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;

  created_at: string;

  order_items: OrderItem[];
};

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId =
    params.id as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("");

  const [
    courierName,
    setCourierName,
  ] = useState("");

  const [
    trackingNumber,
    setTrackingNumber,
  ] = useState("");

  const [
    trackingUrl,
    setTrackingUrl,
  ] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      const response = await fetch(
        `/api/admin/orders/${orderId}`
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.error ||
            "Unable to load order."
        );

        setLoading(false);
        return;
      }

      const loadedOrder =
        result.order as Order;

      setOrder(loadedOrder);

      setSelectedStatus(
        loadedOrder.order_status
      );

      setCourierName(
        loadedOrder.courier_name || ""
      );

      setTrackingNumber(
        loadedOrder.tracking_number || ""
      );

      setTrackingUrl(
        loadedOrder.tracking_url || ""
      );

      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  const saveOrderUpdate =
    async () => {
      if (!order) return;

      if (
        selectedStatus ===
          "shipped" &&
        !courierName.trim()
      ) {
        setMessage(
          "Please enter the courier name before marking this order as shipped."
        );

        return;
      }

      if (
        selectedStatus ===
          "shipped" &&
        !trackingNumber.trim()
      ) {
        setMessage(
          "Please enter the tracking number before marking this order as shipped."
        );

        return;
      }

      setSaving(true);
      setMessage("");

      try {
        const response = await fetch(
          `/api/admin/orders/${orderId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              order_status:
                selectedStatus,

              courier_name:
                courierName,

              tracking_number:
                trackingNumber,

              tracking_url:
                trackingUrl,
            }),
          }
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          setMessage(
            result.error ||
              "Unable to update order."
          );

          return;
        }

        setOrder({
          ...order,

          order_status:
            result.order.order_status,

          courier_name:
            result.order.courier_name,

          tracking_number:
            result.order
              .tracking_number,

          tracking_url:
            result.order.tracking_url,
        });

        if (
          selectedStatus ===
          "shipped"
        ) {
          setMessage(
            "Order marked as shipped successfully. Shipping email will be sent to the customer."
          );
        } else if (
          selectedStatus ===
          "delivered"
        ) {
          setMessage(
            "Order marked as delivered successfully. Delivery email will be sent to the customer."
          );
        } else {
          setMessage(
            "Order updated successfully."
          );
        }
      } catch (error) {
        console.error(
          "Order update error:",
          error
        );

        setMessage(
          "Unable to update order."
        );
      } finally {
        setSaving(false);
      }
    };

  const copyText = async (
    value: string
  ) => {
    try {
      await navigator.clipboard.writeText(
        value
      );
    } catch {
      // Clipboard may be unavailable.
    }
  };

  const getStatusStyle = (
    status: string
  ) => {
    const normalized =
      status.toLowerCase();

    if (normalized === "confirmed") {
      return "bg-blue-500/15 text-blue-300";
    }

    if (normalized === "shipped") {
      return "bg-amber-500/15 text-amber-300";
    }

    if (normalized === "delivered") {
      return "bg-green-500/15 text-green-300";
    }

    if (normalized === "cancelled") {
      return "bg-red-500/15 text-red-300";
    }

    return "bg-white/10 text-[#e8c4ac]";
  };

  if (loading) {
    return (
      <>
        <AdminHeader />

        <main className="flex min-h-screen items-center justify-center bg-[#fffaf8]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />

            <p className="mt-4 text-sm text-[#6e5b55]">
              Loading order...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <AdminHeader />

        <main className="flex min-h-screen items-center justify-center bg-[#fffaf8] px-5">
          <div className="text-center">
            <h1 className="font-serif text-4xl text-[#2a1f1d]">
              Order Not Found
            </h1>

            <p className="mt-3 text-[#6e5b55]">
              {message ||
                "Unable to load this order."}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/orders"
                )
              }
              className="mt-6 rounded-full bg-[#2a1f1d] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
            >
              Back to Orders
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-5 py-10 text-[#2a1f1d]">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
                Admin Order
              </p>

              <h1 className="mt-2 font-serif text-4xl md:text-5xl">
                Order #{order.id}
              </h1>

              <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

              <div className="mt-4 flex items-center gap-2 text-sm text-[#6e5b55]">
                <CalendarDays
                  size={15}
                />

                {new Date(
                  order.created_at
                ).toLocaleString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/orders"
                )
              }
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#d9b69f] bg-white px-6 py-3 text-sm font-semibold text-[#8a6248] transition hover:bg-[#b98b67] hover:text-white"
            >
              <ArrowLeft
                size={16}
                className="transition group-hover:-translate-x-1"
              />

              Back to Orders
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">

            {/* LEFT */}
            <div className="space-y-8">

              {/* Customer */}
              <section className="rounded-[30px] border border-[#ead8cf]/70 bg-white/85 p-6 shadow-[0_14px_40px_rgba(70,45,38,0.05)] backdrop-blur-sm md:p-8">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                    <UserRound
                      size={20}
                    />
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl">
                      Customer Details
                    </h2>

                    <p className="mt-1 text-sm text-[#8b736b]">
                      Contact and delivery
                      information for this
                      order.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  <div className="rounded-[18px] border border-[#f0e4df] bg-[#fffaf8] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b837a]">
                      Customer Name
                    </p>

                    <p className="mt-2 font-semibold">
                      {
                        order.customer_name
                      }
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-[#f0e4df] bg-[#fffaf8] p-4">
                    <div className="flex items-center gap-2">
                      <Phone
                        size={15}
                        className="text-[#b98b67]"
                      />

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b837a]">
                        Mobile
                      </p>
                    </div>

                    <p className="mt-2 font-semibold">
                      {order.mobile}
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-[#f0e4df] bg-[#fffaf8] p-4">
                    <div className="flex items-center gap-2">
                      <Mail
                        size={15}
                        className="text-[#b98b67]"
                      />

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b837a]">
                        Email
                      </p>
                    </div>

                    <p className="mt-2 break-all text-sm">
                      {order.email}
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-[#f0e4df] bg-[#fffaf8] p-4">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={15}
                        className="text-[#b98b67]"
                      />

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b837a]">
                        Pincode
                      </p>
                    </div>

                    <p className="mt-2 font-semibold">
                      {order.pincode}
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-[#f0e4df] bg-[#fffaf8] p-5 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={15}
                        className="text-[#b98b67]"
                      />

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b837a]">
                        Delivery Address
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-7">
                      {order.address}

                      <br />

                      {order.landmark &&
                        `${order.landmark}, `}

                      {order.city},{" "}
                      {order.state} -{" "}
                      {order.pincode}
                    </p>
                  </div>
                </div>
              </section>

              {/* Order Items */}
              <section className="rounded-[30px] border border-[#ead8cf]/70 bg-white/85 p-6 shadow-[0_14px_40px_rgba(70,45,38,0.05)] backdrop-blur-sm md:p-8">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                    <ReceiptText
                      size={20}
                    />
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl">
                      Order Items
                    </h2>

                    <p className="mt-1 text-sm text-[#8b736b]">
                      {
                        order.order_items
                          ?.length || 0
                      }{" "}
                      item
                      {order.order_items
                        ?.length === 1
                        ? ""
                        : "s"}{" "}
                      in this order.
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-[22px] border border-[#f0e4df]">

                  {order.order_items?.map(
                    (item, index) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-5 bg-[#fffdfc] p-5 ${
                          index !==
                          order.order_items.length -
                            1
                            ? "border-b border-[#f0e4df]"
                            : ""
                        }`}
                      >
                        <div>
                          <p className="font-semibold">
                            {
                              item.product_name
                            }
                          </p>

                          <p className="mt-1 text-sm text-[#8b736b]">
                            ₹
                            {Number(
                              item.price
                            ).toLocaleString(
                              "en-IN"
                            )}{" "}
                            ×{" "}
                            {item.quantity}
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
                    )
                  )}
                </div>
              </section>

              {/* Tracking */}
              <section className="rounded-[30px] border border-[#ead8cf]/70 bg-white/85 p-6 shadow-[0_14px_40px_rgba(70,45,38,0.05)] backdrop-blur-sm md:p-8">

                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                    <Truck
                      size={20}
                    />
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl">
                      Shipping & Tracking
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#6e5b55]">
                      Add courier details
                      before marking this
                      order as shipped.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Courier Name
                    </label>

                    <input
                      type="text"
                      value={
                        courierName
                      }
                      onChange={(e) =>
                        setCourierName(
                          e.target.value
                        )
                      }
                      placeholder="Example: Blue Dart"
                      className="w-full rounded-[16px] border border-[#dcc9bf] bg-[#fffaf8] px-4 py-3.5 text-sm outline-none transition focus:border-[#b98b67] focus:ring-4 focus:ring-[#b98b67]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Tracking Number
                    </label>

                    <input
                      type="text"
                      value={
                        trackingNumber
                      }
                      onChange={(e) =>
                        setTrackingNumber(
                          e.target.value
                        )
                      }
                      placeholder="Enter tracking / AWB number"
                      className="w-full rounded-[16px] border border-[#dcc9bf] bg-[#fffaf8] px-4 py-3.5 text-sm outline-none transition focus:border-[#b98b67] focus:ring-4 focus:ring-[#b98b67]/10"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold">
                      Tracking URL

                      <span className="ml-2 text-xs font-normal text-[#8b736b]">
                        Optional
                      </span>
                    </label>

                    <input
                      type="url"
                      value={
                        trackingUrl
                      }
                      onChange={(e) =>
                        setTrackingUrl(
                          e.target.value
                        )
                      }
                      placeholder="https://courierwebsite.com/track/..."
                      className="w-full rounded-[16px] border border-[#dcc9bf] bg-[#fffaf8] px-4 py-3.5 text-sm outline-none transition focus:border-[#b98b67] focus:ring-4 focus:ring-[#b98b67]/10"
                    />
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="mt-6 rounded-[22px] border border-[#e4cbbb] bg-gradient-to-br from-[#fffaf8] to-[#fff3ee] p-5">

                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-green-600"
                      />

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b98b67]">
                        Saved Tracking Details
                      </p>
                    </div>

                    <div className="mt-4 space-y-3 text-sm">

                      {order.courier_name && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[#8b736b]">
                            Courier:
                          </span>

                          <strong>
                            {
                              order.courier_name
                            }
                          </strong>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[#8b736b]">
                          Tracking:
                        </span>

                        <strong>
                          {
                            order.tracking_number
                          }
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            copyText(
                              order.tracking_number ||
                                ""
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dcc9bf] bg-white text-[#b98b67] transition hover:bg-[#b98b67] hover:text-white"
                          title="Copy tracking number"
                        >
                          <Copy
                            size={14}
                          />
                        </button>
                      </div>

                      {order.tracking_url && (
                        <a
                          href={
                            order.tracking_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-[#d9b69f] bg-white px-4 py-2 text-xs font-semibold text-[#8a6248] transition hover:bg-[#b98b67] hover:text-white"
                        >
                          Open Tracking Page

                          <ExternalLink
                            size={13}
                          />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* SUMMARY */}
            <aside className="h-fit rounded-[30px] bg-gradient-to-br from-[#241916] via-[#2b1d19] to-[#1f1512] p-7 text-white shadow-[0_22px_60px_rgba(42,31,29,0.18)] lg:sticky lg:top-28">

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d9aa86]">
                Order Management
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-4 h-px w-12 bg-[#b98b67]/70" />

              <div className="mt-6 space-y-5">

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <CreditCard
                      size={15}
                    />
                    Payment
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      order.payment_status ===
                      "paid"
                        ? "bg-green-500/15 text-green-300"
                        : "bg-yellow-500/15 text-yellow-300"
                    }`}
                  >
                    {
                      order.payment_status
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <PackageCheck
                      size={15}
                    />
                    Current Status
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                      order.order_status
                    )}`}
                  >
                    {
                      order.order_status
                    }
                  </span>
                </div>

                <div className="border-t border-white/15 pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="font-serif text-3xl text-[#e8c4ac]">
                      ₹
                      {Number(
                        order.total_amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>

                {order.razorpay_order_id && (
                  <div className="border-t border-white/10 pt-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                      Razorpay Order
                    </p>

                    <p className="mt-2 break-all text-xs leading-5 text-white/60">
                      {
                        order.razorpay_order_id
                      }
                    </p>
                  </div>
                )}

                {order.razorpay_payment_id && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                      Razorpay Payment
                    </p>

                    <p className="mt-2 break-all text-xs leading-5 text-white/60">
                      {
                        order.razorpay_payment_id
                      }
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
                  value={
                    selectedStatus
                  }
                  disabled={saving}
                  onChange={(e) => {
                    setSelectedStatus(
                      e.target.value
                    );

                    setMessage("");
                  }}
                  className="w-full rounded-[14px] border border-white/15 bg-white px-4 py-3.5 text-sm text-[#2a1f1d] outline-none"
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

                {selectedStatus ===
                  "shipped" && (
                  <div className="mt-4 rounded-[18px] border border-[#e8c4ac]/20 bg-[#e8c4ac]/10 p-4">
                    <Truck
                      size={19}
                      className="text-[#e8c4ac]"
                    />

                    <p className="mt-2 text-xs leading-5 text-white/65">
                      Saving as Shipped
                      will automatically
                      send the shipping
                      confirmation email
                      with the tracking
                      details above.
                    </p>
                  </div>
                )}

                {selectedStatus ===
                  "delivered" && (
                  <div className="mt-4 rounded-[18px] border border-green-400/20 bg-green-500/10 p-4">
                    <CheckCircle2
                      size={19}
                      className="text-green-300"
                    />

                    <p className="mt-2 text-xs leading-5 text-white/65">
                      Saving as Delivered
                      will automatically
                      send the delivery
                      confirmation email.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={
                    saveOrderUpdate
                  }
                  disabled={saving}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#e8c4ac] px-5 py-4 text-sm font-semibold text-[#2a1f1d] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Order Update"}
                </button>

                {message && (
                  <div className="mt-4 rounded-[16px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="text-xs leading-5 text-[#e8c4ac]">
                      {message}
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}