import Heading from "@/components/heading";
import ImageSection from "@/components/image/image-section";
import { ImageIcon } from "lucide-react";
import React from "react";

const ImageGenerrationPage = () => {
  return (
    <div>
      <Heading
        title="Image Generation"
        description="Give prompt and turn your ideas into beautiful images"
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8 h-fit">
        <ImageSection />
      </div>
    </div>
  );
};

export default ImageGenerrationPage;
