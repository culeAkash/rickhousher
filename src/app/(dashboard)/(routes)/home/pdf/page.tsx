import Empty from "@/components/empty";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import PdfSection from "@/components/pdf/pdf-section";
import { FileIcon } from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React, { Suspense } from "react";

const ErrorComponent = async () => {
  "use server";
  return <Empty label="Couldn't fetch PDF files. Please try again later." />;
};

const PdfAssistantPage = () => {
  return (
    <div>
      <Heading
        title="Pdf Assistant"
        description="Check out our brand new Pdf Assistant. Upload your files and get started."
        icon={FileIcon}
        iconColor="text-amber-500"
        bgColor="bg-amber-500/10"
      />
      <div className="px-4 lg:px-8 h-fit">
        <ErrorBoundary errorComponent={ErrorComponent}>
          <Suspense fallback={<Loader />}>
            <PdfSection />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default PdfAssistantPage;
