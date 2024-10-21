import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

import { useForm } from "react-hook-form";
import { conversationFormSchema } from "@/schemas/conversationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const ChatInput = ({ isDisabled }: { isDisabled: boolean }) => {
  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });
  return (
    <Form {...form}>
      <form className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
        <FormField
          name="prompt"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-9">
              <FormControl className="m-0 p-3">
                <Input
                  {...field}
                  className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                  // disabled={isLoading}
                  placeholder="Ask me anything!"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="col-span-12 lg:col-span-3 w-full" type="submit">
          Generate
        </Button>
      </form>
    </Form>
  );
};

export default ChatInput;
