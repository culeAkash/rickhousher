import { AuthOptions } from "@/app/api/auth/[...nextauth]/options";
import BasicInfoUpdateSection from "@/components/settings/basic-info-update-section";
import PasswordChangeSection from "@/components/settings/password-change-section";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import React from "react";

const ProfilePage = async () => {
  const session = await getServerSession(AuthOptions);

  const userId = session?.user.id;

  let user;
  if (userId) {
    user = await db.user.findUnique({
      where: { id: userId },
    });
  }
  return (
    <div className="px-4 lg:px-8 h-fit p-5">
      <BasicInfoUpdateSection
        name={user?.name || ""}
        username={user?.username || ""}
        image={user?.image || ""}
      />
      <PasswordChangeSection />
    </div>
  );
};

export default ProfilePage;
