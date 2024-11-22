import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/about",
  "/support-us",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
  return i18nRouter(request, i18nConfig);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)", // Clerk - API routes
    "/((?!api|static|.*\\..*|_next).*)", // i18nexus - API routes
  ],
};
