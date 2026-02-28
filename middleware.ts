import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Auth routes that should NOT require authentication
// These must be checked FIRST before protected routes
const authRoutes = [
  "/doctor/login",
  "/doctor/signup",
  "/nurse/login",
  "/nurse/signup",
  "/patient/login",
  "/patient/signup",
  "/auth",
];

// Protected routes that require authentication
// Dashboard routes for each role
const protectedRoutes = [
  "/patient/dashboard",
  "/patient/medications",
  "/patient/reports",
  "/doctor/dashboard",
  "/nurse/dashboard",
  "/nurse/patient", // Nurse viewing patient details
  "/admin",
  "/profile",
];

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Check if the current path is an auth route (login/signup) - CHECK FIRST
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Auth routes should be accessible to unauthenticated users
  // If authenticated user accesses auth routes, redirect to appropriate dashboard
  if (isAuthRoute) {
    if (user) {
      // User is logged in but trying to access login/signup page
      // Redirect to home where they can navigate to their dashboard
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow unauthenticated access to auth routes
    return supabaseResponse;
  }

  // If user is not authenticated and trying to access protected route
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/", request.url);
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
