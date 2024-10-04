"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../assets/rickhousher_logo.jpg";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { SidebarRoute } from "@/types/utils";
import {
  Code,
  FileIcon,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  MusicIcon,
  Settings,
  VideoIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const routes: SidebarRoute[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/home/dashboard",
    color: "text-sky-600",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/home/conversation",
    color: "text-violet-500",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/home/image",
    color: "text-pink-700",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/home/video",
    color: "text-orange-700",
  },
  {
    label: "Music Generation",
    icon: MusicIcon,
    href: "/home/music",
    color: "text-emerald-500",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/home/code",
    color: "text-green-700",
  },
  {
    label: "Pdf Assistant",
    icon: FileIcon,
    href: "/home/pdf",
    color: "text-amber-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/home/settings",
    color: "",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href={"/"} className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Image src={logo} alt="Website logo" fill />
          </div>
          <h1 className={cn("text-xl font-bold", montserrat.className)}>
            Rickhousher
          </h1>
        </Link>
        <div className="flex flex-col gap-3 px-2">
          {routes.map((route) => (
            <Link
              className={`hover:bg-white/60 text-sm hover:text-gray-900 h-10 mx-2 rounded-md flex items-center px-3 transition ${
                pathname.startsWith(route.href)
                  ? "bg-white/60 text-gray-900"
                  : ""
              }`}
              key={route.href}
              href={route.href}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
