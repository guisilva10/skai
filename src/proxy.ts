import { NextRequest, NextResponse } from "next/server";
import { getUrl } from "./app/_lib/get-url";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get(
    process.env.SESSION_COOKIE_NAME || "skai.session-token",
  );
  const pathname = request.nextUrl.pathname;

  if (pathname === "/auth" && token) {
    const redirectUrl = getUrl("/app");
    console.log(`Redirecionando para: ${redirectUrl}`);
    return NextResponse.redirect(new URL(getUrl("/app")));
  }

  if (pathname.includes("/app") && !token) {
    const redirectUrl = getUrl("/auth");
    console.log(`Redirecionando para: ${redirectUrl}`);
    return NextResponse.redirect(new URL(getUrl("/auth")));
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
