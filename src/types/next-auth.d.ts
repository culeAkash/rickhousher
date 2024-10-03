import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    email?: string;
    image?: string;
    isSubscribed?: boolean;
  }

  interface Session {
    user: {
      _id?: string;
      username?: string;
      email?: string;
      image?: string;
      isSubscribed?: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    _id?: string;
    username?: string;
    email?: string;
    image?: string;
    isSubscribed?: boolean;
  }
}
