import Heading from "@/components/heading";
import SubscriptionButton from "@/components/settings/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { Settings } from "lucide-react";
import React from "react";

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div>
      <Heading
        title="Settings"
        description="Customize your Rickhousher experience"
        icon={Settings}
        iconColor="text-gray-900"
        bgColor="bg-gray-900/10"
      />
      <div className="px-4 lg:px-8 h-fit">
        <div className="text-muted-foreground text-sm mb-3">
          {isPro
            ? "You are currently on a pro plan."
            : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;
