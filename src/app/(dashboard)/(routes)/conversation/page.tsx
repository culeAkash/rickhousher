import ConversationForm from "@/components/conversation/form";
import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";
import React from "react";

const ConversationPage = () => {
  return (
    <div>
      <Heading
        title="Conversation"
        description="Check out our new Conversation Model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <ConversationForm />
        </div>
        <div className="space-y-4 mt-4">Messages Content</div>
      </div>
    </div>
  );
};

export default ConversationPage;
