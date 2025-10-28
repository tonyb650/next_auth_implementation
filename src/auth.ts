import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";
import prisma from "./lib/prisma";
import { getUserById } from "./services/user";
import { getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
import { getAccountByUserId } from "./services/account";


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
    signIn : async function ({user, account}) {
      if (account?.provider !== "credentials") return true
      
      const existingUser = await getUserById(user.id)
      
      if (! existingUser?.emailVerified) return false
      
      if (existingUser?.isTwoFactorEnabled) {
        // TODO instead of this, we can add an expires field to the TwoFactorConfirmation model so that the confirmation only needs to be done every x days
        const twoFactorConfirmation =  await getTwoFactorConfirmationByUserId(existingUser.id)
        
        if (!twoFactorConfirmation) return false
        
        await prisma.twoFactorConfirmation.delete({where: {id: twoFactorConfirmation.id}}) 
      }
      
      return true
    },
    async jwt({token}) {
      if (!token.sub) return token
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)
      token.isOAuth = !!existingAccount
      
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role as "ADMIN" | "USER"
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
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
      if(session.user) {
        session.user.name = token.name
        session.user.email = token.email || session.user.email
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.isOAuth = token.isOAuth as boolean
      }
      // console.log(session)
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