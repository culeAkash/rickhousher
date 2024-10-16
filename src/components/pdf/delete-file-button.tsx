"use client";
import React from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface DeleteFileProps {
  fileId: string;
}

const DeleteFileButton = ({ fileId }: DeleteFileProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const deleteFileHandler = async () => {
    console.log(fileId);

    try {
      await axios.delete("/api/file", {
        params: {
          fileId,
        },
      });

      router.refresh();
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;

      toast({
        title: "Error",
        description: axiosError.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      size={"sm"}
      className="w-full"
      variant={"destructive"}
      onClick={deleteFileHandler}
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
};

export default DeleteFileButton;
