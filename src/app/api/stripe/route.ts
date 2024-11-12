import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const settingsUrl = absoluteUrl("/home/settings");

export const GET = async (request: NextRequest) => {
  const session = await getServerSession(AuthOptions);

  console.log(session);

  const userId = session?.user.id;
  const userEmail = session?.user.email;

  if (!session || !session.user || !session.user.id || !userEmail) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authorized",
      },
      {
        status: 401,
      }
    );
  }

  console.log(userId);

  try {
    const userSubscription = await db.userSubscription.findUnique({
      where: {
        userId: userId,
      },
    });

    console.log(userSubscription);

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            url: stripeSession.url,
          },
        },
        {
          status: 200,
        }
      );
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: userEmail!,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Rickhousher Pro",
              description: "Unlimited access to Rickhousher Pro features",
            },
            unit_amount: 1000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId!, // Store the user ID in the session metadata
      },
    });

    console.log(stripeSession);

    return NextResponse.json(
      {
        success: true,
        data: {
          url: stripeSession.url,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
};
