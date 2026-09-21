import StoreHeader from "../StoreHeader";
export default function RefundPolicyPage() {
  return (
  <>
    <StoreHeader />

    <main className="min-h-screen bg-[#fffaf8] px-5 py-12 text-[#2a1f1d]">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
          The Stud House Elite
        </p>

        <h1 className="mt-3 font-serif text-4xl md:text-5xl">
          Refund & Return Policy
        </h1>

        <p className="mt-4 text-sm text-[#6e5b55]">
          Last updated: September 2026
        </p>

        <div className="mt-10 space-y-8 rounded-[28px] border border-[#ead8cf] bg-white p-7 md:p-10">
          <section>
            <h2 className="font-serif text-2xl">
              Returns
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              We accept return or replacement requests only when the product is
              received damaged, defective, incorrect, or different from the item
              ordered.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Return Request Period
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Customers should contact us within 48 hours of delivery if there
              is an issue with the product. Requests received after this period
              may not be eligible for return or replacement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Eligibility
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              To be eligible, the product should be unused and returned in its
              original condition, including the original packaging and any
              accessories received with the order.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Proof Required
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              We may request clear photos or an unboxing video showing the
              package and product condition before approving a return,
              replacement or refund request.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Non-Returnable Items
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Products that have been used, damaged after delivery, altered, or
              returned without original packaging may not be accepted. Returns
              based only on personal preference or minor colour variation due
              to screen or lighting differences may not be eligible.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Refunds
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Once an approved return is received and inspected, eligible
              refunds will be initiated to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Refund Processing Time
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              After a refund is initiated, the amount may take approximately
              5–10 business days to appear in the customer&apos;s bank account or
              payment method, depending on the bank or payment provider.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Order Cancellation
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Customers may request cancellation before the order has been
              dispatched. Once an order has been shipped, cancellation may no
              longer be possible.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Refund for Cancelled Orders
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              If a prepaid order is successfully cancelled before dispatch, the
              eligible amount will be refunded to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Contact Us
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              For return, replacement, cancellation or refund requests, please
              contact The Stud House Elite through the details provided on our
              Contact Us page and include your order number.
            </p>
          </section>
        </div>
      </div>
    </main>
      </>

  );
}