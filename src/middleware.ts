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
      !url.pathname.startsWith("/dashboard"))
  ) {
    // console.log("dashboard");

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // if (url.pathname.startsWith("/dashboard") && !token) {
  //   // console.log("not dashboard");
  //   return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  // }
}

export const config = {
  matcher: ["/auth/sign-up", "/auth/sign-in", "/dashboard"],
};
