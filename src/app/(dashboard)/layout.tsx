import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full pb-3 relative">
      <div className="hidden h-full md:flex md:w-80 md:flex-col md:fixed sm:inset-y-0 z-[80] bg-gray-950">
        <Sidebar />
      </div>
      <main className="md:pl-80">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
