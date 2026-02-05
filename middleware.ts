import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/admin",
  "/user/dashboard",
  "/user/profile",
  "/user/tasks",
  "/user/categories",
  "/user/notifications",
];
const publicRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("auth-token")?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if route is public auth route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If it's a protected route and no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If logged in and trying to access auth pages, let API check-auth handle it
  // Don't verify JWT here since edge runtime doesn't support it

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
