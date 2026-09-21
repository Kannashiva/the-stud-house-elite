"use client";

import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import StoreHeader from "../StoreHeader";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <>
      <StoreHeader />

      <main className="flex min-h-[calc(100vh-111px)] items-center justify-center bg-[#fffaf8] px-5 py-10 text-[#2a1f1d] md:min-h-[calc(100vh-121px)] md:py-12">
        <div className="w-full max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
            Order Confirmed
          </p>

          <h1 className="mt-3 font-serif text-4xl md:text-5xl">
            Thank You for Your Order
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#6e5b55]">
            Your order has been placed successfully. We&apos;ll process it and
            share further updates with you.
          </p>

          {orderId && (
            <div className="mx-auto mt-6 w-fit rounded-full bg-white px-5 py-3 text-sm shadow-sm">
              Order ID:{" "}
              <span className="font-semibold">
                #{orderId}
              </span>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-full bg-[#2a1f1d] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
            >
              Continue Shopping
            </Link>

            <Link
              href="/"
              className="rounded-full border border-[#b98b67] px-8 py-3.5 text-sm font-semibold transition hover:bg-[#b98b67] hover:text-white"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#fffaf8] text-[#6e5b55]">
          Loading order details...
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}