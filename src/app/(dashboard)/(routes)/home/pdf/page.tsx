import ChatSection from "@/components/conversation/chat-section";
import Heading from "@/components/heading";
import { FileIcon } from "lucide-react";
import React from "react";

const PdfAssistantPage = () => {
  return (
    <div>
      <Heading
        title="Pdf Assistant"
        description="Check out our brand new Pdf Assistant. Upload your files and get started."
        icon={FileIcon}
        iconColor="text-amber-500"
        bgColor="bg-amber-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>Pdf Dashboard</div>
      </div>
    </div>
  );
};

export default PdfAssistantPage;
