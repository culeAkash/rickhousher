import { useProModal } from "@/hooks/use-pro-modal";
import { useToast } from "@/hooks/use-toast";
import { StreamResponse } from "@/types/utils";
import { useChat } from "ai/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useRef, useState } from "react";
import { Message } from "ai/react";

export const ChatContext = createContext<StreamResponse>({
  addMessage: (message: string) => {},
  messages: [],
  onStop: () => {},
  gettingResponse: false,
  isFetchingFromDB: false,
  isLoading: false,
  fetchMoreMessages: () => {},
  hasMore: true,
  resetScroll: true,
});

interface Props {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const proModal = useProModal();

  const [gettingResponse, setGettingResponse] = useState(false);
  const [isFetchingFromDB, setIsFetchingFromDB] = useState(false);
  const resetScroll = useRef(true);

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { messages, setMessages, isLoading, stop, error, append } = useChat({
    keepLastMessageOnError: true,
    api: "/api/pdf",
    body: {
      fileId,
    },
    onResponse: (response) => {
      setGettingResponse(false);
      console.log(response.status);
      if (response.status === 403) {
        proModal.onOpen();
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
      if (isFetchingFromDB || !hasMore) return;
      // setGetResponse(true);
      resetScroll.current = true;
      setIsFetchingFromDB(true);
      try {
        const response = await axios.post("/api/pdf/getMessages", {
          fileId,
          cursor: nextCursor,
          limit: 10,
        });

        const result = response.data;
        if (result.success) {
          setMessages((prevMessages) => [
            ...prevMessages,
            ...result.data.responseMessages,
          ]);
          setNextCursor(result.data.nextCursor);
          setHasMore(Boolean(result.data.nextCursor));
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch messages.",
          variant: "destructive",
        });
      } finally {
        setIsFetchingFromDB(false);
      }
    }
    fetchData();
  }, [fileId, setMessages, toast]);

  const onStop = () => {
    stop();
  };

  const addMessage = (message: string) => {
    console.log(message);
    resetScroll.current = true;
    setGettingResponse(true);
    append({
      role: "user",
      content: message,
    });
  };

  const fetchMoreMessages = async () => {
    async function fetchData() {
      if (isFetchingFromDB || !hasMore) return;
      setIsFetchingFromDB(true);
      resetScroll.current = false;
      try {
        const response = await axios.post("/api/pdf/getMessages", {
          fileId,
          cursor: nextCursor,
          limit: 10,
        });

        const result = response.data;
        if (result.success) {
          setMessages((prevMessages) => [
            ...result.data.responseMessages,
            ...prevMessages,
          ]);
          setNextCursor(result.data.nextCursor);
          setHasMore(Boolean(result.data.nextCursor));
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch messages.",
          variant: "destructive",
        });
      } finally {
        setIsFetchingFromDB(false);
      }
    }
    fetchData();
  };

  console.log(messages);

  return (
    <ChatContext.Provider
      value={{
        messages,
        onStop,
        gettingResponse,
        isFetchingFromDB,
        addMessage,
        isLoading,
        fetchMoreMessages,
        hasMore,
        resetScroll: resetScroll.current,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
