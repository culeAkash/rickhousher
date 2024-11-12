import Stripe from "stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";

export const POST = async (request: NextRequest) => {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Error with Stripe webhook:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Webhook error : ${error.message}`,
      },
      {
        status: 400,
      }
    );
  }

  // console.log(event.data.object.);

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session.metadata?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "No userId in metadata",
        },
        {
          status: 400,
        }
      );
    }

    await db.userSubscription.create({
      data: {
        userId: session.metadata.userId,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return NextResponse.json(
    {
      success: true,
      message: "Webhook processed successfully",
    },
    {
      status: 200,
    }
  );
};
