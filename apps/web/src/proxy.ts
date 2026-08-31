import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // Login-required workspace
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Public pages: once logged in, focus on the profile (home is reachable again after logout)
  if (session) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/",
    "/about/:path*",
    "/ai/:path*",
    "/articles/:path*",
    "/community/:path*",
    "/contact/:path*",
    "/events/:path*",
    "/intelligence/:path*",
    "/legal/:path*",
    "/projects/:path*",
    "/showcase/:path*",
    "/status/:path*",
  ],
};
