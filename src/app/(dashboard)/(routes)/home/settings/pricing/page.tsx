import SubscriptionButton from "@/components/settings/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import React from "react";

const PricingPage = async () => {
  const isPro = await checkSubscription();
  return (
    <div className="px-4 lg:px-8 h-fit">
      <div className="text-muted-foreground text-sm mb-3">
        {isPro
          ? "You are currently on a pro plan."
          : "You are currently on a free plan."}
      </div>
      <SubscriptionButton isPro={isPro} />
    </div>
  );
};

export default PricingPage;
