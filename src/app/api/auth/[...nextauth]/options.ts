import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { dbConnect } from "@/utils/db";

export const AuthOptions :NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        })
    ],
    callbacks:{
        async session({ session }) {
            return session;
        },
        async signIn({ profile }) {
            console.log(profile);
            try{
                await dbConnect();
                return true;
            }
            catch(error){
                console.log(error);
                
            }
            return false;
            
        }
    }
}