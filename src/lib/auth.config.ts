import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

/**
 * Edge-compatible auth config for middleware.
 * This file has NO Prisma, NO bcrypt — only JWT decode/encode.
 * The full config with Prisma lives in src/lib/auth.ts.
 */
export const authConfig = {
  session: { strategy: "jwt" as const },
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // This authorize is never called in middleware — middleware only
      // decodes the existing JWT cookie. We return null so TS is happy.
      async authorize() {
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "SUPER_ADMIN" | "ADMIN" | "EDITOR" | undefined) ?? "EDITOR"
        session.user.id = (token.id as string) ?? ""
      }
      return session
    },
  },
} satisfies NextAuthConfig
