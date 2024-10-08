import { Loader as Loading } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative">
        <Loading className="mr-2 h-10 w-10 animate-spin text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">
        Loading your desired result... Please wait...
      </p>
    </div>
  );
};

export default Loader;
