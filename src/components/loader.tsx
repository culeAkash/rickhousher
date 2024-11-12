import { Loader2 as Loading } from "lucide-react";
import React from "react";

interface loaderProps {
  label: string;
}

const Loader = ({ label }: loaderProps) => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center mt-5">
      <div className="w-10 h-10 relative">
        <Loading className="mr-2 h-10 w-10 animate-spin text-primary" />
      </div>
      <p className="text-sm text-pretty">{label}</p>
    </div>
  );
};

export default Loader;
