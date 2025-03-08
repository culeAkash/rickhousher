import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "RickHousher",
  description: "Your all in one place AI assistant",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full bg-[#111827] overflow-auto">
      <div className="mx-auto max-w-screen-xl h-full w-full">{children}</div>
    </main>
  );
}
