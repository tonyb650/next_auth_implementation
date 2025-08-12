import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes"

const {auth} = NextAuth(authConfig)

export default auth((req) => {
  const {nextUrl} = req
  console.log("***MIDDLEWARE***   nextUrl = "+ nextUrl)
  console.log(req.auth)
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    console.log("All auth API routes allowed")
    return null
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)) // <-- Add nextUrl turns the URL into an *absolute* path
    }
    console.log("Not logged in. All Auth Routes allowed")
    return null
  }

  if (!isLoggedIn && !isPublicRoute) {  // <-- Trying to access private route when not logged in
    console.log("Attempting to access private route when not logged in")
    return Response.redirect(new URL("/auth/login" ,nextUrl))
  }

  return null
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}