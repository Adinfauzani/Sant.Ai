import next from "next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/auth/register") {
    return NextResponse.redirect(new URL("/register", request.url));
  }
}