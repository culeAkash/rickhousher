import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const PdfNotFound = () => {
  return (
    <div className="text-center font-extrabold text-3xl">
      <p className="font-mono mb-5">Pdf Not Found !</p>
      <Link href={"/home/pdf"}>
        <Button variant={"premium"}>Back to Home</Button>
      </Link>
    </div>
  );
};

export default PdfNotFound;
