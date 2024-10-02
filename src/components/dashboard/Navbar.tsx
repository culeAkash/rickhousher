import React from "react";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        {/* TODO : user button to open user setting and pricing will be here */}
      </div>
    </div>
  );
};

export default Navbar;
