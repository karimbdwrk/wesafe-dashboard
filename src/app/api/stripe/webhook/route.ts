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

      if (session.mode === "payment" && session.metadata?.type === "lastminute_credits") {
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
