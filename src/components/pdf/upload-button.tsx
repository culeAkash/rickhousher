"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button className="gap-x-2">
          <Upload size={15} />
          Upload File
        </Button>
      </DialogTrigger>

      <DialogContent>Example content</DialogContent>
    </Dialog>
  );
};

export default UploadButton;
