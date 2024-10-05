"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DashboardTool } from "@/types/utils";
import {
  ArrowRight,
  Code,
  FileIcon,
  ImageIcon,
  MessageSquare,
  MusicIcon,
  VideoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const tools: DashboardTool[] = [
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/home/conversation",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/home/image",
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/home/video",
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
  },
  {
    label: "Music Generation",
    icon: MusicIcon,
    href: "/home/music",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/home/code",
    color: "text-green-700",
    bgColor: "bg-green-700/10",
  },
  {
    label: "Pdf Assistant",
    icon: FileIcon,
    href: "/home/pdf",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const DashboardPage = () => {
  const router = useRouter();

  return (
    <>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the Smartest AI - RickHouSher
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 flex flex-col gap-4 box-border pb-16">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </>
  );
};

export default DashboardPage;