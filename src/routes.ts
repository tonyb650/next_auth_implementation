

/***************************************/
/* These are consumed by middleware.ts */
/***************************************/

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const publicRoutes: string[] = [
  "/",
  "/auth/new-verification",
]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
*/
export const authRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/new-verification",
  "/auth/reset",
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix: string = "/api/auth"

/**
 * The default redirect path after logging in
 * 
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/settings"