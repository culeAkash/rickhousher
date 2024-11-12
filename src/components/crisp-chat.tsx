"use client";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("20da6943-f46c-40a0-b8be-ede7c95b1c1c");
  }, []);

  return null;
};

export default CrispChat;
