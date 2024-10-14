import { DashboardTool } from "@/types/utils";
import {
  Code,
  FileIcon,
  ImageIcon,
  MessageSquare,
  MusicIcon,
} from "lucide-react";

export const MAX_FREE_USAGE_COUNTS = 10;

export const tools: DashboardTool[] = [
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
