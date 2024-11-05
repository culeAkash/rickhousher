import { useProModal } from "@/hooks/use-pro-modal";
import { useToast } from "@/hooks/use-toast";
import { StreamResponse } from "@/types/utils";
import { useChat } from "ai/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  messages: [],
  onStop: () => {},
  getResponse: false,
  isFetching: false,
});

interface Props {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const proModal = useProModal();

  const [getResponse, setGetResponse] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { messages, setMessages, isLoading, stop, error, handleSubmit } =
    useChat({
      keepLastMessageOnError: true,
      api: "/api/pdf",
      onResponse: (response) => {
        setGetResponse(false);
        console.log(response.status);
        if (response.status === 403) {
          proModal.onOpen();
        }
      },
      onFinish: async (message) => {
        const response = await axios.post("/api/messages", {
          chatType: "PDF",
          message: message.content,
          role: "ASSISTANT",
        });
        if (!response.data.success) {
          toast({
            title: "Error",
            description: response.data.message,
            variant: "destructive",
          });
        }
      },
    });

  useEffect(() => {
    if (error) {
      console.log(error);
      const errorObj = JSON.parse(error.message);

      console.log(errorObj);

      toast({
        title: "Error",
        description: errorObj.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    async function fetchData() {
      if (isFetching || !hasMore) return;
      // setGetResponse(true);
      setIsFetching(true);
      const response = await axios.post("/api/pdf/getMessages", {
        fileId,
        cursor: nextCursor,
        limit: 10,
      });

      const result = response.data;

      if (result.success) {
        setMessages(result.data.messages);
        setNextCursor(result.data.nextCursor);
        setHasMore(Boolean(result.data.nextCursor));
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [fileId, setMessages, toast]);

  const onStop = () => {
    stop();
  };

  const addMessage = (message: string) => {};

  return (
    <ChatContext.Provider
      value={{
        messages,
        onStop,
        getResponse,
        isFetching,
        addMessage,
      }}
    ></ChatContext.Provider>
  );
};

// export const ChatContextDemo = ({ fileId, children }: Props) => {
//   const [message, setMessage] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const { toast } = useToast();

//   //   make api call to receive ai response based on file id and user message
//   const sendMessage = async ({ message }: { message: string }) => {
//     try {
//       setIsLoading(true);

//       const response = await axios.post("/api/pdf", {
//         fileId,
//         message,
//       });

//       console.log(response);
//     } catch (error) {
//       // error handling
//     } finally {
//       console.log("finally");

//       setIsLoading(false);
//       setMessage("");
//     }
//   };

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setMessage(event.target.value);
//   };

//   const addMessage = () => sendMessage({ message });

//   return (
//     <ChatContext.Provider
//       value={{
//         addMessage,
//         message,
//         handleInputChange,
//         isLoading,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };
