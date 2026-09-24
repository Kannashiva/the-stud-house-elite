"use client";

import StoreHeader from "../StoreHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  const [authChecking, setAuthChecking] =
    useState(true);

  const { cart, subtotal, clearCart } =
    useCart();

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    });

  const [emailError, setEmailError] =
    useState("");

  const [mobileError, setMobileError] =
    useState("");

  const [pincodeError, setPincodeError] =
    useState("");

  const [formError, setFormError] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session) {
          router.replace(
            "/account/login?redirect=/checkout"
          );

          return;
        }

        setAuthChecking(false);
      } catch (error) {
        console.error(
          "Checkout auth check error:",
          error
        );

        router.replace(
          "/account/login?redirect=/checkout"
        );
      }
    };

    checkLogin();
  }, [router]);

  const inputClass =
    "w-full rounded-[16px] border border-[#dcc9bf] bg-white/80 px-4 py-3.5 text-sm text-[#2a1f1d] outline-none transition placeholder:text-[#ab9890] focus:border-[#b98b67] focus:ring-4 focus:ring-[#b98b67]/10";

  const loadRazorpayScript = () => {
    return new Promise<boolean>(
      (resolve) => {
        const existingScript =
          document.getElementById(
            "razorpay-checkout-script"
          );

        if (existingScript) {
          resolve(true);
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.id =
          "razorpay-checkout-script";

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () =>
          resolve(true);

        script.onerror = () =>
          resolve(false);

        document.body.appendChild(
          script
        );
      }
    );
  };

  const handleContinueToPayment =
    async () => {
      if (processing) return;

      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.mobile ||
        !formData.email ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.pincode
      ) {
        setFormError(
          "Please fill in all required fields."
        );
        return;
      }

      if (
        formData.mobile.length !== 10
      ) {
        setFormError(
          "Please enter a valid 10-digit mobile number."
        );
        return;
      }

      if (
        !formData.email.includes("@")
      ) {
        setFormError(
          "Please enter a valid email address."
        );
        return;
      }

      if (
        formData.pincode.length !== 6
      ) {
        setFormError(
          "Please enter a valid 6-digit pincode."
        );
        return;
      }

      setFormError("");
      setProcessing(true);

      try {
        const response = await fetch(
          "/api/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              customer_name: `${formData.firstName} ${formData.lastName}`,
              mobile: formData.mobile,
              email: formData.email,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode:
                formData.pincode,
              landmark:
                formData.landmark ||
                "",
              total_amount: subtotal,
              items: cart,
            }),
          }
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          console.error(
            "Order creation failed:",
            result
          );

          setFormError(
            "Unable to create order. Please try again."
          );

          setProcessing(false);
          return;
        }

        console.log(
          "Order created:",
          result.order
        );

        const scriptLoaded =
          await loadRazorpayScript();

        if (!scriptLoaded) {
          setFormError(
            "Unable to load payment gateway. Please try again."
          );

          setProcessing(false);
          return;
        }

        const paymentResponse =
          await fetch(
            "/api/create-payment-order",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                orderId:
                  result.order.id,
              }),
            }
          );

        const paymentResult =
          await paymentResponse.json();

        if (
          !paymentResponse.ok ||
          !paymentResult.success
        ) {
          console.log(
            "Payment gateway not configured yet:",
            paymentResult
          );

          setFormError(
            "Payment gateway is not configured yet. Your order has been saved."
          );

          setProcessing(false);
          return;
        }

        const options = {
          key: paymentResult.keyId,

          amount:
            paymentResult.paymentOrder
              .amount,

          currency:
            paymentResult.paymentOrder
              .currency,

          name:
            "The Stud House Elite",

          description:
            "Jewellery Order",

          order_id:
            paymentResult.paymentOrder.id,

          handler: async function (
            response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }
          ) {
            const verifyResponse =
              await fetch(
                "/api/verify-payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify(
                    {
                      orderId:
                        result.order.id,

                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature,
                    }
                  ),
                }
              );

            const verifyResult =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verifyResult.success
            ) {
              setFormError(
                "Payment received, but verification failed. Please contact support."
              );

              setProcessing(false);
              return;
            }

            console.log(
              "Payment verified successfully"
            );

            clearCart();

            router.push(
              `/order-success?order=${result.order.id}`
            );
          },

          modal: {
            ondismiss: function () {
              setProcessing(false);
            },
          },

          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.mobile,
          },

          theme: {
            color: "#b98b67",
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();
      } catch (error) {
        console.error(
          "Checkout error:",
          error
        );

        setFormError(
          "Something went wrong. Please try again."
        );

        setProcessing(false);
      }
    };

  if (authChecking) {
    return (
      <>
        <StoreHeader />

        <main className="flex min-h-screen items-center justify-center bg-[#fffaf8] px-5">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />

            <p className="mt-4 text-sm text-[#6e5b55]">
              Checking your account...
            </p>
          </div>
        </main>
      </>
    );
  }

  /* ---------------- EMPTY CART ---------------- */

  if (cart.length === 0) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fff3ee] px-5 py-14 text-[#2a1f1d]">
          <div className="mx-auto flex min-h-[62vh] max-w-3xl items-center justify-center">
            <div className="w-full max-w-xl rounded-[32px] border border-[#ead8cf]/70 bg-white/75 px-6 py-12 text-center shadow-[0_20px_60px_rgba(70,45,38,0.08)] backdrop-blur-sm sm:px-10">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#fff4ef] to-[#f1d8cb] text-[#b98b67]">
                <ShoppingBag
                  size={32}
                  strokeWidth={1.6}
                />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
                Secure Checkout
              </p>

              <h1 className="mt-3 font-serif text-4xl md:text-5xl">
                Your Cart is Empty
              </h1>

              <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

              <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#6e5b55] sm:text-base">
                Add something beautiful
                to your cart before
                proceeding to checkout.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2a1f1d] px-8 py-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(42,31,29,0.16)] transition hover:-translate-y-0.5 hover:bg-[#b98b67]"
              >
                <ShoppingBag
                  size={17}
                />
                Explore Collection
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-5 pb-16 pt-10 text-[#2a1f1d] md:pb-20">

        <div className="mx-auto max-w-7xl">

          {/* Back */}
          <Link
            href="/cart"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#8a6248] transition hover:text-[#b98b67]"
          >
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-1"
            />
            Back to Cart
          </Link>

          {/* Heading */}
          <div className="mb-9 mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
              Secure Checkout
            </p>

            <h1 className="mt-2 font-serif text-4xl md:text-5xl">
              Delivery Details
            </h1>

            <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
              Enter your delivery
              information below. Your
              details will be used to
              process and deliver your
              order safely.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8 grid grid-cols-3 overflow-hidden rounded-[22px] border border-[#ead8cf]/70 bg-white/70 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 border-r border-[#ead8cf]/70 px-3 py-4 text-center">
              <CheckCircle2
                size={17}
                className="hidden text-[#b98b67] sm:block"
              />

              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a6248] sm:text-xs">
                Cart
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 border-r border-[#ead8cf]/70 bg-[#fff3ed] px-3 py-4 text-center">
              <MapPin
                size={17}
                className="hidden text-[#b98b67] sm:block"
              />

              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2a1f1d] sm:text-xs">
                Delivery
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-4 text-center opacity-50">
              <CreditCard
                size={17}
                className="hidden sm:block"
              />

              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] sm:text-xs">
                Payment
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-10">

            {/* Customer Details */}
            <section className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 p-5 shadow-[0_14px_40px_rgba(70,45,38,0.06)] backdrop-blur-sm sm:p-7 md:p-8">

              {/* Form Header */}
              <div className="mb-7 flex items-start gap-4 border-b border-[#ead8cf]/70 pb-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                  <MapPin
                    size={20}
                  />
                </div>

                <div>
                  <h2 className="font-serif text-2xl">
                    Shipping Address
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#8b736b]">
                    Please provide a
                    complete address for
                    smooth delivery.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* First Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    First Name
                    <span className="ml-1 text-[#b98b67]">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      formData.firstName
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstName:
                          e.target.value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Last Name
                    <span className="ml-1 text-[#b98b67]">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      formData.lastName
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastName:
                          e.target.value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="Enter last name"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Mobile Number
                    <span className="ml-1 text-[#b98b67]">
                      *
                    </span>
                  </label>

                  <input
                    type="tel"
                    value={
                      formData.mobile
                    }
                    onChange={(e) => {
                      const onlyNumbers =
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(0, 10);

                      setFormData({
                        ...formData,
                        mobile:
                          onlyNumbers,
                      });

                      if (
                        onlyNumbers.length >
                          0 &&
                        onlyNumbers.length !==
                          10
                      ) {
                        setMobileError(
                          "Please enter a valid 10-digit mobile number."
                        );
                      } else {
                        setMobileError(
                          ""
                        );
                      }
                    }}
                    inputMode="numeric"
                    maxLength={10}
                    className={
                      inputClass
                    }
                    placeholder="Enter 10-digit mobile number"
                  />

                  {mobileError && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {mobileError}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                    <span className="ml-1 text-[#b98b67]">
                      *
                    </span>
                  </label>

                  <input
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={(e) => {
                      const value =
                        e.target.value;

                      setFormData({
                        ...formData,
                        email: value,
                      });

                      if (
                        value &&
                        !value.includes(
                          "@"
                        )
                      ) {
                        setEmailError(
                          "Please enter a valid email address."
                        );
                      } else {
                        setEmailError(
                          ""
                        );
                      }
                    }}
                    className={
                      inputClass
                    }
                    placeholder="you@example.com"
                  />

                  {emailError && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Address
                    <span className="ml-1 text-[#b98b67]">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      formData.address
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address:
                          e.target.value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="House no, street, area"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    City
                    <span className="ml-1 text-[#b98b67]">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      formData.city
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="City"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    State
                    <span className="ml-1 text-[#b98b67]">
                      *
                    </span>
                  </label>

                  <select
                    value={
                      formData.state
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state:
                          e.target.value,
                      })
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Select State
                    </option>

                    <option value="Andhra Pradesh">
                      Andhra Pradesh
                    </option>

                    <option value="Arunachal Pradesh">
                      Arunachal Pradesh
                    </option>

                    <option value="Assam">
                      Assam
                    </option>

                    <option value="Bihar">
                      Bihar
                    </option>

                    <option value="Chhattisgarh">
                      Chhattisgarh
                    </option>

                    <option value="Goa">
                      Goa
                    </option>

                    <option value="Gujarat">
                      Gujarat
                    </option>

                    <option value="Haryana">
                      Haryana
                    </option>

                    <option value="Himachal Pradesh">
                      Himachal Pradesh
                    </option>

                    <option value="Jharkhand">
                      Jharkhand
                    </option>

                    <option value="Karnataka">
                      Karnataka
                    </option>

                    <option value="Kerala">
                      Kerala
                    </option>

                    <option value="Madhya Pradesh">
                      Madhya Pradesh
                    </option>

                    <option value="Maharashtra">
                      Maharashtra
                    </option>

                    <option value="Manipur">
                      Manipur
                    </option>

                    <option value="Meghalaya">
                      Meghalaya
                    </option>

                    <option value="Mizoram">
                      Mizoram
                    </option>

                    <option value="Nagaland">
                      Nagaland
                    </option>

                    <option value="Odisha">
                      Odisha
                    </option>

                    <option value="Punjab">
                      Punjab
                    </option>

                    <option value="Rajasthan">
                      Rajasthan
                    </option>

                    <option value="Sikkim">
                      Sikkim
                    </option>

                    <option value="Tamil Nadu">
                      Tamil Nadu
                    </option>

                    <option value="Telangana">
                      Telangana
                    </option>

                    <option value="Tripura">
                      Tripura
                    </option>

                    <option value="Uttar Pradesh">
                      Uttar Pradesh
                    </option>

                    <option value="Uttarakhand">
                      Uttarakhand
                    </option>

                    <option value="West Bengal">
                      West Bengal
                    </option>

                    <option value="Andaman and Nicobar Islands">
                      Andaman and Nicobar
                      Islands
                    </option>

                    <option value="Chandigarh">
                      Chandigarh
                    </option>

                    <option value="Dadra and Nagar Haveli and Daman and Diu">
                      Dadra and Nagar
                      Haveli and Daman and
                      Diu
                    </option>

                    <option value="Delhi">
                      Delhi
                    </option>

                    <option value="Jammu and Kashmir">
                      Jammu and Kashmir
                    </option>

                    <option value="Ladakh">
                      Ladakh
                    </option>

                    <option value="Lakshadweep">
                      Lakshadweep
                    </option>

                    <option value="Puducherry">
                      Puducherry
                    </option>
                  </select>
                </div>

                {/* Pincode */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Pincode
                    <span className="ml-1 text-[#b98b67]">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      formData.pincode
                    }
                    onChange={(e) => {
                      const onlyNumbers =
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(0, 6);

                      setFormData({
                        ...formData,
                        pincode:
                          onlyNumbers,
                      });

                      if (
                        onlyNumbers.length >
                          0 &&
                        onlyNumbers.length !==
                          6
                      ) {
                        setPincodeError(
                          "Please enter a valid 6-digit pincode."
                        );
                      } else {
                        setPincodeError(
                          ""
                        );
                      }
                    }}
                    inputMode="numeric"
                    maxLength={6}
                    className={
                      inputClass
                    }
                    placeholder="Enter 6-digit pincode"
                  />

                  {pincodeError && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {pincodeError}
                    </p>
                  )}
                </div>

                {/* Landmark */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Landmark
                    <span className="ml-2 text-xs font-normal text-[#9b837a]">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      formData.landmark
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        landmark:
                          e.target.value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="Nearby landmark"
                  />
                </div>
              </div>

              {/* Delivery Trust */}
              <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#ead8cf]/70 pt-6 sm:grid-cols-3">

                <div className="flex items-center gap-3 rounded-2xl bg-[#fffaf8] px-4 py-3">
                  <Truck
                    size={18}
                    className="shrink-0 text-[#b98b67]"
                  />

                  <span className="text-xs font-semibold text-[#6e5b55]">
                    Safe Delivery
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-[#fffaf8] px-4 py-3">
                  <PackageCheck
                    size={18}
                    className="shrink-0 text-[#b98b67]"
                  />

                  <span className="text-xs font-semibold text-[#6e5b55]">
                    Secure Packing
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-[#fffaf8] px-4 py-3 sm:col-span-1">
                  <ShieldCheck
                    size={18}
                    className="shrink-0 text-[#b98b67]"
                  />

                  <span className="text-xs font-semibold text-[#6e5b55]">
                    Protected Payment
                  </span>
                </div>
              </div>
            </section>

            {/* Order Summary */}
            <aside className="h-fit overflow-hidden rounded-[30px] border border-[#b98b67]/20 bg-gradient-to-br from-[#241916] via-[#2b1d19] to-[#1f1512] p-6 text-white shadow-[0_22px_60px_rgba(42,31,29,0.18)] sm:p-7 lg:sticky lg:top-36">

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d9aa86]">
                Final Step
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-4 h-px w-12 bg-[#b98b67]/70" />

              {/* Products */}
              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] p-3"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={70}
                        height={70}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium leading-5 text-white/85">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-white/45">
                        Qty:{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-white/85">
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-4 border-t border-white/10 pt-6">

                <div className="flex justify-between text-sm text-white/65">
                  <span>Subtotal</span>

                  <span className="font-medium text-white/90">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm text-white/65">
                  <span>Shipping</span>

                  <span className="text-right text-xs text-white/55">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="font-semibold">
                    Total
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-white/40">
                    Final shipping charges
                    will be shown before
                    payment.
                  </p>
                </div>

                <span className="shrink-0 font-serif text-2xl text-[#e8c4ac]">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              {/* Payment Button */}
              <button
                type="button"
                onClick={
                  handleContinueToPayment
                }
                disabled={processing}
                className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#e8c4ac] px-5 py-4 text-sm font-semibold tracking-wide text-[#2a1f1d] shadow-[0_10px_25px_rgba(232,196,172,0.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LockKeyhole
                  size={17}
                />

                {processing
                  ? "Preparing Payment..."
                  : "Continue to Payment"}
              </button>

              {/* Error */}
              {formError && (
                <div className="mt-4 rounded-[16px] border border-red-400/20 bg-red-500/10 px-4 py-3">
                  <p className="text-center text-sm leading-6 text-red-300">
                    {formError}
                  </p>
                </div>
              )}

              {/* Secure Note */}
              <div className="mt-6 rounded-[20px] border border-white/10 bg-white/[0.04] p-4 text-center">
                <ShieldCheck
                  size={20}
                  className="mx-auto text-[#e8c4ac]"
                />

                <p className="mt-2 text-xs font-semibold text-white/80">
                  Secure Payment
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/45">
                  Your payment is
                  processed securely
                  through Razorpay.
                </p>
              </div>

              <Link
                href="/cart"
                className="group mt-5 flex items-center justify-center gap-2 text-sm text-white/50 transition hover:text-white"
              >
                <ArrowLeft
                  size={15}
                  className="transition group-hover:-translate-x-1"
                />
                Edit Cart
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}