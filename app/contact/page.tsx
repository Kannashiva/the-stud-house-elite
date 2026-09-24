"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import StoreHeader from "../StoreHeader";

export default function ContactPage() {
  const contactCards = [
    {
      title: "Phone",
      text: "Contact us for order and product assistance.",
      value: "+91 78935 42022",
      href: "tel:+917893542022",
      icon: Phone,
    },
    {
      title: "Email",
      text: "Write to us for support and business enquiries.",
      value: "thestudhouseelite@gmail.com",
      href: "mailto:thestudhouseelite@gmail.com",
      icon: Mail,
    },
    {
      title: "WhatsApp",
      text: "Chat with us directly for quick assistance.",
      value: "Chat on WhatsApp",
      href: "https://wa.me/917893542022",
      icon: MessageCircle,
      external: true,
    },
    {
      title: "Location",
      text: "Hyderabad, Telangana, India",
      value: "The Stud House Elite",
      href: null,
      icon: MapPin,
    },
  ];

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fff2ec] px-5 pb-16 pt-10 text-[#2a1f1d] md:pb-20 md:pt-14">
        <div className="mx-auto max-w-6xl">
          <section className="relative overflow-hidden rounded-[36px] border border-[#ead8cf]/70 bg-gradient-to-br from-white via-[#fffaf8] to-[#f8e7de] px-6 py-12 text-center shadow-[0_24px_70px_rgba(70,45,38,0.08)] sm:px-10 md:py-16">
            <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#f0d2c2]/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-[#e8c4ac]/25 blur-3xl" />

            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2a1f1d] text-[#e8c4ac] shadow-[0_12px_30px_rgba(42,31,29,0.18)]">
                <Sparkles size={22} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
                The Stud House Elite
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">
                We’re Here to Help
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6e5b55] md:text-base">
                Have a question about our jewellery, your order, delivery or returns?
                Reach us through the channel that is most convenient for you.
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => {
              const Icon = card.icon;

              const content = (
                <div className="group h-full rounded-[28px] border border-[#ead8cf]/70 bg-white/85 p-6 shadow-[0_14px_40px_rgba(70,45,38,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#dcbca9] hover:shadow-[0_20px_50px_rgba(70,45,38,0.10)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67] transition group-hover:bg-[#2a1f1d] group-hover:text-[#e8c4ac]">
                    <Icon size={20} />
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#b98b67]">
                    {card.title}
                  </p>

                  <h2 className="mt-2 break-words font-serif text-2xl">
                    {card.value}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#6e5b55]">
                    {card.text}
                  </p>

                  {card.href && (
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8a6248]">
                      Connect
                      <ArrowRight
                        size={15}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  )}
                </div>
              );

              if (!card.href) {
                return <div key={card.title}>{content}</div>;
              }

              return (
                <a
                  key={card.title}
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noreferrer" : undefined}
                  className="block"
                >
                  {content}
                </a>
              );
            })}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="rounded-[32px] border border-[#ead8cf]/70 bg-white/85 p-7 shadow-[0_16px_45px_rgba(70,45,38,0.06)] sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b98b67]">
                    Customer Support
                  </p>

                  <h2 className="mt-2 font-serif text-3xl">
                    Help Us Help You Faster
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6e5b55]">
                    For order-related queries, please include your order number,
                    registered mobile number and a short description of your concern.
                    This helps us assist you faster.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-gradient-to-br from-[#241916] via-[#2b1d19] to-[#1f1512] p-7 text-white shadow-[0_20px_55px_rgba(42,31,29,0.16)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[#e8c4ac]">
                <Clock3 size={20} />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#e8c4ac]">
                Support Hours
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Monday to Saturday
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/65">
                10:00 AM to 7:00 PM IST
              </p>

              <a
                href="https://wa.me/917893542022"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e8c4ac] px-5 py-3 text-sm font-semibold text-[#2a1f1d] transition hover:bg-white"
              >
                <MessageCircle size={17} />
                WhatsApp Us
              </a>
            </div>
          </section>

          <section className="mt-8 rounded-[28px] border border-[#ead8cf]/70 bg-[#fffaf8]/80 p-5">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm">
              <Link href="/privacy-policy" className="font-medium text-[#8a6248] transition hover:text-[#b98b67]">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="font-medium text-[#8a6248] transition hover:text-[#b98b67]">
                Terms & Conditions
              </Link>
              <Link href="/shipping-policy" className="font-medium text-[#8a6248] transition hover:text-[#b98b67]">
                Shipping Policy
              </Link>
              <Link href="/refund-policy" className="font-medium text-[#8a6248] transition hover:text-[#b98b67]">
                Refund & Return Policy
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
