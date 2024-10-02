import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { dbConnect } from "@/utils/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export const AuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { type: "string" },
        password: { type: "string" },
      },
      async authorize(credentials: any): Promise<any> {
        // console.log(req);

        await dbConnect();
        // console.log(credentials);
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          console.log("Check password");

          if (!user) {
            throw new Error("User not registered");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
          console.log(error);
          throw new Error(`Unable to signin user ${error}`);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // console.log("Inside session callback");

      // console.log("session : ", session);
      // console.log("token : ", token);

      return session;
    },
    async jwt({ token, user }) {
      // console.log("Inside jwt callback");

      // console.log("token : ", token);
      // console.log("user : ", user);

      return token;
    },
    async signIn({ profile, account, user }) {
      console.log("Inside profile callback");

      console.log(profile);
      console.log(account);
      console.log(user);

      try {
        await dbConnect();

        const userExists = await UserModel.findOne({
          email: profile?.email ?? user?.email,
        });

        if (!userExists) {
          //create new user
          const newUser = new UserModel({
            username: profile?.login ?? "",
            email: profile?.email,
            image:
              (profile?.picture as string) ??
              (profile?.avatar_url as string) ??
              "",
            isSubscribed: false,
            provider: account?.provider,
          });

          await newUser.save();
        }

        console.log("User created");
        return true;
      } catch (error) {
        console.log(error);
      }
      return false;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
