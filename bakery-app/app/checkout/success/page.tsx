import Link from "next/link";
import Stripe from "stripe";

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

function formatCurrency(amount: number | null, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((amount ?? 0) / 100);
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || !sessionId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf7] px-6 py-16">
        <section className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="text-5xl">🧁</div>

          <h1 className="mt-5 font-serif text-4xl font-bold text-[#4b3428]">
            We couldn&apos;t find this order
          </h1>

          <p className="mt-4 leading-7 text-[#6b5548]">
            The payment session is missing or Stripe has not been configured.
          </p>

          <Link
            href="/"
            className="mt-7 inline-block rounded-full bg-[#ed6f91] px-7 py-4 font-bold text-white transition hover:bg-[#d85d80]"
          >
            Return to the Bakery
          </Link>
        </section>
      </main>
    );
  }

  try {
    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ["line_items"],
      }
    );

    const lineItems = session.line_items?.data ?? [];
    const customerName =
      session.customer_details?.name ?? "Sweet Tey's Customer";
    const customerEmail =
      session.customer_details?.email ??
      session.customer_email ??
      "your email address";

    const paymentComplete =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required";

    const orderNumber = session.id.slice(-10).toUpperCase();

    return (
      <main className="min-h-screen bg-[#fffaf7] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <section className="overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="bg-gradient-to-br from-pink-50 to-[#fffaf7] px-8 py-12 text-center sm:px-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow">
                {paymentComplete ? "✓" : "⏳"}
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[#ed6f91]">
                {paymentComplete
                  ? "Payment Successful"
                  : "Payment Processing"}
              </p>

              <h1 className="mt-3 font-serif text-4xl font-bold text-[#4b3428] sm:text-5xl">
                Thank You, {customerName}!
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6b5548]">
                {paymentComplete
                  ? "Your Sweet Tey's Pastries order has been received. We can't wait to prepare something delicious for you."
                  : "Your payment is still processing. We will confirm your order as soon as Stripe completes the payment."}
              </p>
            </div>

            <div className="grid gap-8 px-8 py-10 sm:px-12 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                  Order Details
                </h2>

                <div className="mt-6 space-y-4">
                  {lineItems.map((item) => (
                    <article
                      key={item.id}
                      className="flex items-start justify-between gap-5 border-b border-pink-100 pb-4 last:border-0"
                    >
                      <div>
                        <h3 className="font-bold text-[#4b3428]">
                          {item.description}
                        </h3>

                        <p className="mt-1 text-sm text-[#6b5548]">
                          Quantity: {item.quantity ?? 1}
                        </p>
                      </div>

                      <span className="shrink-0 font-bold text-[#4b3428]">
                        {formatCurrency(
                          item.amount_total,
                          session.currency ?? "usd"
                        )}
                      </span>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="h-fit rounded-3xl border border-pink-100 bg-[#fffaf7] p-6">
                <h2 className="font-serif text-2xl font-bold text-[#4b3428]">
                  Confirmation
                </h2>

                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                      Order number
                    </dt>
                    <dd className="mt-1 font-bold text-[#4b3428]">
                      {orderNumber}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                      Confirmation email
                    </dt>
                    <dd className="mt-1 break-words text-[#4b3428]">
                      {customerEmail}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                      Payment status
                    </dt>
                    <dd className="mt-1 font-bold capitalize text-[#6b8a64]">
                      {session.payment_status.replaceAll("_", " ")}
                    </dd>
                  </div>

                  <div className="border-t border-pink-200 pt-4">
                    <dt className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                      Total paid
                    </dt>
                    <dd className="mt-1 font-serif text-3xl font-bold text-[#ed6f91]">
                      {formatCurrency(
                        session.amount_total,
                        session.currency ?? "usd"
                      )}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>

            <div className="border-t border-pink-100 px-8 py-8 text-center sm:px-12">
              <p className="leading-7 text-[#6b5548]">
                A payment receipt will be sent by Stripe. Sweet Tey&apos;s
                Pastries will follow up with pickup or delivery confirmation.
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-full bg-[#ed6f91] px-8 py-4 font-bold text-white transition hover:bg-[#d85d80]"
              >
                Continue Shopping
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Unable to retrieve Stripe session:", error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf7] px-6 py-16">
        <section className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="text-5xl">🧁</div>

          <h1 className="mt-5 font-serif text-4xl font-bold text-[#4b3428]">
            Your payment may still be processing
          </h1>

          <p className="mt-4 leading-7 text-[#6b5548]">
            We could not retrieve the Stripe payment details. Check your
            email for a receipt or contact Sweet Tey&apos;s Pastries for
            assistance.
          </p>

          <Link
            href="/"
            className="mt-7 inline-block rounded-full bg-[#ed6f91] px-7 py-4 font-bold text-white transition hover:bg-[#d85d80]"
          >
            Return to the Bakery
          </Link>
        </section>
      </main>
    );
  }
}