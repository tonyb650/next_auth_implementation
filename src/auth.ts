import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";
import prisma from "./lib/prisma";
import { getUserById } from "./services/user";




const config: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({user}) {
      await prisma.user.update({
        where: { id: user.id},
        data: { emailVerified: new Date()}
      })
    }
  },
  callbacks: {
    // async signIn({user}) {
    //   const existingUser = await getUserById(user.id)

    //   if (!existingUser || !existingUser.emailVerified) {
    //     return false
    //   }
    //   return true
    // },
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

export { auth, GET, POST, signIn, signOut };


/*
Traditional way to define our exports... cleaner code but a little harder to understand
export const {
  handlers: { GET, POST},
  auth
} = NextAuth({
  providers: [GitHub]
})
*/