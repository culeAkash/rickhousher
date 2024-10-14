import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/api/auth/[...nextauth]/options";
import NavbarProfilePop from "./NavbarProfilePop";
import { getApiLimitCount } from "@/lib/api-limit";

const Navbar = async () => {
  const session = await getServerSession(AuthOptions);

  console.log(session);

  const apiLimitCount = await getApiLimitCount();

  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount as number} />
      <div className="flex w-full justify-end">
        {/* TODO : user button to open user setting and pricing will be here */}

        <NavbarProfilePop user={session?.user} />
      </div>
    </div>
  );
};

export default Navbar;
