import StoreHeader from "../StoreHeader";
export default function ShippingPolicyPage() {
  return (
  <>
    <StoreHeader />

    <main className="min-h-screen bg-[#fffaf8] px-5 py-12 text-[#2a1f1d]">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
          The Stud House Elite
        </p>

        <h1 className="mt-3 font-serif text-4xl md:text-5xl">
          Shipping Policy
        </h1>

        <p className="mt-4 text-sm text-[#6e5b55]">
          Last updated: September 2026
        </p>

        <div className="mt-10 space-y-8 rounded-[28px] border border-[#ead8cf] bg-white p-7 md:p-10">
          <section>
            <h2 className="font-serif text-2xl">
              Order Processing
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Orders are processed after successful payment confirmation.
              Processing times may vary depending on product availability and
              order volume.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Delivery Timeline
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              We aim to deliver most orders within 0–7 days after receiving the
              order. Delivery times may vary depending on the customer&apos;s
              location and courier availability.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Shipping Locations
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              We currently ship to serviceable locations within India. Delivery
              availability may depend on the courier partner and the customer&apos;s
              PIN code.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Shipping Charges
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Applicable shipping charges, if any, will be displayed during
              checkout before the customer completes payment.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Order Tracking
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Where available, customers may receive tracking information after
              the order has been dispatched.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Delivery Delays
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Delivery may be delayed due to courier issues, holidays, weather,
              local restrictions, incorrect address details or other
              circumstances beyond our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Incorrect Address
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Customers are responsible for providing complete and accurate
              delivery details. Additional charges may apply if an order needs
              to be re-shipped due to an incorrect or incomplete address.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Damaged or Missing Package
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              If your package arrives damaged, or if there is a delivery issue,
              please contact us as soon as possible with your order details and
              supporting photos where applicable.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Contact Us
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              For shipping or delivery assistance, please contact The Stud
              House Elite through the details provided on our Contact Us page.
            </p>
          </section>
        </div>
      </div>
    </main>
      </>

  );
}