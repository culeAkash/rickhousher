import Link from "next/link";
import React from "react";

interface NavPopLinkProps {
  label: string;
  link: string;
}

const NavPopLink = ({ label, link }: NavPopLinkProps) => {
  return (
    <Link href={link}>
      <p className="font-mono pl-1 hover:border-black hover:shadow-md border-transparent border-2 rounded-sm cursor-pointer hover:bg-gray-700 hover:text-white">
        {label}
      </p>
    </Link>
  );
};

export default NavPopLink;
