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
  "/:locale/legal(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect routes that are NOT public
  if (!isPublicRoute(req)) await auth.protect();

  // Do NOT localize API routes
  const path = req.nextUrl.pathname;
  if (path.includes("/api")) return;

  return i18nRouter(req, i18nConfig);
});

export const config = { matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"] };

// const isL2Route = createRouteMatcher(["/admin(.*)"]); // Parents, Teachers, Admin, and Super Admin
// const isL3Route = createRouteMatcher(["/admin(.*)"]); // Teachers, Admin, and Super Admin
// const isL4Route = createRouteMatcher(["/admin(.*)"]); // Admin and Super Admin
// const isL5Route = createRouteMatcher(["/admin(.*)"]); // Super Admin route
