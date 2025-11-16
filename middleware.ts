import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { i18nConfig } from "./i18nConfig";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/about(.*)",
  "/support-us(.*)",
  "/legal(.*)",
]);

// Default + supported locales
const defaultLocale = i18nConfig.defaultLocale || "en";
const supportedLocales = i18nConfig.locales || ["en"];

function detectLocale(req: NextRequest): string {
  // 1. Cookie
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Browser header
  const acceptLang = req.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang.split(",")[0].split("-")[0];
    if (supportedLocales.includes(preferred)) {
      return preferred;
    }
  }

  return defaultLocale;
}

export default clerkMiddleware(async (auth, req) => {
  // Do NOT localize API routes
  const path = req.nextUrl.pathname;
  if (path.includes("/api")) return NextResponse.next();

  // Protect non-public routes
  if (!isPublicRoute(req)) await auth.protect();

  // Detect locale
  const locale = detectLocale(req);

  // Set cookie so client can use it
  const res = NextResponse.next();
  res.cookies.set("NEXT_LOCALE", locale, { path: "/" });

  // Capture current pathname to use for server components
  res.headers.set("x-current-path", req.nextUrl.pathname);

  return res;
});

export const config = {
  matcher: [
    // Skip Next internals & static files, but DO run on everything else, even with dots (i.e., /classroom/common-cents/lesson-1.1)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // If you also want middleware on API routes, include this line; otherwise omit it.
    "/(api|trpc)(.*)",
  ],
};
