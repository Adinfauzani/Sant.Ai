import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_DASHBOARD_ROLES = new Set(["Sudo", "Admin"]);
const AUTH_PATH = ["/auth/login", "/auth/register"];
const PROTECTED_PATHS = ["/dashboard", "/profile"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === AUTH_PATH[0]) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === AUTH_PATH[1]) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  if (
    !pathname.startsWith(PROTECTED_PATHS[0]) &&
    pathname !== PROTECTED_PATHS[1]
  ) {
    return;
  }

  const secureCookie = request.nextUrl.protocol === "https:";
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie,
  });

  if (pathname.startsWith("/dashboard")) {
    if (!token?.role || !ALLOWED_DASHBOARD_ROLES.has(token.role as string)) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/profile" && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
