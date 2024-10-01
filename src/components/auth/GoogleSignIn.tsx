"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import googleImg from "../../assets/google.svg";
import { signIn } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

const GoogleSignIn = () => {
  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "http://localhost:3000/dashboard",
    });
  };

  return (
    <div className="p-3">
      <Button
        onClick={handleGoogleSignIn}
        className="w-full text-center"
        variant={"secondary"}
      >
        <span>Sign in with Google</span>
        <Image src={googleImg} alt="Google Logo" className="w-[5%] ml-2" />
      </Button>
    </div>
  );
};

export default GoogleSignIn;
