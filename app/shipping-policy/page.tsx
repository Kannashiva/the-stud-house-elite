"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  FileText,
  Mail,
  ShieldCheck,
} from "lucide-react";
import StoreHeader from "../StoreHeader";

export default function ShippingPolicyPage() {
  const pathname = usePathname();

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fff2ec] px-5 pb-16 pt-10 text-[#2a1f1d] md:pb-20 md:pt-14">
        <div className="mx-auto max-w-6xl">
          <section className="relative overflow-hidden rounded-[36px] border border-[#ead8cf]/70 bg-gradient-to-br from-white via-[#fffaf8] to-[#f7e6de] px-6 py-10 shadow-[0_22px_65px_rgba(70,45,38,0.07)] sm:px-9 md:py-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#eac8b5]/25 blur-3xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2a1f1d] text-[#e8c4ac]">
                <FileText size={20} />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
                The Stud House Elite
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">
                Shipping Policy
              </h1>

              <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#b98b67] to-transparent" />

              <p className="mt-4 text-sm text-[#6e5b55]">
                Last updated: September 2026
              </p>
            </div>
          </section>

          <nav className="mt-6 overflow-x-auto">
            <div className="flex min-w-max gap-2 rounded-full border border-[#ead8cf]/70 bg-[#fffaf8]/85 p-2 shadow-[0_10px_30px_rgba(70,45,38,0.04)]">
              <Link
                href="/privacy-policy"
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${pathname === "/privacy-policy" ? "bg-[#2a1f1d] text-white shadow-sm" : "text-[#7a625b] hover:bg-white hover:text-[#2a1f1d]"}`}
              >
                Privacy
              </Link>
              <Link
                href="/terms-and-conditions"
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${pathname === "/terms-and-conditions" ? "bg-[#2a1f1d] text-white shadow-sm" : "text-[#7a625b] hover:bg-white hover:text-[#2a1f1d]"}`}
              >
                Terms
              </Link>
              <Link
                href="/shipping-policy"
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${pathname === "/shipping-policy" ? "bg-[#2a1f1d] text-white shadow-sm" : "text-[#7a625b] hover:bg-white hover:text-[#2a1f1d]"}`}
              >
                Shipping
              </Link>
              <Link
                href="/refund-policy"
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${pathname === "/refund-policy" ? "bg-[#2a1f1d] text-white shadow-sm" : "text-[#7a625b] hover:bg-white hover:text-[#2a1f1d]"}`}
              >
                Refunds & Returns
              </Link>
            </div>
          </nav>

          <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
            <article className="rounded-[32px] border border-[#ead8cf]/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(70,45,38,0.06)] sm:p-8 md:p-10">
              <div className="space-y-7">
            <section className="border-b border-[#ead8cf]/70 pb-7 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-sm font-semibold text-[#b98b67]">
                  01
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-[28px]">
                    Order Processing
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6e5b55] md:text-[15px]">
                    Orders are processed after successful payment confirmation. Processing times may vary depending on product availability and order volume.
                  </p>
                </div>
              </div>
            </section>
            <section className="border-b border-[#ead8cf]/70 pb-7 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-sm font-semibold text-[#b98b67]">
                  02
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-[28px]">
                    Delivery Timeline
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6e5b55] md:text-[15px]">
                    We aim to deliver most orders within 0–7 days after receiving the order. Delivery times may vary depending on the customer's location and courier availability.
                  </p>
                </div>
              </div>
            </section>
            <section className="border-b border-[#ead8cf]/70 pb-7 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-sm font-semibold text-[#b98b67]">
                  03
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-[28px]">
                    Shipping Locations
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6e5b55] md:text-[15px]">
                    We currently ship to serviceable locations within India. Delivery availability may depend on the courier partner and the customer's PIN code.
                  </p>
                </div>
              </div>
            </section>
            <section className="border-b border-[#ead8cf]/70 pb-7 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-sm font-semibold text-[#b98b67]">
                  04
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-[28px]">
                    Shipping Charges
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6e5b55] md:text-[15px]">
                    Applicable shipping charges, if any, will be displayed during checkout before the customer completes payment.
                  </p>
                </div>
              </div>
            </section>
            <section className="border-b border-[#ead8cf]/70 pb-7 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-sm font-semibold text-[#b98b67]">
                  05
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-[28px]">
                    Order Tracking
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6e5b55] md:text-[15px]">
                    Where available, customers may receive tracking information after the order has been dispatched.
                  </p>
                </div>
              </div>
            </section>
            <section className="border-b border-[#ead8cf]/70 pb-7 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-sm font-semibold text-[#b98b67]">
                  06
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-[28px]">
                    Delivery Delays
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6e5b55] md:text-[15px]">
                    Delivery may be delayed due to courier issues, holidays, weather, local restrictions, incorrect address details or other circumstances beyond our reasonable control.
                  </p>
                </div>
              </div>
            </section>
            <section className="border-b border-[#ead8cf]/70 pb-7 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-sm font-semibold text-[#b98b67]">
                  07
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-[28px]">
                    Incorrect Address
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6e5b55] md:text-[15px]">
                    Customers are responsible for providing complete and accurate delivery details. Additional charges may apply if an order needs to be re-shipped due to an incorrect or incomplete address.
                  </p>
                </div>
              </div>
            </section>
            <section className="border-b border-[#ead8cf]/70 pb-7 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-sm font-semibold text-[#b98b67]">
                  08
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-[28px]">
                    Damaged or Missing Package
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6e5b55] md:text-[15px]">
                    If your package arrives damaged, or if there is a delivery issue, please contact us as soon as possible with your order details and supporting photos where applicable.
                  </p>
                </div>
              </div>
            </section>
            <section className="border-b border-[#ead8cf]/70 pb-7 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-sm font-semibold text-[#b98b67]">
                  09
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-[28px]">
                    Contact Us
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6e5b55] md:text-[15px]">
                    For shipping or delivery assistance, please contact The Stud House Elite through the details provided on our Contact Us page.
                  </p>
                </div>
              </div>
            </section>
              </div>
            </article>

            <aside className="h-fit rounded-[30px] bg-gradient-to-br from-[#241916] via-[#2b1d19] to-[#1f1512] p-7 text-white shadow-[0_20px_55px_rgba(42,31,29,0.16)] lg:sticky lg:top-32">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[#e8c4ac]">
                <ShieldCheck size={19} />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c4ac]">
                Need Help?
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Questions About This Policy?
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/60">
                Contact The Stud House Elite and we’ll help you with your query.
              </p>

              <Link
                href="/contact"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#e8c4ac] px-5 py-3 text-sm font-semibold text-[#2a1f1d] transition hover:bg-white"
              >
                <Mail size={16} />
                Contact Us
                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
