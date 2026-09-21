"use client";
import StoreHeader from "../StoreHeader";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
  <>
    <StoreHeader />

    <main className="flex min-h-[calc(100vh-121px)] items-center justify-center bg-[#fffaf8] px-5 py-12 text-[#2a1f1d]">
      <div className="w-full max-w-xl rounded-[32px] border border-[#ead8cf] bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2
            size={42}
            className="text-green-600"
          />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
          Order Confirmed
        </p>

        <h1 className="mt-3 font-serif text-4xl text-[#2a1f1d] md:text-5xl">
          Thank You for Your Order
        </h1>

        <p className="mx-auto mt-5 max-w-md leading-7 text-[#6e5b55]">
          Your payment has been verified successfully and your
          order has been confirmed.
        </p>

        {orderId && (
          <div className="mt-7 rounded-2xl bg-[#fffaf8] px-5 py-4">
            <p className="text-sm text-[#8b736b]">
              Order ID
            </p>

            <p className="mt-1 font-semibold text-[#2a1f1d]">
              #{orderId}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-[#2a1f1d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#b98b67] px-7 py-3.5 text-sm font-semibold text-[#2a1f1d] transition hover:bg-[#b98b67] hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
      </>

  );
}