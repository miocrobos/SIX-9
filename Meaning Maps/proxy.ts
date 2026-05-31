import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"

const isPublicRoute = createRouteMatcher([
  "/",
  `${signInUrl}(.*)`,
  `${signUpUrl}(.*)`,
  "/api/knowledge/upload",
])

export const proxy = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const { pathname } = request.nextUrl

  // Signed-in users hitting the landing page → send straight to dashboard
  if (userId && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect all non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
