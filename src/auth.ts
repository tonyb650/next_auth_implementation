import NextAuth, { NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";


/*
export const {
  handlers: { GET, POST},
  auth
} = NextAuth({
  providers: [GitHub]
})
*/

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {strategy: "jwt"},
  ...authConfig
}
const nextAuth = NextAuth(config)
const handlers = nextAuth.handlers
const GET = handlers.GET
const POST = handlers.POST
const auth = nextAuth.auth
export { GET, POST, auth}

