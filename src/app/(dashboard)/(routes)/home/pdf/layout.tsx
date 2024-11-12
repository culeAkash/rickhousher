import Heading from "@/components/heading";
import { FileIcon } from "lucide-react";
import React from "react";

const FileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Heading
        title="Pdf Assistant"
        description="Check out our brand new Pdf Assistant. Upload your files and get started."
        icon={FileIcon}
        iconColor="text-amber-500"
        bgColor="bg-amber-500/10"
      />
      {children}
    </>
  );
};

export default FileLayout;
