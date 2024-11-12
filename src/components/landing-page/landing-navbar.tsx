"use client";
import { useSession } from "next-auth/react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../assets/rickhousher_logo.jpg";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const font = Montserrat({
  weight: "500",
  subsets: ["latin"],
});

const LandingNavbar = () => {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative w-8 h-8 mr-4">
          <Image alt="Website logo" src={logo} fill />
        </div>
        <h1 className={cn("text-2xl font-bold", font.className, "text-white")}>
          Rickhousher
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={user ? "/home/dashboard" : "/auth/sign-in"}>
          <Button variant={"secondary"} className="rounded-full">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
