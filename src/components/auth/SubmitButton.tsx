import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      className="mt-3"
      type="submit"
      variant={"outline"}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait ...
        </>
      ) : (
        <span className="font-bold font-sans">SignUp</span>
      )}
    </Button>
  );
};

export default SubmitButton;
