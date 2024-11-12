import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";

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

        try {
          const user = await db.user.findFirst({
            where: {
              OR: [
                { email: credentials.identifier },
                { username: credentials.identifier },
              ],
            },
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

      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.isSubscribed = token.isSubscribed as boolean;
      }

      return session;
    },
    async jwt({ token, user }) {
      // console.log("Inside jwt callback");

      // console.log("token : ", token);
      // console.log("user : ", user);
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.image = user.image;
        token.isSubscribed = user.isSubscribed;
      }
      return token;
    },
    async signIn({ profile, account, user }) {
      // console.log("Inside profile callback");

      // console.log(profile);
      // console.log(account);
      // console.log(user);

      try {
        const userExists = await db.user.findFirst({
          where: {
            email: profile?.email ?? user?.email,
          },
        });

        // console.log(user);

        let savedUser = userExists;

        if (!userExists) {
          //create new user
          savedUser = await db.user.create({
            data: {
              username: profile?.login ?? (profile?.email as string),
              email: profile?.email as string,
              image:
                (profile?.picture as string) ??
                (profile?.avatar_url as string) ??
                "",
              isSubscribed: false,
              provider: account?.provider,
            },
          });
        }

        user.id = savedUser?.id as string;
        user.username = savedUser?.username;
        user.isSubscribed = savedUser?.isSubscribed;

        // console.log(user);

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
