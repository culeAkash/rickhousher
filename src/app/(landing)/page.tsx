"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";

const LandingPage = () => {
  const session = useSession();

  return (
    <div>
      <div className="text-2xl text-red-500 font-medium">Landing Page</div>
      <h2>Sign In with Google</h2>
      <button onClick={() => signIn("google")}>Sign in</button>
      <h2>Sign In with Github</h2>
      <button onClick={() => signIn("github")}>Sign in</button>
    </div>
  );
};

export default LandingPage;
