import CodeSection from "@/components/code/code-section";
import Heading from "@/components/heading";
import { Code } from "lucide-react";
import React from "react";

const ConversationPage = () => {
  return (
    <div>
      <Heading
        title="Code Generation"
        description="Check out our new Code Generation Model"
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <CodeSection />
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
