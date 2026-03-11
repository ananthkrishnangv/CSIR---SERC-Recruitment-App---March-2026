import CredentialsProvider from "next-auth/providers/credentials";
import { prisma, adminPrisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check Admin DB first
        try {
          const adminUser = await adminPrisma.adminUser.findUnique({
            where: { email: credentials.email }
          });

          if (adminUser && adminUser.password === credentials.password) {
            return {
              id: adminUser.id,
              email: adminUser.email,
              name: "Administrator",
              role: adminUser.role
            };
          }
        } catch (e) {
          console.error("Admin DB error:", e);
        }
        
        // Check Applicant DB
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (user && user.password === credentials.password) {
            return {
              id: user.id,
              email: user.email,
              name: user.name || "",
              role: user.role
            };
          }
        } catch (e) {
          console.error("Applicant DB error:", e);
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecretkey1234567890",
};
