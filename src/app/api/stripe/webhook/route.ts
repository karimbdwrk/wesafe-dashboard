import { headers } from "next/headers";
import { NextResponse } from "next/server";

import type Stripe from "stripe";

import { stripe } from "@/lib/stripe/stripe";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

// Map Stripe subscription status → our subscription_status field
function resolveSubscriptionStatus(stripeStatus: Stripe.Subscription["status"], planKey: string | null): string {
  if (stripeStatus !== "active" && stripeStatus !== "trialing") return "standard";
  if (planKey === "premium") return "premium";
  if (planKey === "standard_plus") return "standard_plus";
  return "standard";
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const companyId = session.metadata?.company_id;

      if (!companyId) break;

      const paymentType = session.metadata?.type;

      if (session.mode === "payment" && paymentType === "lastminute_credits") {
        const creditsToAdd = Number(session.metadata?.credits_amount ?? 0);
        if (creditsToAdd > 0) {
          const { data: company } = await supabaseAdmin
            .from("companies")
            .select("last_minute_credits")
            .eq("id", companyId)
            .single();
          const current = company?.last_minute_credits ?? 0;
          await supabaseAdmin
            .from("companies")
            .update({ last_minute_credits: current + creditsToAdd })
            .eq("id", companyId);
        }
      } else if (session.mode === "payment" && paymentType === "lastminute_oneshot") {
        const jobId = session.metadata?.job_id;
        if (jobId) {
          await supabaseAdmin.from("jobs").update({ isLastMinute: true }).eq("id", jobId);
          await supabaseAdmin.from("transactions").insert({
            company_id: companyId,
            amount: 6.0,
            currency: "EUR",
            transaction_type: "payment",
            credits_added: 0,
            credits_deducted: 0,
            description: "Paiement one-shot Last Minute (6€)",
            event_type: "last_minute_oneshot_payment",
            stripe_customer_id: session.customer as string | null,
          });
        }
      } else if (session.mode === "payment" && paymentType === "job_sponsorship") {
        const jobId = session.metadata?.job_id;
        const duration = session.metadata?.sponsorship_duration;
        if (jobId && duration) {
          const d = new Date();
          if (duration === "1w") d.setDate(d.getDate() + 7);
          else if (duration === "2w") d.setDate(d.getDate() + 14);
          else if (duration === "1m") d.setMonth(d.getMonth() + 1);
          await supabaseAdmin
            .from("jobs")
            .update({ sponsorship_date: d.toISOString().split("T")[0] })
            .eq("id", jobId);
          const amountMap: Record<string, number> = { "1w": 9.99, "2w": 17.99, "1m": 29.99 };
          await supabaseAdmin.from("transactions").insert({
            company_id: companyId,
            amount: amountMap[duration] ?? 0,
            currency: "EUR",
            transaction_type: "payment",
            credits_added: 0,
            credits_deducted: 0,
            description: `Sponsoring d'annonce (${duration === "1w" ? "1 semaine" : duration === "2w" ? "2 semaines" : "1 mois"})`,
            event_type: "sponsored_job_payment",
            stripe_customer_id: session.customer as string | null,
          });
        }
      } else {
        const planKey = session.metadata?.plan_key ?? null;
        await supabaseAdmin
          .from("companies")
          .update({ subscription_status: resolveSubscriptionStatus("active", planKey) })
          .eq("id", companyId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const companyId = sub.metadata?.company_id;
      const planKey = sub.metadata?.plan_key ?? null;
      if (companyId) {
        await supabaseAdmin
          .from("companies")
          .update({ subscription_status: resolveSubscriptionStatus(sub.status, planKey) })
          .eq("id", companyId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const companyId = sub.metadata?.company_id;
      if (companyId) {
        await supabaseAdmin.from("companies").update({ subscription_status: "standard" }).eq("id", companyId);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
