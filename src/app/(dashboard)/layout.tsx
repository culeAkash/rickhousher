import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";
import { getApiLimitCount } from "@/lib/api-limit";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();

  return (
    <div className="h-full pb-3 relative">
      <div className="hidden h-full md:flex md:w-80 md:flex-col md:fixed sm:inset-y-0 bg-gray-950">
        <Sidebar apiLimitCount={apiLimitCount as number} />
      </div>
      <main className="md:pl-80">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
