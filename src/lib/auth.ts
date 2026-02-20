import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        displayName: { label: "Display Name", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const displayName = String(credentials?.displayName || "").trim();
        const mode = String(credentials?.mode || "signin");

        if (!email) {
          return null;
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (mode === "signup") {
          if (user) {
            return null;
          }
          user = await prisma.user.create({
            data: {
              email,
              displayName: displayName || email.split("@")[0],
            },
          });
        } else if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName || user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
