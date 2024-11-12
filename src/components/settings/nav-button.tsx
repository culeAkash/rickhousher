"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const NavButton = ({ href, label }: { href: string; label: string }) => {
  const path = usePathname();
  return (
    <Link href={href}>
      <Button variant={path === href ? "default" : "secondary"} size={"lg"}>
        {label}
      </Button>
    </Link>
  );
};

export default NavButton;
