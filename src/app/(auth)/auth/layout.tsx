import React from "react";
import classes from "./auth.module.css";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div
        className={`${classes.content} min-h-[100vh] h-[100%] w-[100%] flex justify-center items-center p-6`}
      >
        <main className="flex flex-col gap-1 h-fit border-2 w-[80%] md:w-[60%] lg:w-[40%] border-stone-50 rounded-sm shadow-md shadow-gray-400 bg-white p-6 box-border">
          {children}
        </main>
      </div>
    </>
  );
};

export default AuthLayout;
