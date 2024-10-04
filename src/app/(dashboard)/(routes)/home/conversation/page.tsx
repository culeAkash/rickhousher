import ChatSection from "@/components/conversation/chat-section";
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
          <ChatSection />
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
