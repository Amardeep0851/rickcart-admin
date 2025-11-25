import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/future"]);

// Allowed origins
const allowedOrigins = [process.env.NEXT_PUBLIC_ALLOW_URL_FROM_FRONTEND]; // dev frontend

export default clerkMiddleware(async (auth, request) => {
  const origin = request.headers.get("origin") || "";
  // Handle protected routes
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  // Start building the response
  const res = NextResponse.next();

  // Apply CORS only for API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    // Handle preflight OPTIONS requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        headers: res.headers,
        status: 204,
      });
    }
  }

  return res;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
