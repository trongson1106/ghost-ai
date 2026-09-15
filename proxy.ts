import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

function isPublicPath(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";
  return pathname.startsWith(signInUrl) || pathname.startsWith(signUpUrl);
}

export const proxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicPath(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
