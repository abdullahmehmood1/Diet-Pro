import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Authorize called with:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user) {
                    console.log("User not found:", credentials.email);
                    return null;
                }

                console.log("User found, comparing password...");
                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    console.log("Invalid password for user:", credentials.email);
                    return null;
                }

                console.log("Login successful for:", credentials.email);
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            console.log("Session callback:", token?.id);
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            console.log("JWT callback:", user?.id);
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
};
