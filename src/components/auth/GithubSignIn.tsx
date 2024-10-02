"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import githubImg from "../../assets/github.svg";
import { signIn } from "next-auth/react";

const GithubSignIn = () => {
  const handleGithubSignIn = () => {
    // implement your logic here
    signIn("github", { redirect: false });
  };

  return (
    <div className="px-3 pb-2">
      <Button
        onClick={handleGithubSignIn}
        className="w-full text-center"
        variant={"secondary"}
      >
        <span>Sign in with Github</span>
        <Image src={githubImg} alt="Github Logo" className="w-[5%] ml-2" />
      </Button>
    </div>
  );
};

export default GithubSignIn;
