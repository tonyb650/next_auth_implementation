import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import { getUserById } from "./services/user";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: "ADMIN" | "USER"
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }
}


const config: NextAuthConfig = {
  callbacks: {
    async jwt({token}) {

      if (!token.sub) return token
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token
      token.role = existingUser.role as "ADMIN" | "USER"
      return token
    },
    async session({ token, session}) {
      // session.customField = token.sub
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if(token.role && session.user) {
        session.user.role = token.role  as "ADMIN" | "USER"
      }
      console.log(session)
      return session
    }
  },
  adapter: PrismaAdapter(prisma),
  session: {strategy: "jwt"},
  ...authConfig
}
const nextAuth = NextAuth(config)
const handlers = nextAuth.handlers
const GET = handlers.GET
const POST = handlers.POST
const auth = nextAuth.auth
const signIn = nextAuth.signIn
const signOut = nextAuth.signOut
export { GET, POST, auth, signIn, signOut}


/*
Traditional way to define our exports... cleaner code but a little harder to understand
export const {
  handlers: { GET, POST},
  auth
} = NextAuth({
  providers: [GitHub]
})
*/