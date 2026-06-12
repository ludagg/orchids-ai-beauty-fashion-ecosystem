import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { BillingClient } from "./BillingClient";
import { stripe } from "@/lib/stripe";

export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return null; // Handle redirect in middleware or auth guard
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true
    }
  });

  let subscriptionData = { status: "inactive" };
  let invoicesData: any[] = [];

  if (user?.stripeSubscriptionId) {
     try {
         const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
         subscriptionData = { status: subscription.status };

         if (user.stripeCustomerId) {
             const invoicesList = await stripe.invoices.list({ customer: user.stripeCustomerId, limit: 10 });
             invoicesData = invoicesList.data.map(inv => ({
                 id: inv.number || inv.id,
                 date: new Date(inv.created * 1000).toLocaleDateString(),
                 plan: "Pro Plan",
                 amount: (inv.amount_paid / 100).toLocaleString('en-IN', { style: 'currency', currency: inv.currency.toUpperCase() }),
                 status: inv.status === 'paid' ? 'Paid' : inv.status,
                 url: inv.hosted_invoice_url
             }));
         }
     } catch (err) {
         console.error("Error fetching stripe sub data:", err);
     }
  }

  return (
      <BillingClient
          subscription={subscriptionData}
          invoices={invoicesData}
      />
  );
}
