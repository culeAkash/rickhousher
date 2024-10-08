import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import axios from "axios";
import { AuthOptions } from "@/app/api/auth/[...nextauth]/options";
import NavbarProfilePop from "./NavbarProfilePop";

const Navbar = async () => {
  const session = await getServerSession(AuthOptions);

  console.log(session);

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        {/* TODO : user button to open user setting and pricing will be here */}

        <NavbarProfilePop user={session?.user} />
      </div>
    </div>
  );
};

export default Navbar;
