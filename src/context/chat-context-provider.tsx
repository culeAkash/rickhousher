import { useToast } from "@/hooks/use-toast";
import { StreamResponse } from "@/types/utils";
import axios from "axios";
import { createContext, useState } from "react";

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  //   make api call to receive ai response based on file id and user message
  const sendMessage = async ({ message }: { message: string }) => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/pdf", {
        fileId,
        message,
      });

      console.log(response);
    } catch (error) {
      // error handling
    } finally {
      console.log("finally");

      setIsLoading(false);
      setMessage("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
