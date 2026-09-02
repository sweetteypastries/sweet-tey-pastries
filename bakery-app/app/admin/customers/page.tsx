import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/components/supabase/admin";
import { requireAdmin } from "@/components/supabase/require-admin";

type Order = {
  id: string;
  customer_email: string | null;
  customer_name: string | null;
  amount_total: number;
  currency: string;
  payment_status: string;
  created_at: string;
};

type RewardAccount = {
  email: string;
  points_balance: number;
  lifetime_points: number;
  joined_at: string;
};

type Customer = {
  email: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  currency: string;
  firstOrder: string;
  lastOrder: string;
  rewardsMember: boolean;
  pointsBalance: number;
  lifetimePoints: number;
};

function formatMoney(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminCustomersPage() {
  if (!(await requireAdmin())) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();

  const {
    data: orderData,
    error: orderError,
  } = await supabase
    .from("orders")
    .select(
      `
        id,
        customer_email,
        customer_name,
        amount_total,
        currency,
        payment_status,
        created_at
      `
    )
    .eq("payment_status", "paid")
    .order("created_at", { ascending: false });

  if (orderError) {
    console.error(
      "Unable to load customers:",
      orderError
    );
  }

  const {
    data: rewardData,
    error: rewardError,
  } = await supabase
    .from("reward_accounts")
    .select(
      `
        email,
        points_balance,
        lifetime_points,
        joined_at
      `
    );

  if (rewardError) {
    console.error(
      "Unable to load reward accounts:",
      rewardError
    );
  }

  const orders =
    (orderData ?? []) as Order[];

  const rewardAccounts =
    (rewardData ?? []) as RewardAccount[];

  const rewardMap =
    new Map<string, RewardAccount>();

  for (const account of rewardAccounts) {
    rewardMap.set(
      account.email.trim().toLowerCase(),
      account
    );
  }

  const customerMap =
    new Map<string, Customer>();

  for (const order of orders) {
    if (!order.customer_email) {
      continue;
    }

    const email =
      order.customer_email
        .trim()
        .toLowerCase();

    const rewardAccount =
      rewardMap.get(email);

    const existing =
      customerMap.get(email);

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent +=
        order.amount_total;

      if (
        new Date(order.created_at) >
        new Date(existing.lastOrder)
      ) {
        existing.lastOrder =
          order.created_at;

        if (order.customer_name) {
          existing.name =
            order.customer_name;
        }
      }

      if (
        new Date(order.created_at) <
        new Date(existing.firstOrder)
      ) {
        existing.firstOrder =
          order.created_at;
      }
    } else {
      customerMap.set(email, {
        email,
        name:
          order.customer_name ||
          "Customer",
        orderCount: 1,
        totalSpent:
          order.amount_total,
        currency:
          order.currency ||
          "usd",
        firstOrder:
          order.created_at,
        lastOrder:
          order.created_at,
        rewardsMember:
          Boolean(rewardAccount),
        pointsBalance:
          rewardAccount?.points_balance ??
          0,
        lifetimePoints:
          rewardAccount?.lifetime_points ??
          0,
      });
    }
  }

  const customers =
    Array.from(
      customerMap.values()
    ).sort(
      (a, b) =>
        new Date(
          b.lastOrder
        ).getTime() -
        new Date(
          a.lastOrder
        ).getTime()
    );

  const totalCustomerRevenue =
    customers.reduce(
      (total, customer) =>
        total +
        customer.totalSpent,
      0
    );

  const repeatCustomers =
    customers.filter(
      (customer) =>
        customer.orderCount > 1
    ).length;

  const rewardsMembers =
    customers.filter(
      (customer) =>
        customer.rewardsMember
    ).length;

  const outstandingPoints =
    customers.reduce(
      (total, customer) =>
        total +
        customer.pointsBalance,
      0
    );

  const error =
    orderError ||
    rewardError;

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
              Sweet Tey&apos;s Pastries
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
              Customers
            </h1>

            <p className="mt-2 text-[#6b5548]">
              View paid customers and
              Sweet Rewards point balances.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex w-fit items-center justify-center rounded-full border border-pink-200 bg-white px-6 py-3 font-bold text-[#4b3428] transition hover:bg-pink-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Customers
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {customers.length}
            </p>
          </article>

          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Repeat Customers
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {repeatCustomers}
            </p>
          </article>

          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Rewards Members
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {rewardsMembers}
            </p>

            <p className="mt-2 text-sm text-[#7a6a61]">
              {outstandingPoints.toLocaleString()} points outstanding
            </p>
          </article>

          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Customer Revenue
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {formatMoney(
                totalCustomerRevenue
              )}
            </p>
          </article>
        </section>

        {error ? (
          <section className="mt-7 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
            Customer or rewards information
            could not be loaded. Check the
            server terminal for details.
          </section>
        ) : customers.length === 0 ? (
          <section className="mt-7 rounded-3xl border border-pink-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">
              👥
            </div>

            <h2 className="mt-5 font-serif text-3xl font-bold text-[#4b3428]">
              No customers yet
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6b5548]">
              Customers will appear
              automatically after they
              complete a paid order.
            </p>
          </section>
        ) : (
          <section className="mt-7 overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.3fr_1.5fr_0.65fr_0.8fr_1fr_1fr] gap-4 border-b border-pink-100 bg-[#fffaf7] px-6 py-4 text-sm font-bold uppercase tracking-wide text-[#7a6a61] lg:grid">
              <span>Customer</span>
              <span>Email</span>
              <span>Orders</span>
              <span>Rewards</span>
              <span>Total Spent</span>
              <span>Last Order</span>
            </div>

            <div className="divide-y divide-pink-100">
              {customers.map(
                (customer) => (
                  <article
                    key={customer.email}
                    className="grid gap-4 px-6 py-6 lg:grid-cols-[1.3fr_1.5fr_0.65fr_0.8fr_1fr_1fr] lg:items-center"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#7a6a61] lg:hidden">
                        Customer
                      </p>

                      <p className="mt-1 font-bold text-[#4b3428] lg:mt-0">
                        {customer.name}
                      </p>

                      <p className="mt-1 text-xs text-[#7a6a61]">
                        Since{" "}
                        {formatDate(
                          customer.firstOrder
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#7a6a61] lg:hidden">
                        Email
                      </p>

                      <p className="mt-1 break-all text-[#6b5548] lg:mt-0">
                        {customer.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#7a6a61] lg:hidden">
                        Orders
                      </p>

                      <p className="mt-1 font-bold text-[#4b3428] lg:mt-0">
                        {customer.orderCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#7a6a61] lg:hidden">
                        Rewards
                      </p>

                      {customer.rewardsMember ? (
                        <>
                          <p className="mt-1 font-bold text-[#ed6f91] lg:mt-0">
                            {customer.pointsBalance.toLocaleString()} pts
                          </p>

                          <p className="mt-1 text-xs text-[#7a6a61]">
                            {customer.lifetimePoints.toLocaleString()} lifetime
                          </p>
                        </>
                      ) : (
                        <p className="mt-1 text-sm text-[#7a6a61] lg:mt-0">
                          Not joined
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#7a6a61] lg:hidden">
                        Total Spent
                      </p>

                      <p className="mt-1 font-bold text-[#ed6f91] lg:mt-0">
                        {formatMoney(
                          customer.totalSpent,
                          customer.currency
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#7a6a61] lg:hidden">
                        Last Order
                      </p>

                      <p className="mt-1 text-[#6b5548] lg:mt-0">
                        {formatDate(
                          customer.lastOrder
                        )}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
