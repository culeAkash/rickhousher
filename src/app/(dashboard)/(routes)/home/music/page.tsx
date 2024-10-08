import Heading from "@/components/heading";
import MusicSection from "@/components/music/music-section";
import { MusicIcon } from "lucide-react";
import React from "react";

const ImageGenerrationPage = () => {
  return (
    <div>
      <Heading
        title="Music Generation"
        description="Give prompt and turn your ideas into music"
        icon={MusicIcon}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8 h-fit">
        <MusicSection />
      </div>
    </div>
  );
};

export default ImageGenerrationPage;
