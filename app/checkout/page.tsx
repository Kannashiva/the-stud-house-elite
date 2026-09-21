"use client";

import StoreHeader from "../StoreHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, subtotal } = useCart();

  const [formData, setFormData] = useState({
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

  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [formError, setFormError] = useState("");

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const existingScript = document.getElementById(
        "razorpay-checkout-script"
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleContinueToPayment = async () => {
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
      setFormError("Please fill in all required fields.");
      return;
    }

    if (formData.mobile.length !== 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (formData.pincode.length !== 6) {
      setFormError("Please enter a valid 6-digit pincode.");
      return;
    }

    setFormError("");

    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name: `${formData.firstName} ${formData.lastName}`,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark || "",
        total_amount: subtotal,
        items: cart,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("Order creation failed:", result);
      setFormError("Unable to create order. Please try again.");
      return;
    }

    console.log("Order created:", result.order);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      setFormError("Unable to load payment gateway. Please try again.");
      return;
    }

    const paymentResponse = await fetch("/api/create-payment-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: subtotal,
        receipt: `order_${result.order.id}`,
      }),
    });

    const paymentResult = await paymentResponse.json();

    if (!paymentResponse.ok || !paymentResult.success) {
      console.log(
        "Payment gateway not configured yet:",
        paymentResult
      );

      setFormError(
        "Payment gateway is not configured yet. Your order has been saved."
      );

      return;
    }

    const options = {
      key: paymentResult.keyId,
      amount: paymentResult.paymentOrder.amount,
      currency: paymentResult.paymentOrder.currency,
      name: "The Stud House Elite",
      description: "Jewellery Order",
      order_id: paymentResult.paymentOrder.id,

      handler: async function (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) {
        const verifyResponse = await fetch(
          "/api/verify-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: result.order.id,
              razorpay_order_id:
                response.razorpay_order_id,
              razorpay_payment_id:
                response.razorpay_payment_id,
              razorpay_signature:
                response.razorpay_signature,
            }),
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
          return;
        }

        console.log(
          "Payment verified successfully"
        );

        router.push(
          `/order-success?order=${result.order.id}`
        );
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

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };

  if (cart.length === 0) {
    return (
      <>
        <StoreHeader />

        <main className="flex min-h-screen items-center justify-center bg-[#fffaf8] px-5">
          <div className="text-center">
            <h1 className="font-serif text-4xl text-[#2a1f1d] md:text-5xl">
              Your Cart is Empty
            </h1>

            <p className="mt-4 text-[#6e5b55]">
              Add a product before proceeding to checkout.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-block rounded-full bg-[#2a1f1d] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-[#fffaf8] px-5 py-14 text-[#2a1f1d]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Secure Checkout
            </p>

            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              Delivery Details
            </h1>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* Customer Details */}
            <section className="rounded-[28px] border border-[#ead8cf] bg-white p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    First Name
                  </label>

                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => {
                      const onlyNumbers =
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);

                      setFormData({
                        ...formData,
                        mobile: onlyNumbers,
                      });

                      if (
                        onlyNumbers.length > 0 &&
                        onlyNumbers.length !== 10
                      ) {
                        setMobileError(
                          "Please enter a valid 10-digit mobile number."
                        );
                      } else {
                        setMobileError("");
                      }
                    }}
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
                    placeholder="Enter 10-digit mobile number"
                  />

                  {mobileError && (
                    <p className="mt-2 text-sm text-red-600">
                      {mobileError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;

                      setFormData({
                        ...formData,
                        email: value,
                      });

                      if (
                        value &&
                        !value.includes("@")
                      ) {
                        setEmailError(
                          "Please enter a valid email address."
                        );
                      } else {
                        setEmailError("");
                      }
                    }}
                    className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
                    placeholder="you@example.com"
                  />

                  {emailError && (
                    <p className="mt-2 text-sm text-red-600">
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Address
                  </label>

                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                    className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
                    placeholder="House no, street, area"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    City
                  </label>

                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      })
                    }
                    className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
                    placeholder="City"
                  />
                </div>

                <div>
  <label className="mb-2 block text-sm font-semibold">
    State
  </label>

  <select
    value={formData.state}
    onChange={(e) =>
      setFormData({
        ...formData,
        state: e.target.value,
      })
    }
    className="w-full rounded-[16px] border border-[#dcc9bf] bg-white px-4 py-3 outline-none transition focus:border-[#b98b67]"
  >
    <option value="">Select State</option>

    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>

    <option value="Andaman and Nicobar Islands">
      Andaman and Nicobar Islands
    </option>
    <option value="Chandigarh">Chandigarh</option>
    <option value="Dadra and Nagar Haveli and Daman and Diu">
      Dadra and Nagar Haveli and Daman and Diu
    </option>
    <option value="Delhi">Delhi</option>
    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
    <option value="Ladakh">Ladakh</option>
    <option value="Lakshadweep">Lakshadweep</option>
    <option value="Puducherry">Puducherry</option>
  </select>
</div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Pincode
                  </label>

                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => {
                      const onlyNumbers =
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                      setFormData({
                        ...formData,
                        pincode: onlyNumbers,
                      });

                      if (
                        onlyNumbers.length > 0 &&
                        onlyNumbers.length !== 6
                      ) {
                        setPincodeError(
                          "Please enter a valid 6-digit pincode."
                        );
                      } else {
                        setPincodeError("");
                      }
                    }}
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
                    placeholder="Enter 6-digit pincode"
                  />

                  {pincodeError && (
                    <p className="mt-2 text-sm text-red-600">
                      {pincodeError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Landmark
                  </label>

                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        landmark: e.target.value,
                      })
                    }
                    className="w-full rounded-[16px] border border-[#dcc9bf] px-4 py-3 outline-none transition focus:border-[#b98b67]"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </section>

            {/* Summary */}
            <aside className="h-fit rounded-[28px] bg-[#2a1f1d] p-7 text-white">
              <h2 className="font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span className="text-white/70">
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/15 pt-6">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Subtotal</span>
                  <span>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm text-white/70">
                  <span>Shipping</span>
                  <span>Calculated later</span>
                </div>

                <div className="mt-6 flex justify-between">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-semibold text-[#e8c4ac]">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinueToPayment}
                className="mt-7 w-full rounded-full bg-[#e8c4ac] py-4 text-sm font-semibold text-[#2a1f1d] transition hover:bg-white"
              >
                Continue to Payment
              </button>

              {formError && (
                <p className="mt-4 text-center text-sm text-red-400">
                  {formError}
                </p>
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}