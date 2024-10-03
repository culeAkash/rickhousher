import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import ProfileSection from "./profile-section";

const ProfileSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <p className="font-mono pl-1 hover:border-black hover:shadow-md border-transparent border-2 rounded-sm cursor-pointer hover:bg-gray-700 hover:text-white">
          Profile
        </p>
      </SheetTrigger>
      <SheetContent className="h-[70%] p-12 md:p-16" side={"top"}>
        <ProfileSection />
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;
