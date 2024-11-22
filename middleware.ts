import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/:locale",
  "/:locale/about(.*)",
  "/:locale/support-us(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect routes that are NOT public
  if (!isPublicRoute(req)) await auth.protect();

  // Do NOT localize API routes
  const path = req.nextUrl.pathname;
  if (path.includes("/api")) return;

  return i18nRouter(req, i18nConfig);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // "/(api|trpc)(.*)", // Clerk - API routes
    // "/((?!api|static|.*\\..*|_next).*)", // i18nexus - API routes
    "/((?!static|.*\\..*|_next).*)", // Source: https://stackoverflow.com/questions/78441347/next-intl-integration-with-clerk
  ],
};
