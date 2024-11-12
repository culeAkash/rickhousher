import BasicInfoUpdateSection from "@/components/settings/basic-info-update-section";
import PasswordChangeSection from "@/components/settings/password-change-section";
import React from "react";

const ProfilePage = () => {
  return (
    <div className="px-4 lg:px-8 h-fit p-5">
      <BasicInfoUpdateSection />
      <PasswordChangeSection />
    </div>
  );
};

export default ProfilePage;
