import { AuthOptions } from "@/app/api/auth/[...nextauth]/options";
import Heading from "@/components/heading";
import NavButton from "@/components/settings/nav-button";
import { Settings } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const SettingsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(AuthOptions);
  if (!session || !session.user || !session.user.id) {
    redirect("/auth/sign-in");
  }
  return (
    <div>
      <Heading
        title="Settings"
        description="Customize your Rickhousher experience"
        icon={Settings}
        iconColor="text-gray-900"
        bgColor="bg-gray-900/10"
      />
      <div>
        <div className="flex flex-row gap-4 gap-x-3 mb-8 px-4 lg:px-8">
          <NavButton href="/home/settings/profile" label="Profile" />
          <NavButton href="/home/settings/pricing" label="Pricing" />
        </div>
      </div>
      {children}
    </div>
  );
};

export default SettingsLayout;
