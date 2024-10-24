import React, { useContext, useRef } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { ChatContext } from "@/context/chat-context-provider";

const ChatInput = ({ isDisabled }: { isDisabled: boolean }) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-lg border w-full p-4 px-3 md:px-4 focus-within:shadow-sm grid grid-cols-12 gap-2">
      <div className="col-span-12 lg:col-span-9">
        <div className="m-0 p-3">
          <Input
            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
            disabled={isLoading}
            ref={inputRef}
            placeholder="Ask me anything!"
            onChange={handleInputChange}
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addMessage();
                inputRef.current?.focus();
              }
            }}
          />
        </div>
      </div>
      <Button
        disabled={isLoading || isDisabled}
        className="col-span-12 lg:col-span-3 w-full place-self-center"
        type="submit"
        onClick={() => {
          addMessage();
          inputRef.current?.focus();
        }}
      >
        Generate
      </Button>
    </div>
  );
};

export default ChatInput;
