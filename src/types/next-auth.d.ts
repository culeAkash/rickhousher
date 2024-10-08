import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    username?: string;
    email?: string;
    image?: string;
    isSubscribed?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string;
      image?: string;
      isSubscribed?: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
    username?: string;
    email?: string;
    image?: string;
    isSubscribed?: boolean;
  }
}
