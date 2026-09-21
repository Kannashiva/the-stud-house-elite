import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import StoreHeader from "../StoreHeader";
export default function ContactPage() {
  return (
  <>
    <StoreHeader />

    <main className="min-h-screen bg-[#fffaf8] px-5 py-12 text-[#2a1f1d]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
            The Stud House Elite
          </p>

          <h1 className="mt-3 font-serif text-4xl md:text-5xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] md:text-base">
            Have a question about our jewellery, your order, delivery or returns?
            We’re here to help.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[24px] border border-[#ead8cf] bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8efe7]">
              <Phone className="h-5 w-5 text-[#b98b67]" />
            </div>

            <h2 className="mt-4 font-serif text-xl">
              Phone
            </h2>

            <p className="mt-2 text-sm text-[#6e5b55]">
              Contact us for order and product assistance.
            </p>

            <a
              href="tel:+91XXXXXXXXXX"
              className="mt-4 inline-block text-sm font-semibold text-[#b98b67]"
            >
              +91 78935 42022
                          </a>
          </div>

          <div className="rounded-[24px] border border-[#ead8cf] bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8efe7]">
              <Mail className="h-5 w-5 text-[#b98b67]" />
            </div>

            <h2 className="mt-4 font-serif text-xl">
              Email
            </h2>

            <p className="mt-2 text-sm text-[#6e5b55]">
              Write to us for support and business enquiries.
            </p>

            <a
              href="mailto:your@email.com"
              className="mt-4 inline-block text-sm font-semibold text-[#b98b67]"
            >
              thestudhouseelite@gmail.com            </a>
          </div>

          <div className="rounded-[24px] border border-[#ead8cf] bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8efe7]">
              <MessageCircle className="h-5 w-5 text-[#b98b67]" />
            </div>

            <h2 className="mt-4 font-serif text-xl">
              WhatsApp
            </h2>

            <p className="mt-2 text-sm text-[#6e5b55]">
              Chat with us directly for quick assistance.
            </p>

            <a
              href="https://wa.me/917893542022"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-[#b98b67]"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="rounded-[24px] border border-[#ead8cf] bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8efe7]">
              <MapPin className="h-5 w-5 text-[#b98b67]" />
            </div>

            <h2 className="mt-4 font-serif text-xl">
              Location
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6e5b55]">
              Hyderabad, Telangana, India
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-12 rounded-[28px] border border-[#ead8cf] bg-white p-8 md:p-10">
          <h2 className="font-serif text-3xl">
            Customer Support
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6e5b55]">
            For order-related queries, please include your order number,
            registered mobile number and a short description of your concern.
            This helps us assist you faster.
          </p>

          <p className="mt-4 text-sm text-[#6e5b55]">
            Support hours: Monday to Saturday, 10:00 AM to 7:00 PM IST
          </p>
        </div>
      </div>
    </main>
      </>

  );
}