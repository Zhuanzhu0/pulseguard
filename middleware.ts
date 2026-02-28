import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/patient",
  "/doctor",
  "/nurse",
  "/admin",
];

// Auth routes that should redirect to dashboard if already logged in
const authRoutes = ["/login", "/signup", "/auth"];

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname.includes(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname.startsWith(route) || pathname.includes(route)
  );

  // If user is not authenticated and trying to access protected route
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/", request.url);
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated and trying to access auth routes, redirect to appropriate dashboard
  if (user && isAuthRoute) {
    // TODO: Get user role from database/metadata and redirect to appropriate dashboard
    // For now, redirect to home page where they can navigate
    return NextResponse.redirect(new URL("/", request.url));
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
