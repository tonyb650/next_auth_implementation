import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";


/*
export const {
  handlers: { GET, POST},
  auth
} = NextAuth({
  providers: [GitHub]
})
*/

const nextAuth = NextAuth({providers: [GitHub]})
const handlers = nextAuth.handlers
const GET = handlers.GET
const POST = handlers.POST
const auth = nextAuth.auth
export { GET, POST, auth}

