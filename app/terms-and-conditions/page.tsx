import StoreHeader from "../StoreHeader";
export default function TermsAndConditionsPage() {
  return (
  <>
    <StoreHeader />

    <main className="min-h-screen bg-[#fffaf8] px-5 py-12 text-[#2a1f1d]">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
          The Stud House Elite
        </p>

        <h1 className="mt-3 font-serif text-4xl md:text-5xl">
          Terms & Conditions
        </h1>

        <p className="mt-4 text-sm text-[#6e5b55]">
          Last updated: September 2026
        </p>

        <div className="mt-10 space-y-8 rounded-[28px] border border-[#ead8cf] bg-white p-7 md:p-10">
          <section>
            <h2 className="font-serif text-2xl">
              General
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              By accessing or placing an order on The Stud House Elite website,
              you agree to these Terms & Conditions. Please read them carefully
              before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Products
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              We make reasonable efforts to display product images,
              descriptions, colours and details accurately. Actual colours or
              appearance may vary slightly depending on lighting, photography
              and device screen settings.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Pricing
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Product prices are displayed in Indian Rupees unless otherwise
              stated. Prices, offers and availability may change without prior
              notice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Orders
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              An order is considered confirmed after successful payment and
              confirmation from The Stud House Elite. We reserve the right to
              cancel an order if a product is unavailable, pricing information
              is incorrect, or the order cannot be fulfilled.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Payments
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Online payments may be processed through authorised third-party
              payment providers such as Razorpay. Payment availability may vary
              depending on the methods supported by the payment provider.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Shipping and Delivery
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Delivery timelines are estimates and may vary depending on the
              delivery location, courier partner, holidays, weather conditions
              or other factors beyond our control. Please refer to our Shipping
              Policy for more information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Returns and Refunds
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Returns, replacements and refunds are subject to the conditions
              mentioned in our Refund & Return Policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Customer Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Customers are responsible for providing accurate contact,
              delivery and payment information. The Stud House Elite is not
              responsible for delays caused by incorrect or incomplete
              information provided by the customer.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Website Use
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              You agree not to misuse the website, attempt unauthorised access,
              interfere with website functionality or use the website for
              unlawful purposes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Intellectual Property
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Website content, branding, product images, designs and other
              materials belonging to The Stud House Elite may not be copied,
              reproduced or used without permission, except where otherwise
              permitted by law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Changes to These Terms
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              We may update these Terms & Conditions when necessary. Any
              changes will be published on this page with an updated revision
              date.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Contact Us
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              If you have questions about these Terms & Conditions, please
              contact The Stud House Elite through the details provided on our
              Contact Us page.
            </p>
          </section>
        </div>
      </div>
    </main>
      </>

  );
}