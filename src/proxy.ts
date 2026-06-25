import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_DASHBOARD_ROLES = new Set(["Sudo", "Admin"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/auth/register") {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isProfile = pathname === "/profile";

  if (!isDashboard && !isProfile) return;

  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isLoggedIn = !!sessionCookie?.value;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isDashboard) {
    return NextResponse.next();
  }

  if (isProfile && isLoggedIn) {
    return NextResponse.next();
  }
}
