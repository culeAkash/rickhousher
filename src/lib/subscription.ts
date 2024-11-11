import { AuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/db";
import { getServerSession } from "next-auth";

const DAY_IN_MILLIS = 86_400_000;

export const checkSubscription = async () => {
  const session = await getServerSession(AuthOptions);

  console.log("Inside check subscription", session);

  if (!session || !session.user || !session.user.id) {
    return false;
  }

  const userId = session.user.id;

  const userSubscritption = await db.userSubscription.findUnique({
    where: {
      userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  console.log(userSubscritption);

  if (!userSubscritption) return false;

  const isSubscriptionValid =
    userSubscritption.stripePriceId &&
    userSubscritption.stripeCurrentPeriodEnd!.getTime() + DAY_IN_MILLIS >
      Date.now();
  // console.log(isSubscriptionValid);

  return !!isSubscriptionValid;
};
