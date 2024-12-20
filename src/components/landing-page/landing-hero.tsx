"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import TypeWriterComponent from "typewriter-effect";
import { Button } from "../ui/button";
const LandingHero = () => {
  const { data: session } = useSession();
  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>The Best AI tool for</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <TypeWriterComponent
            options={{
              strings: [
                "Chatbot.",
                "Image Generation.",
                "Music Generation.",
                "Code Assistance.",
                "Pdf Assistance.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400">
        RickHouSher is a powerful AI tool that helps you achieve your goals in a
        simple and efficient way.
      </div>
      <div className="">
        <Link href={session?.user ? "/home/dashboard" : "/auth/sign-in"}>
          <Button
            variant={"premium"}
            className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
          >
            Start Generating for Free
          </Button>
        </Link>
      </div>
      <div className="text-zinc-400 text-xs md:text-sm font-normal">
        No credit card required.
      </div>
    </div>
  );
};

export default LandingHero;
