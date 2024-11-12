import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  // console.log("In middleware", token);

  if (
    token &&
    (url.pathname.startsWith("/auth") ||
      url.pathname.startsWith("/api/auth") ||
      !url.pathname.startsWith("/home"))
  ) {
    // console.log("dashboard");

    return NextResponse.redirect(new URL("/home/dashboard", request.url));
  }

  if (
    url.pathname.startsWith("/home") &&
    !url.pathname.startsWith("/home/settings") &&
    !token
  ) {
    // console.log("not dashboard");
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (url.pathname === "/home/settings") {
    // console.log("settings");
    return NextResponse.redirect(
      new URL("/home/settings/profile", request.url)
    );
  }
}

export const config = {
  matcher: ["/auth/sign-up", "/auth/sign-in", "/home/:slug*"],
};
