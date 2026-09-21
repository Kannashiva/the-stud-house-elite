import StoreHeader from "../StoreHeader";
export default function PrivacyPolicyPage() {
  return (
  <>
    <StoreHeader />

    <main className="min-h-screen bg-[#fffaf8] px-5 py-12 text-[#2a1f1d]">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
          The Stud House Elite
        </p>

        <h1 className="mt-3 font-serif text-4xl md:text-5xl">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-[#6e5b55]">
          Last updated: September 2026
        </p>

        <div className="mt-10 space-y-8 rounded-[28px] border border-[#ead8cf] bg-white p-7 md:p-10">
          <section>
            <h2 className="font-serif text-2xl">
              Information We Collect
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              When you place an order or contact us, we may collect information
              such as your name, phone number, email address, delivery address,
              order details and payment-related transaction information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              How We Use Your Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              We use your information to process orders, arrange delivery,
              provide customer support, communicate order updates, prevent
              misuse and improve our services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Payments
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Online payments may be processed through third-party payment
              providers such as Razorpay. We do not directly store your full
              card, UPI PIN or banking credentials on our website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Sharing of Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              We may share necessary information with payment processors,
              delivery partners and service providers only when required to
              complete your order or provide support.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Data Security
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              We take reasonable steps to protect customer information from
              unauthorized access, misuse or disclosure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Cookies and Website Usage
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              Our website may use basic cookies or similar technologies to
              remember cart information, improve website functionality and
              understand how customers use the website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Your Rights
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              You may contact us if you want to request correction or deletion
              of personal information that we hold, subject to applicable legal
              and business record requirements.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              Contact Us
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6e5b55]">
              For privacy-related questions, please contact The Stud House Elite
              using the contact details provided on our Contact Us page.
            </p>
          </section>
        </div>
      </div>
    </main>
      </>

  );
}